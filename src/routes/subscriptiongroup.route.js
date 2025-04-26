const express = require('express')
const router = express.Router()
const subscriptionGroupController = require('../controllers/subscriptiongroup.controller');
let cors = require('cors')

router.use(cors());

router.post('/getSubscriptionGroup/', subscriptionGroupController.getSubscriptionGroup);

router.post('/getActiveSubscriptionGroup/', subscriptionGroupController.getActiveSubscriptionGroup);

router.post('/getSubscriptionGroupById/', subscriptionGroupController.getSubscriptionGroupById);

router.post('/create/', subscriptionGroupController.create);

router.post('/updateById/', subscriptionGroupController.updateById);

router.post('/deleteById/', subscriptionGroupController.deleteById);

module.exports = router