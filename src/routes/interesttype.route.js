const express = require('express')
const router = express.Router()
const interestTypeController = require('../controllers/interesttype.controller');
let cors = require('cors')

router.use(cors());

router.post('/getInterestType/', interestTypeController.getInterestType);

router.post('/getActiveInterestType/', interestTypeController.getActiveInterestType);

router.post('/getInterestTypeById/', interestTypeController.getInterestTypeById);

router.post('/getInterestPeriod/', interestTypeController.getInterestPeriod);

router.post('/getCollateralType/', interestTypeController.getCollateralType);

router.post('/create/', interestTypeController.create);

router.post('/updateById/', interestTypeController.updateById);

router.post('/deleteById/', interestTypeController.deleteById);

module.exports = router