const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/ingresocontroller');

router.get('/', ingresoController.getAllIngresos);
router.post('/', ingresoController.createIngreso);
router.put('/:id', ingresoController.updateIngreso);
router.delete('/:id', ingresoController.deleteIngreso);

module.exports = router;