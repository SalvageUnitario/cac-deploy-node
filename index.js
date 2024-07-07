import express from 'express';
import pool from './config/db.js';
import cors from 'cors';
import 'dotenv/config.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extender: true}));
app.use(express.static('public'));

app.options('*', cors()); // Habilita preflight para todas las rutas
app.options('/productos/:id', cors()); // Para una ruta específica

// Ruta para obtener todos los productos
app.get('/productos', async (req, res) => {
    const sql = `SELECT 
        productos.idproductos,
        productos.nombre, 
        productos.autor,
        productos.precio,
        productos.stock,
        productos.foto,
        categorias.nombre AS categoria,
        categorias.descripcion AS tipo_categoria,
        promos.promos AS banco,
        promos.descuento,
        cuotas.cuotas,
        cuotas.interes
        FROM bpyext6912dguhy9wqqt.productos
        JOIN categorias ON productos.fk_categoria = categorias.idcategorias
        JOIN promos ON productos.fk_promos = promos.idpromos
        JOIN cuotas ON productos.fk_cuotas = cuotas.idcuotas
        ORDER BY productos.idproductos ASC`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql);
        connection.release();
        res.json(rows); // Envía la respuesta JSON con todos los productos
    } catch (error) {
        console.error('Error en la consulta de productos:', error);
        res.sendStatus(500); // Envía un código de estado 500 en caso de error
    }
});

// Ruta para obtener un producto por su ID
app.get('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `SELECT 
        productos.nombre, 
        productos.autor,
        productos.precio,
        productos.descripcion,
        productos.stock,
        productos.foto,
        categorias.nombre AS categoria,
        categorias.descripcion AS tipo_categoria,
        promos.promos AS banco,
        promos.descuento,
        cuotas.cuotas,
        cuotas.interes
        FROM bpyext6912dguhy9wqqt.productos
        JOIN categorias ON productos.fk_categoria = categorias.idcategorias
        JOIN promos ON productos.fk_promos = promos.idpromos
        JOIN cuotas ON productos.fk_cuotas = cuotas.idcuotas
        WHERE productos.idproductos = ?
        ORDER BY productos.precio DESC`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        if (rows.length > 0) {
            console.log("UN PRODUCTO --> ", rows[0]);
            res.json(rows[0]); // Envía la respuesta JSON con el producto encontrado
        } else {
            res.status(404).send('Producto no encontrado'); // Envía un código de estado 404 si no se encontró el producto
        }
    } catch (error) {
        console.error('Error en la consulta de un producto:', error);
        res.sendStatus(500); // Envía un código de estado 500 en caso de error
    }
});

//agregar productos
app.post('/productos', async (req,res)=> {
    const producto = req.body; //me traigo toda la info del formuhlario

    const sql = `INSERT INTO productos SET ?`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [producto]);
        connection.release();
        res.send(`Producto creado con id: ${rows.insertId}`); // Envía un mensaje de creación con id
        }
    catch (error) {
        console.error('Error en la consulta de un producto:', error);
        res.sendStatus(500); // Envía un código de estado 500 en caso de error
    }
});

//actualizar un recurso en particular
app.put('/productos/:id', async (req, res)=> {
    const id = req.params.id
    const producto = req.body;
    const sql = `UPDATE productos SET ? WHERE idproductos = ?`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [producto, id]);
        connection.release();
        console.log(rows);
        res.send(`Producto actualizado con id: ${id}`); // Envía un mensaje con la actualización de id
        }
    catch (error) {
        console.error('Error en la consulta de un producto:', error);
        res.sendStatus(500); // Envía un código de estado 500 en caso de error
    }
});

// borrar productos
app.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM productos WHERE idproductos = ?`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log(rows);
        res.send(`Producto borrado con id: ${id}`);
        }
    catch (error) {
        console.error('Error en la consulta de un producto:', error);
        res.sendStatus(500); // Envía un código de estado 500 en caso de error
    }
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
