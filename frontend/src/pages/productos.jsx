import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PRODUCTOS } from '../enpoints/endpoints';

// Agrega estos imports si tienes los endpoints definidos
import { CATEGORIAS, MARCAS } from '../enpoints/endpoints';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [error, setError] = useState('');
  const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
    id_marca: '',
    imagen_url: ''
  });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({});

  // Cargar productos, categorías y marcas
  useEffect(() => {
    cargarProductos();
    axios.get(CATEGORIAS).then(res => setCategorias(res.data));
    axios.get(MARCAS).then(res => setMarcas(res.data));
  }, []);

  const cargarProductos = () => {
    axios.get(PRODUCTOS)
      .then(res => {
        const ordenados = res.data.sort((a, b) => b.id_producto - a.id_producto);
        setProductos(ordenados);
      })
      .catch(() => setError('No se pudieron cargar los productos.'));
  };

  // Crear producto
  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(PRODUCTOS, {
        ...nuevo,
        precio: parseFloat(nuevo.precio),
        stock: parseInt(nuevo.stock)
      });
      setNuevo({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: '',
        id_marca: '',
        imagen_url: ''
      });
      cargarProductos();
    } catch {
      setError('No se pudo crear el producto.');
    }
  };

  // Eliminar producto
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await axios.delete(`${PRODUCTOS}/${id}`);
      cargarProductos();
    } catch {
      setError('No se pudo eliminar el producto.');
    }
  };

  // Iniciar edición
  const handleEditar = (producto) => {
    setEditando(producto.id_producto);
    setEditData({
      ...producto,
      id_categoria: producto.id_categoria || '',
      id_marca: producto.id_marca || ''
    });
  };

  // Guardar edición
  const handleGuardarEdicion = async (id) => {
    try {
      await axios.put(`${PRODUCTOS}/${id}`, {
        ...editData,
        precio: parseFloat(editData.precio),
        stock: parseInt(editData.stock)
      });
      setEditando(null);
      cargarProductos();
    } catch {
      setError('No se pudo actualizar el producto.');
    }
  };

  // Cancelar edición
  const handleCancelarEdicion = () => {
    setEditando(null);
    setEditData({});
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <form onSubmit={handleCrear} style={{marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input type="text" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} required />
        <input type="text" placeholder="Descripción" value={nuevo.descripcion} onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })} />
        <input type="number" placeholder="Precio" value={nuevo.precio} onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} required />
        <input type="number" placeholder="Stock" value={nuevo.stock} onChange={e => setNuevo({ ...nuevo, stock: e.target.value })} required />
        <select value={nuevo.id_categoria} onChange={e => setNuevo({ ...nuevo, id_categoria: e.target.value })} required>
          <option value="">Categoría</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
          ))}
        </select>
        <select value={nuevo.id_marca} onChange={e => setNuevo({ ...nuevo, id_marca: e.target.value })} required>
          <option value="">Marca</option>
          {marcas.map(mar => (
            <option key={mar.id_marca} value={mar.id_marca}>{mar.nombre_marca}</option>
          ))}
        </select>
        <input type="text" placeholder="URL Imagen" value={nuevo.imagen_url} onChange={e => setNuevo({ ...nuevo, imagen_url: e.target.value })} />
        <button type="submit">Crear producto</button>
      </form>

      <table border="1" cellPadding={8} style={{width: '100%', background: 'white', color: 'black'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.id_producto}>
              {editando === prod.id_producto ? (
                <>
                  <td>{prod.id_producto}</td>
                  <td><input type="text" value={editData.nombre} onChange={e => setEditData({ ...editData, nombre: e.target.value })} /></td>
                  <td>
                    <select value={editData.id_categoria} onChange={e => setEditData({ ...editData, id_categoria: e.target.value })} required>
                      <option value="">Categoría</option>
                      {categorias.map(cat => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={editData.id_marca} onChange={e => setEditData({ ...editData, id_marca: e.target.value })} required>
                      <option value="">Marca</option>
                      {marcas.map(mar => (
                        <option key={mar.id_marca} value={mar.id_marca}>{mar.nombre_marca}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" value={editData.precio} onChange={e => setEditData({ ...editData, precio: e.target.value })} /></td>
                  <td><input type="number" value={editData.stock} onChange={e => setEditData({ ...editData, stock: e.target.value })} /></td>
                  <td><input type="text" value={editData.imagen_url} onChange={e => setEditData({ ...editData, imagen_url: e.target.value })} /></td>
                  <td>
                    <button onClick={() => handleGuardarEdicion(prod.id_producto)}>Guardar</button>
                    <button onClick={handleCancelarEdicion}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{prod.id_producto}</td>
                  <td>{prod.nombre}</td>
                  <td>{prod.nombre_categoria}</td>
                  <td>{prod.nombre_marca}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.stock}</td>
                  <td>
                    {prod.imagen_url && <img src={prod.imagen_url} alt={prod.nombre} width={50} />}
                  </td>
                  <td>
                    <button onClick={() => handleEditar(prod)}>Editar</button>
                    <button onClick={() => handleEliminar(prod.id_producto)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;