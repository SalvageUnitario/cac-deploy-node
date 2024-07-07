import { createPool	 } from 'mysql2/promise';

// Configurar el pool de conexiones
const pool = createPool({
  host: '192.168.200.20',
  user: 'mariano',
  password: 'Telecom1234@',
  database: 'libreria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

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