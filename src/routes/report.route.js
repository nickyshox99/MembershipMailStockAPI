const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report.controller');

let cors = require('cors')

router.use(cors());

// Login

// router.post('/getReportSMS/', reportController.getReportSMS);

// router.post('/getReportDesposit/', reportController.getReportDeposit);

// router.post('/getReportWithdraw/', reportController.getReportWithdraw);

// router.post('/getReportRefund/', reportController.getReportRefund);

// router.post('/getReportAff/', reportController.getReportAff);

// router.post('/getReportAffDeposit/', reportController.getReportAffDeposit);

// router.post('/getReportBetlog/', reportController.getReportBetlog);

// router.post('/getReportBetlog2/', reportController.getReportBetlog2);

// router.post('/getReportTransferOut/', reportController.getReportTransferOut);

// router.post('/getReportSummaryMember/', reportController.getReportSummaryMember);

// router.post('/getdashboarddata/', reportController.getDashboardData);

//router.post('/getdashboarddatabydate/', reportController.getDashboardDataByDate);

router.post('/getdashboarddatabydate2/', reportController.getDashboardDataByDate2);

// router.post('/getdashboarddatabyallianceid/', reportController.getDashboardDataByAllianceId);

// router.post('/getlasttransaction/', reportController.getLastTransaction);

// router.post('/getlastDeptransaction/', reportController.getLastDepTransaction);

// router.post('/getlastWittransaction/', reportController.getLastWitTransaction);

// router.post('/getlastRegtransaction/', reportController.getLastRegTransaction);

// router.post('/getlastBonusTransaction/', reportController.getLastBonusTransaction);

router.post('/getOldSummaryReport/', reportController.getOldSummaryReport);



module.exports = router