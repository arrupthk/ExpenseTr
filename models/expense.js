const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
// Define the Expense model
const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'expense',
    timestamps: false, // Set timestamps to false to disable the default timestamps
  }
  );



  module.exports = Expense;
