const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciacontroller');

router.get('/', asistenciaController.getAllAsistencias);
router.post('/', asistenciaController.createAsistencia);
router.put('/:id', asistenciaController.updateAsistencia);
router.delete('/:id', asistenciaController.deleteAsistencia);

module.exports = router;