// const Sequelize = require('sequelize');
// const sequelize = require('../database');

// const passwords = sequelize.define('passwords',{
//     id:
//     {type:Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true
//     },
//     isactive: Sequelize.BOOLEAN
// })
// module.exports = passwords;

const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isactive: {
    type: Boolean,
    required: true,
  },
});

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
