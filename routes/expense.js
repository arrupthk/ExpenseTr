const express = require('express');
const router = express.Router();
const expenseC = require('../controller/expenseC')
const userAuth = require('../middleware/authorisation')

router.get('/getExpense', userAuth.authenticate,expenseC.getExpense)
router.post('/postExpense',userAuth.authenticate,expenseC.insertExpense)
router.delete('/deleteExpense/:id',userAuth.authenticate,expenseC.deleteExpense)
router.get('/download-report', userAuth.authenticate,expenseC.downloadReport)

module.exports = router;