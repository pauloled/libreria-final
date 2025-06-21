const db = require('../configDB/database');

// Obtener todos los productos con nombre de categoría y marca
exports.getAllProductos = (req, res) => {
    const sql = `
        SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock,  
               p.id_categoria, c.nombre_categoria, p.id_marca, m.nombre_marca, p.imagen_url
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
        LEFT JOIN marca m ON p.id_marca = m.id_marca
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.createProducto = (req, res) => {
    const { nombre, descripcion, precio, stock, id_categoria, id_marca, imagen_url } = req.body;
    db.query(
        'INSERT INTO producto (nombre, descripcion, precio, stock, id_categoria, id_marca, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, precio, stock, id_categoria, id_marca, imagen_url],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Producto creado' });
        }
    );
};

exports.updateProducto = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, id_categoria, id_marca, imagen_url } = req.body;
    db.query(
        'UPDATE producto SET nombre=?, descripcion=?, precio=?, stock=?, id_categoria=?, id_marca=?, imagen_url=? WHERE id_producto=?',
        [nombre, descripcion, precio, stock, id_categoria, id_marca, imagen_url, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Producto actualizado' });
        }
    );
};

exports.deleteProducto = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM producto WHERE id_producto=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Producto eliminado' });
    });
};