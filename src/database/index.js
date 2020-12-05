const { Sequelize, DataTypes } = require('sequelize');

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

// define models here
db.User = require('./models/user')(sequelize, DataTypes);
db.Token = require('./models/token')(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
