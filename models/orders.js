const Sequelize = require('sequelize')
const sequelize = require('../database')

const Order = sequelize.define('order',{
    id: {
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    payment_id: Sequelize.STRING,
    order_id: Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports = Order;