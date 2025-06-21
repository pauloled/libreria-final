const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorcontroller');

router.get('/', proveedorController.getAllProveedores);
router.post('/', proveedorController.createProveedor);
router.put('/:id', proveedorController.updateProveedor);
router.delete('/:id', proveedorController.deleteProveedor);

module.exports = router;