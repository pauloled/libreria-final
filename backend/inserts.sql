USE libreria;
-- Insertar usuarios
INSERT INTO usuario (nombre_usuario, correo, contrasena, fecha_registro, rol) VALUES
('admin', 'admin@libreria.com', '123', NOW(), 'admin'),
('empleado1', 'empleado1@libreria.com', '123', NOW(), 'empleado'),
('encargado1', 'encargado1@libreria.com', '123', NOW(), 'encargado'),
('Max Verstappen', 'supermaxx1@libreria.com', '123', NOW(), 'empleado'),
('Kimi Antonelli', 'kimimercedes@libreria.com', '123', NOW(), 'empleado'),
('Olie Bearman', 'oliehaas@libreria.com', '123', NOW(), 'encargado'),
('luisrodriguez', 'luisrodriguez@libreria.com', '123', NOW(), 'empleado'),
('andreslopez', 'andreslopez@libreria.com', '123', NOW(), 'empleado'),
('patriciamartinez', 'patriciamartinez@libreria.com', '123', NOW(), 'encargado'),
('carlossosa', 'carlossosa@libreria.com', '123', NOW(), 'empleado');

-- Insertar categorías
INSERT INTO categoria (nombre_categoria) VALUES
('Cuadernos'),
('Lapiceras'),
('Marcadores'),
('Papel'),
('Cartucheras'),
('Pegamentos'),
('Pinceles'),
('Tijeras'),
('Artistico'),
('Mochilas'),
('Accesorios');

-- Insertar marcas
INSERT INTO marca (nombre_marca) VALUES
('Faber-Castell'),
('Pelikan'),
('BIC'),
('Maped'),
('Pilot'),
('Staedtler'),
('Jansport'),
('Rivadavia'),
('Ledesma'),
('Patito'),
('Pritt'),
('Pizzini');

-- Insertar productos
INSERT INTO producto (nombre, descripcion, precio, stock, id_categoria, id_marca, imagen_url) VALUES
('Cuaderno Rivadavia', 'Cuaderno de 48 hojas', 350.00, 100, 1, 8, 'cuaderno.jpg'),
('Lapicera BIC azul', 'Lapicera tinta azul', 120.00, 200, 2, 3, 'lapicera2.jpg'),
('Marcador permanente negro', 'Marcador indeleble', 220.00, 150, 3, 2, 'marcadoralagua.jpg'),
('Mochila Jansport', 'Mochila chica unisex', 1800.00, 50, 10, 7, 'mochila5.jpg'),
('Cartuchera triple cierre', 'Cartuchera con 3 compartimientos', 2500.00, 40, 5, 4, 'cartuchera3.jpg'),
('Pegamento en barra', 'Pritt 20g', 550.00, 80, 6, 11, 'pegamentoenbarra.jpg'),
('Pincel N°6', 'Pincel pelo suave', 450.00, 70, 7, 1, 'pingelgoya.jpg'),
('Tijera escolar', 'Tijera para niños', 650.00, 90, 8, 4, 'Tijera.jpg'),
('Resaltador Pizarra negro', 'Resaltador al agua para pizarrón', 380.00, 110, 3, 12, 'marcadorpizarra.jpg'),
('Lapicera Pilot G2', 'Lapicera gel', 600.00, 75, 2, 5, 'lapicera2.jpg');

-- Insertar proveedores
INSERT INTO proveedor (nombre, email, telefono) VALUES
('Distribuidora Centro', 'centro@proveedor.com', '1122334455'),
('Papelera Sur', 'sur@proveedor.com', '1144556677'),
('Mayorista Norte', 'norte@proveedor.com', '1166778899'),
('Papelería Don Pepe', 'donpepe@proveedor.com', '1177889900'),
('Importadora Global', 'global@proveedor.com', '1155667788'),
('Artículos Escolares SA', 'escolares@proveedor.com', '1122446688'),
('Oficinas SRL', 'oficinas@proveedor.com', '1133557799'),
('Insumos del Oeste', 'oeste@proveedor.com', '1199887766'),
('Papelería Express', 'express@proveedor.com', '1144221133'),
('Distribuciones La Plata', 'laplata@proveedor.com', '1122113344');

