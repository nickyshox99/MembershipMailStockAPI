const express = require('express')
const router = express.Router()
const lineSettingController = require('../controllers/linechatsetting.controller');
let cors = require('cors')

router.use(cors());

router.post('/getlinesetting/', lineSettingController.getLineSetting);

router.post('/getLineSettingActive/', lineSettingController.getLineSettingActive);

router.get('/getlinesettingbyid/:Id', lineSettingController.getLineSettingById);

router.post('/updatelinesettingbyid/', lineSettingController.updateLineSettingById);

router.post('/deletelinesettingbyid/', lineSettingController.deleteLineSettingById);

router.post('/create/', lineSettingController.create);

module.exports = router