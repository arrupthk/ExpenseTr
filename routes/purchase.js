const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/authorisation')
const purchaseC = require('../controller/purchase.C')
const premiumC = require('../controller/premiumC')


router.get('/premiumMembership',userAuth.authenticate,purchaseC.purchasePremium)
router.post('/transactionStatus',userAuth.authenticate,purchaseC.updateTransactionStatus)
router.get('/leaderboard',userAuth.authenticate,premiumC.getPremiumUsers)
module.exports = router;