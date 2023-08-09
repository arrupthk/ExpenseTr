// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback) => {
//   MongoClient.connect('mongodb+srv://arrupk:Chaddi%401009@cluster0.ub68joy.mongodb.net/expensetr?retryWrites=true&w=majority')
//     .then(client => {
//       console.log('Connected to MongoDB, running on expendetr database');
//       _db = client.db();
//       console.log(client)
//       callback(client);
//     })
//     .catch(error => {
//       console.log('Failed to connect to MongoDB', error);
//       throw error;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw 'No database found';
// };

// module.exports = {
//   mongoConnect: mongoConnect, 
//   getDb: getDb
// };

const mongoose = require('mongoose');

const url = 'mongodb+srv://arrupk:Chaddi%401009@cluster0.ub68joy.mongodb.net/ExpenseTracker?retryWrites=true&w=majority';
//const dbName = 'expenseTracker';

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const mongoConnect = (callback) => {
  mongoose
    .connect(url, connectOptions)
    .then(() => {
      console.log('Connected to MongoDB');
      callback();
    })
    .catch((err) => {
      console.log('MongoDB connection error:', err);
      throw err;
    });
};

const getDb = () => {
  if (mongoose.connection.readyState !== 1) {
    throw 'No database connection';
  }
  return mongoose.connection.db;
};

module.exports = {
  mongoConnect,
  getDb,
};
