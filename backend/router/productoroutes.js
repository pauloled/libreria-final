const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productocontroller');

// Obtener lista de productos
router.get('/', productoController.getAllProductos);

// Crear producto
router.post('/', productoController.createProducto);

// Editar producto
router.put('/:id', productoController.updateProducto);

// Eliminar producto
router.delete('/:id', productoController.deleteProducto);

module.exports = router;
