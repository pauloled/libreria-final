const fs = require('fs');
const path = require('path');

exports.getImagenes = (req, res) => {
    const assetsPath = path.join(__dirname, '../../frontend/public/assets');
    fs.readdir(assetsPath, (err, files) => {
        if (err) return res.status(500).json({ error: 'No se pudieron leer las imágenes.' });
        // Filtrar solo imágenes comunes
        const imagenes = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
        res.json(imagenes);
    });
};