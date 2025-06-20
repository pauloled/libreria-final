const db = require('../configDB/database');

// Obtener todos los usuarios
exports.getAllUsuarios = (req, res) => {
    db.query('SELECT id_usuario, nombre_usuario, correo, rol, fecha_registro FROM usuario', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Crear usuario
exports.createUsuario = (req, res) => {
    const { nombre_usuario, correo, contrasena, rol } = req.body;
    const fecha_registro = new Date();
    db.query(
        'INSERT INTO usuario (nombre_usuario, correo, contrasena, fecha_registro, rol) VALUES (?, ?, ?, ?, ?)',
        [nombre_usuario, correo, contrasena, fecha_registro, rol],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Usuario creado' });
        }
    );
};

// Editar usuario
exports.updateUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, correo, contrasena, rol } = req.body;
    db.query(
        'UPDATE usuario SET nombre_usuario=?, correo=?, contrasena=?, rol=? WHERE id_usuario=?',
        [nombre_usuario, correo, contrasena, rol, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Usuario actualizado' });
        }
    );
};

// Eliminar usuario
exports.deleteUsuario = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuario WHERE id_usuario=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario eliminado' });
    });
};