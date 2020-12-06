/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const { env } = config;
const databaseConfig = require('../config/database')[env];

const db = {};

let sequelize;
if (databaseConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[databaseConfig.use_env_variable], databaseConfig);
} else {
  sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// define models here
db.User = require('./models/user')(sequelize, DataTypes);
db.CartItem = require('./models/cart')(sequelize, DataTypes);
db.Cart = require('./models/cart')(sequelize, DataTypes);
db.Product = require('./models/product')(sequelize, DataTypes);
db.Token = require('./models/token')(sequelize, DataTypes);
db.Address = require('./models/address')(sequelize, DataTypes);

// db.Token.associate(db);
// db.Cart.associate(db);
// db.Product.associate(db);
// db.User.associate(db);

fs.readdirSync(`${__dirname}/models`)
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, 'models', file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
