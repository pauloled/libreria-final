const db = require('../configDB/database');

// Listar ingresos
exports.getAllIngresos = (req, res) => {
    db.query(
        `SELECT i.id_ingreso, i.fecha, p.nombre AS producto, pr.nombre AS proveedor, i.cantidad, i.precio_unitario, i.subtotal, i.id_proveedor
         FROM ingreso_stock i
         LEFT JOIN producto p ON i.id_producto = p.id_producto
         LEFT JOIN proveedor pr ON i.id_proveedor = pr.id_proveedor
         ORDER BY i.fecha DESC, i.id_ingreso DESC`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};

// Crear ingreso
exports.createIngreso = (req, res) => {
    const { fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal } = req.body;
    db.query(
        'INSERT INTO ingreso_stock (fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            // Actualizar el stock del producto
            db.query(
                'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
                [cantidad, id_producto],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2 });
                    res.json({ message: 'Ingreso creado y stock actualizado' });
                }
            );
        }
    );
};

// Editar ingreso
exports.updateIngreso = (req, res) => {
    const { id } = req.params;
    const { fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal } = req.body;

    // 1. Obtener la cantidad anterior y el producto anterior
    db.query('SELECT cantidad, id_producto FROM ingreso_stock WHERE id_ingreso=?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Ingreso no encontrado' });

        const cantidadAnterior = results[0].cantidad;
        const productoAnterior = results[0].id_producto;

        // 2. Actualizar el ingreso
        db.query(
            'UPDATE ingreso_stock SET fecha=?, id_producto=?, id_proveedor=?, cantidad=?, precio_unitario=?, subtotal=? WHERE id_ingreso=?',
            [fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal, id],
            (err2) => {
                if (err2) return res.status(500).json({ error: err2 });

                // 3. Si el producto cambió, revertir stock al producto anterior y sumar al nuevo
                if (productoAnterior !== id_producto) {
                    db.query('UPDATE producto SET stock = stock - ? WHERE id_producto = ?', [cantidadAnterior, productoAnterior], (err3) => {
                        if (err3) return res.status(500).json({ error: err3 });
                        db.query('UPDATE producto SET stock = stock + ? WHERE id_producto = ?', [cantidad, id_producto], (err4) => {
                            if (err4) return res.status(500).json({ error: err4 });
                            res.json({ message: 'Ingreso actualizado y stock ajustado' });
                        });
                    });
                } else {
                    // 4. Si es el mismo producto, solo ajustar la diferencia
                    const diferencia = cantidad - cantidadAnterior;
                    db.query('UPDATE producto SET stock = stock + ? WHERE id_producto = ?', [diferencia, id_producto], (err5) => {
                        if (err5) return res.status(500).json({ error: err5 });
                        res.json({ message: 'Ingreso actualizado y stock ajustado' });
                    });
                }
            }
        );
    });
};;

// Eliminar ingreso
exports.deleteIngreso = (req, res) => {
    const { id } = req.params;
    // 1. Obtener la cantidad y producto del ingreso
    db.query('SELECT cantidad, id_producto FROM ingreso_stock WHERE id_ingreso=?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Ingreso no encontrado' });

        const cantidad = results[0].cantidad;
        const id_producto = results[0].id_producto;

        // 2. Restar stock
        db.query('UPDATE producto SET stock = stock - ? WHERE id_producto = ?', [cantidad, id_producto], (err2) => {
            if (err2) return res.status(500).json({ error: err2 });

            // 3. Eliminar el ingreso
            db.query('DELETE FROM ingreso_stock WHERE id_ingreso=?', [id], (err3) => {
                if (err3) return res.status(500).json({ error: err3 });
                res.json({ message: 'Ingreso eliminado y stock ajustado' });
            });
        });
    });
};