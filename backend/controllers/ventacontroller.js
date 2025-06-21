const db = require('../configDB/database');

// Listar ventas con detalles y usuario
exports.getAllVentas = (req, res) => {
    const { fecha, usuario } = req.query;
    let sql = `
        SELECT v.id_venta, v.fecha, v.total, u.nombre_usuario, 
            GROUP_CONCAT(CONCAT(p.nombre, ' (x', dv.cantidad, ')') SEPARATOR ', ') AS articulos,
            GROUP_CONCAT(dv.cantidad) AS cantidades,
            GROUP_CONCAT(dv.subtotal) AS subtotales
        FROM venta v
        LEFT JOIN usuario u ON v.id_usuario = u.id_usuario
        LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
        LEFT JOIN producto p ON dv.id_producto = p.id_producto
    `;
    let params = [];
    let where = [];
    if (fecha) {
        where.push('v.fecha=?');
        params.push(fecha);
    }
    if (usuario) {
        where.push('v.id_usuario=?');
        params.push(usuario);
    }
    if (where.length) {
        sql += ' WHERE ' + where.join(' AND ');
    }
    sql += ' GROUP BY v.id_venta ORDER BY v.fecha DESC, v.id_venta DESC';
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Crear venta (simplificado, deberías agregar validaciones y manejo de stock)
exports.createVenta = (req, res) => {
    const { fecha, total, id_usuario, detalles } = req.body;
    db.query(
        'INSERT INTO venta (fecha, total, id_usuario) VALUES (?, ?, ?)',
        [fecha, total, id_usuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            const id_venta = result.insertId;
            // Insertar detalles
            const detalleValues = detalles.map(d =>
                [id_venta, d.id_producto, d.cantidad, d.subtotal]
            );
            db.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES ?',
                [detalleValues],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2 });
                    res.json({ message: 'Venta creada' });
                }
            );
        }
    );
};

// Eliminar venta y sus detalles
exports.deleteVenta = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM detalle_venta WHERE id_venta=?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        db.query('DELETE FROM venta WHERE id_venta=?', [id], (err2) => {
            if (err2) return res.status(500).json({ error: err2 });
            res.json({ message: 'Venta eliminada' });
        });
    });
};