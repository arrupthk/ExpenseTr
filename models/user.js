const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../database');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 

  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  ispremiumuser:Sequelize.BOOLEAN,
  totalexpense:Sequelize.STRING
},
{
  tableName: 'user',
  timestamps: false, // Set timestamps to false to disable the default timestamps
}
);

// Hash the password before saving the user
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;