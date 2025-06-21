const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productocontroller');
const db = require('../configDB/database');

// Obtener lista de productos
router.get('/', productoController.getAllProductos);

// Crear producto
router.post('/', productoController.createProducto);

// Editar producto
router.put('/:id', productoController.updateProducto);

// Eliminar producto
router.delete('/:id', productoController.deleteProducto);

// Obtener lista de categorías
router.get('/categorias', (req, res) => {
  db.query('SELECT id_categoria, nombre_categoria FROM categoria', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Obtener lista de marcas
router.get('/marcas', (req, res) => {
  db.query('SELECT id_marca, nombre_marca FROM marca', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;