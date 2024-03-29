// const Expense = require('../models/expense');
// const User = require('../models/user');
// const UserServices = require('../services/userservices');
// const S3 = require('../services/S3');

// async function insertExpense(req, res) {
//   try {
//     const { name, description, category, amount } = req.body;
//     const userId = req.user.id;
//     const expense = new Expense({
//       name: name,
//       description: description,
//       category: category,
//       amount: amount,
//       userId: userId
//     });
//     await expense.save();

//     const totalExpenseResult = await Expense.aggregate([
//       { $match: { userId: userId } },
//       { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
//     ]);
//     const totalExpense = totalExpenseResult[0]?.totalAmount || 0;
//     await User.updateOne({ _id: userId }, { $set: { totalexpense: totalExpense } });
//     res.status(200).json({ message: 'Expense created successfully', expense });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create expense', error: error.message });
//   }
// }

// async function getExpense(req, res) {
//   try {
//     const userId = req.user.id;
//     const page = +req.query.page || 1;
//     const pageSize = +req.query.pageSize || 10;

//     const { count, rows: expenses } = await Expense.findAndCountAll({
//       where: { userId },
//       offset: (page - 1) * pageSize,
//       limit: pageSize,
//       order: [['id', 'DESC']]
//     });

//     res.status(200).json({
//       allExpense: expenses,
//       currentPage: page,
//       totalExpense: count,
//       hasNextPage: pageSize * page < count,
//       nextPage: page + 1,
//       hasPreviousPage: page > 1,
//       previousPage: page - 1,
//       lastPage: Math.ceil(count / pageSize)
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// }


// async function deleteExpense(req, res) {
//   try {
//     const expenseId = req.params.id;
//     const expense = await Expense.findByPk(expenseId);

//     if (!expense) {
//       return res.status(404).send({ message: 'Expense not found' });
//     }
//     const userId = expense.userId;
//     await Expense.destroy({ where: { id: expenseId } });
//     const totalExpense = await Expense.sum('amount', { where: { userId } });
//     await User.update({ totalexpense: totalExpense }, { where: { id: userId } });
//     res.send({ message: 'Expense deleted successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error deleting expense.' });
//   }
// }


// module.exports = {
//   deleteExpense
// };

// const downloadReport = async (req, res, next) => {
//   try {
//     if (req.user.ispremiumuser === true) {
//       const expenses = await UserServices.getExpenses(req);
//       console.log(expenses, 'Printing from expense controller');
//       const stringifiedExpenses = JSON.stringify(expenses);
//       const userId = req.user.id;
//       const filename = `Expense${userId}/${new Date()}.txt`;
//       const bufferData = Buffer.from(stringifiedExpenses, 'utf-8');

//       const fileURL = await S3.uploadToS3(bufferData, filename);
//  res.status(200).json({ fileURL });
//     } else {
//       res.status(403).json({ message: 'Only premium users can download the report.' });
//     }
//   } catch (err) {
//     console.log(err, 'printing the error in downloading');
//   }
// };

// module.exports = {
//   insertExpense,
//   getExpense,
//   deleteExpense,
//   downloadReport
// };


const Expense = require('../models/expense');
const User = require('../models/user');
const UserServices = require('../services/userservices');
const S3 = require('../services/S3');

async function insertExpense(req, res) {
  try {
    const { name, description, category, amount } = req.body;
    const userId = req.user.id;

    // Create a new expense
    const expense = new Expense({
      name: name,
      description: description,
      category: category,
      amount: amount,
      userId: req.user.id.toString(), 

    });
    await expense.save();

    const totalExpenseResult = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalExpense = totalExpenseResult[0]?.totalAmount || 0;
    await User.findByIdAndUpdate(userId, { totalexpense: totalExpense });
    res.status(200).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create expense', error: error.message });
  }
}

async function getExpense(req, res) {
  try {
    const userId = req.user.id;
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;

    const count = await Expense.countDocuments({ userId });

    const expenses = await Expense.find({ userId })
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      allExpense: expenses,
      currentPage: page,
      totalExpense: count,
      hasNextPage: pageSize * page < count,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / pageSize)
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).send({ message: 'Expense not found' });
    }
    const userId = expense.userId;
    
    await Expense.findByIdAndDelete(expenseId);

    const totalExpenseResult = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalExpense = totalExpenseResult[0]?.totalAmount || 0;

    await User.findByIdAndUpdate(userId, { totalexpense: totalExpense });

    res.send({ message: 'Expense deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting expense.' });
  }
}

const downloadReport = async (req, res, next) => {
  try {
    if (req.user.ispremiumuser === true) {
      const expenses = await UserServices.getExpenses(req);
      console.log(expenses, 'Printing from expense controller');
      const stringifiedExpenses = JSON.stringify(expenses);
      const userId = req.user.id;
      const filename = `Expense${userId}/${new Date()}.txt`;
      const bufferData = Buffer.from(stringifiedExpenses, 'utf-8');

      const fileURL = await S3.uploadToS3(bufferData, filename);
      res.status(200).json({ fileURL });
    } else {
      res.status(403).json({ message: 'Only premium users can download the report.' });
    }
  } catch (err) {
    console.log(err, 'printing the error in downloading');
  }
};

module.exports = {
  insertExpense,
  getExpense,
  deleteExpense,
  downloadReport
};
