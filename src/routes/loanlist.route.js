const express = require('express')
const router = express.Router()
const loanListController = require('../controllers/loanlist.controller');
let cors = require('cors')

router.use(cors());

//router.get('/relate/', loanListController.relate);

router.post('/create/', loanListController.create);

router.post('/updateById/', loanListController.updateById);

router.post('/calculateLoanInterest/', loanListController.calculateLoanInterest);

router.post('/requestLoan/', loanListController.requestLoan);

router.post('/getRequestLoan/', loanListController.getRequestLoan);

router.post('/getRejectLoan/', loanListController.getRejectLoan);

router.post('/getApproveLoan/', loanListController.getApproveLoan);

router.post('/getLoanPaymentByLoanId/', loanListController.getLoanPaymentByLoanId);

router.post('/getShareLoanByLoanId/', loanListController.getShareLoanByLoanId);

router.post('/approveLoanById/', loanListController.approveLoanById);

router.post('/rejectLoanById/', loanListController.rejectLoanById);

router.post('/getLoanOnDueDate/', loanListController.getLoanOnDueDate);

router.post('/getLoanOverDueDate/', loanListController.getLoanOverDueDate);

router.post('/getLoanPaidOrClosed/', loanListController.getLoanPaidOrClosed);

router.post('/getLoanAll/', loanListController.getLoanAll);

router.post('/assignPaymentById/', loanListController.assignPaymentById);

router.post('/getLoanPaymentByPaymentId/', loanListController.getLoanPaymentByPaymentId);

router.post('/updateLoanPaymentByPaymentId/', loanListController.updateLoanPaymentByPaymentId);

router.post('/updateFinePaymentByPaymentId/', loanListController.updateFinePaymentByPaymentId);

router.post('/updateForwardPaymentByPaymentId/', loanListController.updateForwardPaymentByPaymentId);

router.post('/getApproveLoanByOwner/', loanListController.getApproveLoanByOwner);

router.post('/getPaidPayment/', loanListController.getPaidPayment);

module.exports = router