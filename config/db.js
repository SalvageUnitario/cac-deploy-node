import { createPool } from 'mysql2/promise';

// Configurar el pool de conexiones
const pool = createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  connectionLimit: 10,
  connectTimeout: 10000

//   host: '192.168.200.20',
//   user: 'mariano',
//   password: 'Telecom1234@',
//   database: 'libreria',
//   connectionLimit: 5,
//   connectTimeout: 10000

});

//test conection
pool.getConnection()
    .then(connection => {
        console.log('Connected to the database');
        connection.release()
    })
    .catch(error => {
        console.log('Error connecting to the database', error);
    });

export default pool;