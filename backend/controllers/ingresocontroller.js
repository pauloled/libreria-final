const db = require('../configDB/database');

// Listar ingresos
exports.getAllIngresos = (req, res) => {
    db.query('SELECT * FROM ingreso', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Crear ingreso
exports.createIngreso = (req, res) => {
    const { id_producto, cantidad, proveedor, precio_unitario, total } = req.body;
    db.query(
        'INSERT INTO ingreso (id_producto, cantidad, proveedor, precio_unitario, total) VALUES (?, ?, ?, ?, ?)',
        [id_producto, cantidad, proveedor, precio_unitario, total],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Ingreso creado' });
        }
    );
};

// Editar ingreso
exports.updateIngreso = (req, res) => {
    const { id } = req.params;
    const { id_producto, cantidad, proveedor, precio_unitario, total } = req.body;
    db.query(
        'UPDATE ingreso SET id_producto=?, cantidad=?, proveedor=?, precio_unitario=?, total=? WHERE id_ingreso=?',
        [id_producto, cantidad, proveedor, precio_unitario, total, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Ingreso actualizado' });
        }
    );
};

// Eliminar ingreso
exports.deleteIngreso = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ingreso WHERE id_ingreso=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Ingreso eliminado' });
    });
};