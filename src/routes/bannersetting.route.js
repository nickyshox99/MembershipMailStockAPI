const express = require('express')
const router = express.Router()
const bannerListController = require('../controllers/bannerlist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getbanner/', bannerListController.getBanner);

router.post('/getactivebanner/', bannerListController.getActiveBanner);

router.get('/getbannerbyid/:Id', bannerListController.getBannerById);

router.post('/updatebannerbyid/', bannerListController.updateBannerById);

router.post('/deletebannerbyid/', bannerListController.deleteBannerById);

router.post('/create/', bannerListController.create);

module.exports = router