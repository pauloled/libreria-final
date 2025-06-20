const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventacontroller');

router.get('/', ventaController.getAllVentas);
router.post('/', ventaController.createVenta);
router.delete('/:id', ventaController.deleteVenta);

module.exports = router;