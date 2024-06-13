const express = require('express')
const router = express.Router()
const promotionlistController = require('../controllers/promotionlist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getpromotion/', promotionlistController.getPromotion);

router.post('/getactivepromotion/', promotionlistController.getActivePromotion);

router.get('/getpromotionbyid/:Id', promotionlistController.getPromotionById);

router.post('/updatepromotionbyid/', promotionlistController.updatePromotionById);

router.post('/deletepromotionbyid/', promotionlistController.deletePromotionById);

router.post('/create/', promotionlistController.create);

module.exports = router