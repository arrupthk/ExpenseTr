// const Sequelize = require('sequelize')
// const sequelize = require('../database')

// const Downloadreport = sequelize.define('downloadreport',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull: false,
//         primaryKey:true
//     },
//     URL:Sequelize.STRING
// })
// module.exports = Downloadreport

const mongoose = require('mongoose');

const downloadReportSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  URL: {
    type: String,
    required: true,
  },
});

const DownloadReport = mongoose.model('DownloadReport', downloadReportSchema);

module.exports = DownloadReport;
