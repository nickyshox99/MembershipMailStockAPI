const express = require('express')
const router = express.Router()
const subscriptionTypeController = require('../controllers/subscriptiontype.controller');
let cors = require('cors')

router.use(cors());

router.post('/getSubscriptionType/', subscriptionTypeController.getSubscriptionType);

router.post('/getActiveSubscriptionType/', subscriptionTypeController.getActiveSubscriptionType);

router.post('/getSubscriptionTypeById/', subscriptionTypeController.getSubscriptionTypeById);

router.post('/create/', subscriptionTypeController.create);

router.post('/updateById/', subscriptionTypeController.updateById);

router.post('/deleteById/', subscriptionTypeController.deleteById);

module.exports = router