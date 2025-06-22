const express = require('express');
const router = express.Router();
const imagenesController = require('../controllers/imagenescontroller');

router.get('/', imagenesController.getImagenes);

module.exports = router;