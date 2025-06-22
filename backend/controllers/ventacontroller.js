const db = require('../configDB/database');

// Listar ventas con detalles, usuario y métodos de pago
exports.getAllVentas = (req, res) => {
    const { fecha, usuario } = req.query;
    let sql = `
        SELECT v.id_venta, v.fecha, v.hora, v.total, u.nombre_usuario, v.id_usuario,
            GROUP_CONCAT(DISTINCT CONCAT(p.nombre, ' (x', dv.cantidad, ')') SEPARATOR ', ') AS articulos,
            GROUP_CONCAT(dv.cantidad) AS cantidades,
            GROUP_CONCAT(dv.subtotal) AS subtotales,
            GROUP_CONCAT(CONCAT(mp.tipo, ': $', mp.monto) SEPARATOR ', ') AS metodos_pago
        FROM venta v
        LEFT JOIN usuario u ON v.id_usuario = u.id_usuario
        LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
        LEFT JOIN producto p ON dv.id_producto = p.id_producto
        LEFT JOIN metodo_pago mp ON v.id_venta = mp.id_venta
    `;
    let params = [];
    let where = [];
    if (fecha) {
        where.push('DATE(v.fecha)=?');
        params.push(fecha);
    }
    if (usuario) {
        where.push('v.id_usuario=?');
        params.push(usuario);
    }
    if (where.length) {
        sql += ' WHERE ' + where.join(' AND ');
    }
    sql += ' GROUP BY v.id_venta ORDER BY v.fecha DESC, v.id_venta DESC';
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Crear venta con métodos de pago
exports.createVenta = (req, res) => {
    const { fecha, hora, total, id_usuario, detalles, metodos_pago } = req.body;
    db.query(
        'INSERT INTO venta (fecha, hora, total, id_usuario) VALUES (?, ?, ?, ?)',
        [fecha, hora, total, id_usuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            const id_venta = result.insertId;
            // Insertar detalles
            const detalleValues = detalles.map(d =>
                [id_venta, d.id_producto, d.cantidad, d.subtotal]
            );
            db.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES ?',
                [detalleValues],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2 });
                    // Insertar métodos de pago
                    if (Array.isArray(metodos_pago) && metodos_pago.length > 0) {
                        const mpValues = metodos_pago.map(mp =>
                            [id_venta, mp.tipo, mp.monto]
                        );
                        db.query(
                            'INSERT INTO metodo_pago (id_venta, tipo, monto) VALUES ?',
                            [mpValues],
                            (err3) => {
                                if (err3) return res.status(500).json({ error: err3 });
                                descontarStock();
                            }
                        );
                    } else {
                        descontarStock();
                    }
                    // Descontar stock
                    function descontarStock() {
                        let queries = detalles.map(d =>
                            new Promise((resolve, reject) => {
                                db.query(
                                    'UPDATE producto SET stock = stock - ? WHERE id_producto = ?',
                                    [d.cantidad, d.id_producto],
                                    (err4) => {
                                        if (err4) reject(err4);
                                        else resolve();
                                    }
                                );
                            })
                        );
                        Promise.all(queries)
                            .then(() => res.json({ message: 'Venta creada y stock descontado' }))
                            .catch(error => res.status(500).json({ error }));
                    }
                }
            );
        }
    );
};

// Eliminar venta y sus detalles
exports.deleteVenta = (req, res) => {
    const { id } = req.params;
    // 1. Obtener los detalles de la venta
    db.query('SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta=?', [id], (err, detalles) => {
        if (err) return res.status(500).json({ error: err });
        // 2. Reponer stock de cada producto
        let queries = detalles.map(d =>
            new Promise((resolve, reject) => {
                db.query(
                    'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
                    [d.cantidad, d.id_producto],
                    (err2) => {
                        if (err2) reject(err2);
                        else resolve();
                    }
                );
            })
        );
        Promise.all(queries)
            .then(() => {
                // 3. Eliminar detalles y venta
                db.query('DELETE FROM detalle_venta WHERE id_venta=?', [id], (err3) => {
                    if (err3) return res.status(500).json({ error: err3 });
                    db.query('DELETE FROM venta WHERE id_venta=?', [id], (err4) => {
                        if (err4) return res.status(500).json({ error: err4 });
                        res.json({ message: 'Venta eliminada y stock repuesto' });
                    });
                });
            })
            .catch(error => res.status(500).json({ error }));
    });
};

// Editar venta
exports.updateVenta = (req, res) => {
    const { id } = req.params;
    const { fecha, total, id_usuario, detalles } = req.body;

    // 1. Obtener detalles anteriores
    db.query('SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta=?', [id], (err, detallesAnt) => {
        if (err) return res.status(500).json({ error: err });

        // 2. Reponer stock de los productos anteriores
        let reponerQueries = detallesAnt.map(d =>
            new Promise((resolve, reject) => {
                db.query(
                    'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
                    [d.cantidad, d.id_producto],
                    (err2) => {
                        if (err2) reject(err2);
                        else resolve();
                    }
                );
            })
        );

        Promise.all(reponerQueries)
            .then(() => {
                // 3. Actualizar venta
                db.query(
                    'UPDATE venta SET fecha=?, total=?, id_usuario=? WHERE id_venta=?',
                    [fecha, total, id_usuario, id],
                    (err3) => {
                        if (err3) return res.status(500).json({ error: err3 });

                        // 4. Eliminar detalles anteriores
                        db.query('DELETE FROM detalle_venta WHERE id_venta=?', [id], (err4) => {
                            if (err4) return res.status(500).json({ error: err4 });

                            // 5. Insertar nuevos detalles
                            const detalleValues = detalles.map(d =>
                                [id, d.id_producto, d.cantidad, d.subtotal]
                            );
                            db.query(
                                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES ?',
                                [detalleValues],
                                (err5) => {
                                    if (err5) return res.status(500).json({ error: err5 });

                                    // 6. Descontar stock de los nuevos productos
                                    let descontarQueries = detalles.map(d =>
                                        new Promise((resolve, reject) => {
                                            db.query(
                                                'UPDATE producto SET stock = stock - ? WHERE id_producto = ?',
                                                [d.cantidad, d.id_producto],
                                                (err6) => {
                                                    if (err6) reject(err6);
                                                    else resolve();
                                                }
                                            );
                                        })
                                    );
                                    Promise.all(descontarQueries)
                                        .then(() => res.json({ message: 'Venta actualizada y stock ajustado' }))
                                        .catch(error => res.status(500).json({ error }));
                                }
                            );
                        });
                    }
                );
            })
            .catch(error => res.status(500).json({ error }));
    });
};