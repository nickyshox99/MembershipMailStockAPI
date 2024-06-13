const express = require('express')
const router = express.Router()
const popupListController = require('../controllers/popuplist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getpopup/', popupListController.getPopup);

router.post('/getpopupactive/', popupListController.getPopupActive);

router.get('/getpopupbyid/:Id', popupListController.getPopupById);

router.post('/updatepopupbyid/', popupListController.updatePopupById);

router.post('/deletepopupbyid/', popupListController.deletePopupById);

router.post('/create/', popupListController.create);

module.exports = router