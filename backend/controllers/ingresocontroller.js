const db = require('../configDB/database');

// Listar ingresos
exports.getAllIngresos = (req, res) => {
    db.query(
        `SELECT i.id_ingreso, i.fecha, p.nombre AS producto, pr.nombre AS proveedor, i.cantidad, i.precio_unitario, i.subtotal
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
            res.json({ message: 'Ingreso creado' });
        }
    );
};

// Editar ingreso
exports.updateIngreso = (req, res) => {
    const { id } = req.params;
    const { fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal } = req.body;
    db.query(
        'UPDATE ingreso_stock SET fecha=?, id_producto=?, id_proveedor=?, cantidad=?, precio_unitario=?, subtotal=? WHERE id_ingreso=?',
        [fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Ingreso actualizado' });
        }
    );
};

// Eliminar ingreso
exports.deleteIngreso = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ingreso_stock WHERE id_ingreso=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Ingreso eliminado' });
    });
};