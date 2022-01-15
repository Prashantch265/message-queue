const sequelize = require("../lib/sequelize");
const { DataTypes } = require("sequelize");

const messageModel = sequelize.define("messages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: DataTypes.STRING,
});

module.exports = messageModel;
