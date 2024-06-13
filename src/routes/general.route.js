const express = require('express')
const router = express.Router()
const generalController = require('../controllers/generallist.controller');
let cors = require('cors')

router.use(cors());

router.post('/GetDepositInfo/', generalController.GetDepositInfo);

router.post('/GetCardSetting/', generalController.GetCardSetting);

router.post('/GetWheelSetting/', generalController.GetWheelSetting);

router.post('/GetWheelData/', generalController.GetWheelData);

router.get('/TransferUser/', generalController.TransferUser);

router.post('/GetAllProvince/', generalController.GetAllProvince);

router.post('/GetAllDistrict/', generalController.GetAllDistrict);

router.post('/GetAllSubDistrict/', generalController.GetAllSubDistrict);


module.exports = router