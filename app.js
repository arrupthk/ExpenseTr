const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { mongoConnect } = require('./database'); 

// const User = require('./models/user'); // Import the Mongoose User model
// const Expense = require('./models/expense');
// const Order = require('./models/orders');
// const Password = require('./models/password');
// const downloadreport = require('./models/downloadreport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const userRouter = require('./routes/users');
const expenseRouter = require('./routes/expense');
const purchaseRouter = require('./routes/purchase');
const passwordRouter = require('./routes/forgotpassword');
app.use('/user', userRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', purchaseRouter);
app.use('/password', passwordRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use((req, res) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`))
});



// User.hasMany(Expense)
// Expense.belongsTo(User)

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Password);
// Password.belongsTo(User);

// User.hasMany(downloadreport);
// downloadreport.belongsTo(User);

mongoConnect(() => {
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
});