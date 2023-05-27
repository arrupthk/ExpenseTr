const express = require('express');
const router = express.Router();
const loginC =require('../controller/loginC')

router.post('/signup', loginC.signUp);
router.post('/login',loginC.login);
module.exports = router;


