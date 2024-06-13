const express = require('express')
const router = express.Router();
const productController = require('../controllers/product.controller');
let cors = require('cors')

router.use(cors());

// show
router.get('/', productController.default);

// router.get('/initial/', productController.initial);

router.post('/add/', productController.addProduct);

router.post('/edit/', productController.editProduct);

router.post('/delete/', productController.deleteProduct);

router.post('/inactive/', productController.inActiveProduct);

router.post('/GetActiveProduct/', productController.GetActiveProduct);

router.post('/OrderProduct/', productController.OrderProduct);

router.post('/SendProductByID/', productController.SendProductByID);

router.post('/ExchangeProductByID/', productController.ExchangeProductByID);

router.post('/GetHistoryOrderByMemberID/', productController.GetHistoryOrderByMemberID);



module.exports = router