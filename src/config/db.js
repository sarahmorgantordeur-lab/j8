const { DataSource } = require('typeorm');
const User = require('../entities/User');
const Message = require('../entities/Message');
const Product = require('../entities/Product');

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite', // Fichier local
    synchronize: true, // DEV ONLY
    logging: false,
    entities: [User, Message, Product],
});

module.exports = AppDataSource;