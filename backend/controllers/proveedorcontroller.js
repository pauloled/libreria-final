const db = require('../configDB/database');

// Listar proveedores
exports.getAllProveedores = (req, res) => {
    db.query('SELECT * FROM proveedor', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Crear proveedor
exports.createProveedor = (req, res) => {
    const { nombre, email, telefono } = req.body;
    db.query(
        'INSERT INTO proveedor (nombre, email, telefono) VALUES (?, ?, ?)',
        [nombre, email, telefono],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Proveedor creado' });
        }
    );
};

// Editar proveedor
exports.updateProveedor = (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;
    db.query(
        'UPDATE proveedor SET nombre=?, email=?, telefono=? WHERE id_proveedor=?',
        [nombre, email, telefono, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Proveedor actualizado' });
        }
    );
};

// Eliminar proveedor
exports.deleteProveedor = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM proveedor WHERE id_proveedor=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Proveedor eliminado' });
    });
};