const express = require('express')
const router = express.Router()
const subscriptionGroupController = require('../controllers/subscriptiongroup.controller');
let cors = require('cors')

router.use(cors());

router.post('/getSubscriptionGroup/', subscriptionGroupController.getSubscriptionGroup);

router.post('/getSubscriptionGroupStock/', subscriptionGroupController.getSubscriptionGroupStock);

router.post('/getSubscriptionGroupForReport/', subscriptionGroupController.getSubscriptionGroupForReport);

router.post('/getSubscriptionGroupForReportStock/', subscriptionGroupController.getSubscriptionGroupForReportStock);

router.post('/getActiveSubscriptionGroup/', subscriptionGroupController.getActiveSubscriptionGroup);

router.post('/getActiveSubscriptionGroupStock/', subscriptionGroupController.getActiveSubscriptionGroupStock);

router.post('/getSubscriptionGroupById/', subscriptionGroupController.getSubscriptionGroupById);

router.post('/getSubscriptionGroupStockById/', subscriptionGroupController.getSubscriptionGroupStockById);

router.post('/getSubscribeMemberByGroupById/', subscriptionGroupController.getSubscribeMemberByGroupById);

router.post('/getSubscribeMemberByGroupStockById/', subscriptionGroupController.getSubscribeMemberByGroupStockById);

router.post('/getSubscribePaymentById/', subscriptionGroupController.getSubscribePaymentById);

router.post('/getSubscribePaymentStockById/', subscriptionGroupController.getSubscribeStockPaymentById);

router.post('/create/', subscriptionGroupController.create);

router.post('/createStock/', subscriptionGroupController.createStock);

router.post('/updateById/', subscriptionGroupController.updateById);

router.post('/updateStockById/', subscriptionGroupController.updateStockById);

router.post('/deleteById/', subscriptionGroupController.deleteById);

router.post('/deleteStockById/', subscriptionGroupController.deleteStockById);

router.post('/addMemberToGroup/', subscriptionGroupController.addMemberToGroup);

router.post('/addMemberToGroupStock/', subscriptionGroupController.addMemberToGroupStock);

router.post('/setMemberToHeaderGroup/', subscriptionGroupController.setMemberToHeaderGroup);

router.post('/setMemberToHeaderGroupStock/', subscriptionGroupController.setMemberToHeaderGroupStock);

router.post('/addMemberToGroupById/', subscriptionGroupController.addMemberToGroupById);

router.post('/addMemberToGroupStockById/', subscriptionGroupController.addMemberToGroupStockById);

router.post('/addPaymentNoteGroup/', subscriptionGroupController.addPaymentNoteGroup);

router.post('/addPaymentNoteGroupStock/', subscriptionGroupController.addPaymentNoteGroupStock);

router.post('/getGroupOfMemberByMemberId/', subscriptionGroupController.getGroupOfMemberByMemberId);

router.post('/getGroupStockOfMemberByMemberId/', subscriptionGroupController.getGroupStockOfMemberByMemberId);

router.post('/deleteMemberFromGroupByID/', subscriptionGroupController.deleteMemberFromGroupByID);

router.post('/deleteMemberFromGroupStockByID/', subscriptionGroupController.deleteMemberFromGroupStockByID);

router.post('/deletePaymentHistoryByID/', subscriptionGroupController.deletePaymentHistoryByID);

router.post('/deletePaymentHistoryStockByID/', subscriptionGroupController.deletePaymentHistoryStockByID);

router.post('/updateMemberData/', subscriptionGroupController.updateMemberData);

router.post('/updateMemberStockData/', subscriptionGroupController.updateMemberStockData);

module.exports = router