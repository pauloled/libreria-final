const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuariocontroller');

// Listar usuarios
router.get('/', usuarioController.getAllUsuarios);

// Crear usuario
router.post('/', usuarioController.createUsuario);

// Editar usuario
router.put('/:id', usuarioController.updateUsuario);

// Eliminar usuario
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;