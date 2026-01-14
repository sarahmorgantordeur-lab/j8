const { DataSource } = require('typeorm');
const User = require('../entities/User');
const Message = require('../entities/Message');
const Product = require('../entities/Product');

// Configuration dynamique selon l'environnement
const dbConfig = process.env.DB_TYPE === 'postgres'
  ? {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'nodeapp',
      synchronize: true, // DEV ONLY
      logging: false,
      entities: [User, Message, Product],
    }
  : {
      type: 'better-sqlite3',
      database: 'database.sqlite', // Fichier local
      synchronize: true, // DEV ONLY
      logging: false,
      entities: [User, Message, Product],
    };

const AppDataSource = new DataSource(dbConfig);

module.exports = AppDataSource;