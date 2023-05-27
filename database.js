const Sequelize = require('sequelize');

const dotenv = require('dotenv');
dotenv.config();
//console.log(process.env, "look here")
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  define: {
    timestamps: false
  }

});

module.exports = sequelize


