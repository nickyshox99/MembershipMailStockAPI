const express = require('express')
const router = express.Router()
const otpManageController = require('../controllers/otpmanage.controller');
let cors = require('cors')

router.use(cors());

router.post('/getRegisterOTP/', otpManageController.getRegisterOTP);

router.post('/checkRegisterOTP/', otpManageController.checkRegisterOTP);

router.post('/getForgotPasswordOTP/', otpManageController.getForgotPasswordOTP);

module.exports = router