-- Insertar ingresos de stock
INSERT INTO ingreso_stock (fecha, id_producto, id_proveedor, cantidad, precio_unitario, subtotal) VALUES
('2025-06-01', 1, 1, 50, 300.00, 15000.00),
('2025-06-02', 2, 2, 100, 100.00, 10000.00),
('2025-06-03', 3, 3, 80, 180.00, 14400.00),
('2025-06-04', 4, 4, 30, 1600.00, 48000.00),
('2025-06-05', 5, 5, 20, 2100.00, 42000.00),
('2025-06-06', 6, 6, 60, 450.00, 27000.00),
('2025-06-07', 7, 7, 40, 400.00, 16000.00),
('2025-06-08', 8, 8, 50, 550.00, 27500.00),
('2025-06-09', 9, 9, 70, 320.00, 22400.00),
('2025-06-10', 10, 10, 45, 500.00, 22500.00);

-- Insertar ventas
INSERT INTO venta (id_venta, fecha, hora, total, id_usuario)
VALUES
(1, '2025-06-10', '21:30', 5000.00, 2),
(2, '2025-06-11', '18:14', 2500.00, 3),
(3, '2025-06-12', '12:42', 3000.00, 2),
(4, '2025-06-13', '15:00', 1800.00, 1),
(5, '2025-06-14', '17:30', 2000.00, 1),
(6, '2025-06-15', '19:00', 2250.00, 2),
(7, '2025-06-16', '11:45', 3200.00, 3),
(8, '2025-06-17', '13:30', 3040.00, 3),
(9, '2025-06-18', '10:00', 3600.00, 2),
(10, '2025-06-19', '16:10', 3700.00, 1);


-- Insertar detalles de venta
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES
(1, 1, 5, 1750.00),
(1, 2, 10, 1200.00),
(2, 3, 4, 880.00),
(3, 4, 1, 1800.00),
(4, 5, 2, 5000.00),
(5, 6, 3, 1650.00),
(6, 7, 5, 2250.00),
(7, 8, 4, 2600.00),
(8, 9, 8, 3040.00),
(9, 10, 6, 3600.00);

-- Insertar métodos de pago
INSERT INTO metodo_pago (id_venta, tipo, monto) VALUES
(1, 'Efectivo', 2000.00),
(1, 'Tarjeta', 3000.00),
(2, 'Transferencia', 2500.00),
(3, 'Efectivo', 3400.00),
(4, 'Tarjeta', 4500.00),
(5, 'Efectivo', 1800.00),
(5, 'Transferencia', 1000.00),
(6, 'Tarjeta', 3200.00),
(7, 'Transferencia', 4000.00),
(8, 'Efectivo', 3700.00);

-- Insertar asistencias
INSERT INTO asistencia (id_usuario, fecha, hora_entrada, hora_salida, corregida) VALUES
(2, '2025-06-10', '08:00:00', '16:00:00', 'NO'),
(3, '2025-06-10', '08:15:00', '16:00:00', 'NO'),
(4, '2025-06-10', '09:00:00', '17:00:00', 'NO'),
(5, '2025-06-10', '08:30:00', '16:00:00', 'NO'),
(6, '2025-06-11', '08:00:00', '16:00:00', 'NO'),
(7, '2025-06-11', '09:00:00', '17:00:00', 'NO'),
(8, '2025-06-11', '08:45:00', '16:30:00', 'NO'),
(9, '2025-06-12', '08:00:00', '16:00:00', 'NO'),
(10, '2025-06-12', '09:15:00', '17:15:00', 'SI'),
(2, '2025-06-12', '08:00:00', '16:00:00', 'NO');
