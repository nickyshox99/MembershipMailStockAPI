const express = require('express')
const router = express.Router()
const adminbanklistController = require('../controllers/adminbanklist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getadminbank/', adminbanklistController.getadminbank);

router.post('/getactiveadminbank/', adminbanklistController.getactiveadminbank);

router.post('/getbankinfo/', adminbanklistController.getbankinfo);

router.post('/getbankbreakinfo/', adminbanklistController.getbankbreakinfo);

router.get('/getadminbankbyid/:Id', adminbanklistController.getadminbankbyid);

router.post('/updateadminbankbyid/', adminbanklistController.updateadminbankbyid);

router.post('/deleteadminbankbyid/', adminbanklistController.deleteadminbankbyid);

router.post('/create/', adminbanklistController.create);

router.post('/transferbankbyid/', adminbanklistController.transferbankbyid);



module.exports = router