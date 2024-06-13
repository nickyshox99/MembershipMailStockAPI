const express = require('express')
const router = express.Router()
const transactionListController = require('../controllers/transactionlist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getwaitwithdrawtransaction/', transactionListController.getWaitWithdrawTransaction);

router.post('/countwaitwithdrawtransaction/', transactionListController.countWaitWithdrawTransaction);

router.post('/getwaitdeposittransaction/', transactionListController.getWaitDepositTransaction);

router.post('/approveAutoWaitWithdrawTransactionById/', transactionListController.approveAutoWaitWithdrawTransactionById);

router.post('/approveManaulWaitWithdrawTransactionById/', transactionListController.approveManaulWaitWithdrawTransactionById);

router.post('/updatewaitdeposittransactionbyid/', transactionListController.updateWaitDepositTransactionById);

router.post('/getTransactionByUsername/', transactionListController.getTransactionByUsername);

module.exports = router