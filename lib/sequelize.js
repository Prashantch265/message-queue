const Sequelize = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(config.db, config.dbuser, config.dbpwd, {
  dialect: config.dialect,
  host: config.dbhost,
});

module.exports = sequelize;
