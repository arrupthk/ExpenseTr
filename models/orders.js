// const Sequelize = require('sequelize')
// const sequelize = require('../database')

// const Order = sequelize.define('order',{
//     id: {
//         type:Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     payment_id: Sequelize.STRING,
//     order_id: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order;


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
