const express = require('express');
const cors = require('cors');
const productoRoutes = require('./router/productoroutes');
const usuarioRoutes = require('./router/usuarioroutes');
const authRoutes = require('./router/authroutes'); 
const ventaRoutes = require('./router/ventaroutes');
const asistenciaRoutes = require('./router/asistenciaroutes');
const ingresoRoutes = require('./router/ingresoroutes');


const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/auth', authRoutes); // Ruta para login

app.listen(3001, () => {
    console.log('Servidor backend en puerto 3001');
});
