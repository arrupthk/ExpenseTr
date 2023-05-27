const sequelize = require('../database');
const Expense = require('../models/expense');
const User = require('../models/user');
const DownloadExpense = require('../models/downloadreport')
const AWS = require('aws-sdk')
const fs = require('fs');



async function insertExpense(req, res) {
  try {
    const { name, description, category, amount } = req.body;
 
    const expense = await Expense.create({
      name: name,
      description: description,
      category: category,
      amount: amount,
      userId: req.user.id
    });

    const userId = req.user.id;

    const totalExpense = await Expense.sum('amount', { where: { userId } });

    // Update the totalexpense field in the users table
    await User.update({ totalexpense: totalExpense }, { where: { id: userId } });

    res.status(200).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create expense', error: error });
  }
}
async function getExpense(req, res) {
  try {
    const userId = req.user.id;
    const data = await Expense.findAll({ where: { userId: userId } });
    console.log(data)
    res.send({data});
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;

    // Retrieve the expense that is going to be deleted
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).send({ message: 'Expense not found' });
    }

    // Get the user ID associated with the expense
    const userId = expense.userId;

    // Delete the expense from the database
    await Expense.destroy({ where: { id: expenseId } });

    // Recalculate the total expense for the user
    const totalExpense = await Expense.sum('amount', { where: { userId } });

    // Update the totalexpense field in the users table
    await User.update({ totalexpense: totalExpense }, { where: { id: userId } });

    res.send({ message: 'Expense deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting expense.' });
  }
}



function uploadToS3(data, filename) {
    return new Promise((resolve, reject) => {
      const BUCKET_NAME = 'expensetrpr';
      const IAM_USER_KEY = 'AKIAWTHCPTSSIQYQIJKK';
      const IAM_USER_SECRET = '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';
  
      let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
      });
  
      s3bucket.createBucket(() => {
        var params = {
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: data,
          ACL: 'public-read'
        };
  
        s3bucket.upload(params, (err, s3response) => {
          if (err) {
            console.log("Something went wrong", err);
            reject(err);
          } else {
            console.log('Success', s3response);
            resolve(s3response.Location);
          }
        });
      });
    });
  }



const downloadReport = async (req, res, next) => {
  try {
    if (req.user.ispremiumuser === true) {
      const expenses = await req.user.getExpenses(req);
      console.log(expenses, "Printing from expense controller");
      const stringifiedExpenses = JSON.stringify(expenses);
      const userId = req.user.id;
      const filename = `Expense${userId}/${new Date()}.txt`;
      const bufferData = Buffer.from(stringifiedExpenses, 'utf-8');

      const fileURL = await uploadToS3(bufferData, filename);

      res.status(200).json({ fileURL, success: true });
    } else {
      return res.status(400).json({ error: 'not a premium user' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
}

module.exports = {
  insertExpense,
  getExpense,
  deleteExpense,
  downloadReport
};