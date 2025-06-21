const db = require('../configDB/database');

// Listar asistencias (con filtros opcionales)
exports.getAllAsistencias = (req, res) => {
    const { fecha, usuario } = req.query;
    let sql = 'SELECT * FROM asistencia';
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

// Crear asistencia
exports.createAsistencia = (req, res) => {
    const { id_usuario, fecha, hora_entrada, hora_salida, corregida } = req.body;
    db.query(
        'INSERT INTO asistencia (id_usuario, fecha, hora_entrada, hora_salida, corregida) VALUES (?, ?, ?, ?, ?)',
        [
            id_usuario,
            fecha,
            hora_entrada,
            hora_salida ? hora_salida : null, // Guarda NULL si es null, undefined o string vacío
            corregida
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Asistencia creada' });
        }
    );
};

// Editar asistencia (por ejemplo, para corregir)
exports.updateAsistencia = (req, res) => {
    const { id } = req.params;
    const { hora_entrada, hora_salida, corregida } = req.body;
    db.query(
        'UPDATE asistencia SET hora_entrada=?, hora_salida=?, corregida=? WHERE id_asistencia=?',
        [
            hora_entrada,
            hora_salida ? hora_salida : null, // Guarda NULL si es null, undefined o string vacío
            corregida,
            id
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Asistencia actualizada' });
        }
    );
};

exports.deleteAsistencia = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM asistencia WHERE id_asistencia=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Asistencia eliminada' });
    });
};