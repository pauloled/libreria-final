// router/authroutes.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `
        SELECT id_usuario, nombre_usuario, rol 
        FROM usuario 
        WHERE nombre_usuario = ? AND contrasena = ?
    `;

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error en login:', err);
            res.status(500).json({ error: 'Error en login' });
        } else if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    });
});

module.exports = router;
