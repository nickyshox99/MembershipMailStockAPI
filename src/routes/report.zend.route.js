const express = require('express')
const router = express.Router()
const reportZendController = require('../controllers/report.zend.controller');

let cors = require('cors')

router.use(cors());


router.get('/getMonthlyExpenseReport/', reportZendController.getMonthlyExpenseReport);




module.exports = router