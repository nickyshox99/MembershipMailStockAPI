const express = require('express')
const router = express.Router()
const subscriptionGroupController = require('../controllers/subscriptiongroup.controller');
let cors = require('cors')

router.use(cors());

router.post('/getSubscriptionGroup/', subscriptionGroupController.getSubscriptionGroup);

router.post('/getActiveSubscriptionGroup/', subscriptionGroupController.getActiveSubscriptionGroup);

router.post('/getSubscriptionGroupById/', subscriptionGroupController.getSubscriptionGroupById);

router.post('/getSubscribeMemberByGroupById/', subscriptionGroupController.getSubscribeMemberByGroupById);

router.post('/getSubscribePaymentById/', subscriptionGroupController.getSubscribePaymentById);

router.post('/create/', subscriptionGroupController.create);

router.post('/updateById/', subscriptionGroupController.updateById);

router.post('/deleteById/', subscriptionGroupController.deleteById);

router.post('/addMemberToGroup/', subscriptionGroupController.addMemberToGroup);

router.post('/setMemberToHeaderGroup/', subscriptionGroupController.setMemberToHeaderGroup);

router.post('/addMemberToGroupById/', subscriptionGroupController.addMemberToGroupById);

router.post('/addPaymentNoteGroup/', subscriptionGroupController.addPaymentNoteGroup);

router.post('/getGroupOfMemberByMemberId/', subscriptionGroupController.getGroupOfMemberByMemberId);

router.post('/deleteMemberFromGroupByID/', subscriptionGroupController.deleteMemberFromGroupByID);

router.post('/deletePaymentHistoryByID/', subscriptionGroupController.deletePaymentHistoryByID);

module.exports = router