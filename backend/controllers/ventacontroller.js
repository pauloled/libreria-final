const db = require('../configDB/database');

// Listar ventas (con filtros opcionales)
exports.getAllVentas = (req, res) => {
    const { fecha, usuario } = req.query;
    let sql = 'SELECT * FROM venta';
    let params = [];
    if (fecha && usuario) {
        sql += ' WHERE fecha=? AND id_usuario=?';
        params = [fecha, usuario];
    } else if (fecha) {
        sql += ' WHERE fecha=?';
        params = [fecha];
    } else if (usuario) {
        sql += ' WHERE id_usuario=?';
        params = [usuario];
    }
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Crear venta
exports.createVenta = (req, res) => {
    const { fecha, articulos, cantidad, precio_unitario, total, id_usuario } = req.body;
    db.query(
        'INSERT INTO venta (fecha, articulos, cantidad, precio_unitario, total, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
        [fecha, articulos, cantidad, precio_unitario, total, id_usuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Venta creada' });
        }
    );
};

// Eliminar venta
exports.deleteVenta = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM venta WHERE id_venta=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Venta eliminada' });
    });
};