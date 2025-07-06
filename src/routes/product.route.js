const express = require('express')
const router = express.Router();
const productController = require('../controllers/product.controller');
let cors = require('cors')

router.use(cors());

// show
router.get('/', productController.default);

// router.get('/initial/', productController.initial);

router.post('/add/', productController.addProduct);

router.post('/updatebyId/', productController.updatebyId);

router.post('/deleteProduct/', productController.deleteProduct);

router.post('/inactive/', productController.inActiveProduct);

router.post('/GetActiveProduct/', productController.GetActiveProduct);

router.post('/GetProductSetting/', productController.GetProductSetting);

router.post('/OrderProduct/', productController.OrderProduct);

router.post('/SendProductByID/', productController.SendProductByID);

router.post('/ExchangeProductByID/', productController.ExchangeProductByID);

router.post('/GetHistoryOrderByMemberID/', productController.GetHistoryOrderByMemberID);

router.post('/CreateSubScribeOrder/', productController.CreateSubScribeOrder);

router.post('/CreateAndApproveSubScribeOrder/', productController.CreateAndApproveSubScribeOrder);

router.post('/ApproveSubScribeOrder/', productController.ApproveSubScribeOrder);

router.post('/CancelSubScribeOrder/', productController.CancelSubScribeOrder);

router.post('/SentFamliyInviteOrder/', productController.SentFamliyInviteOrder);

router.post('/SkipFamliyInviteOrder/', productController.SkipFamliyInviteOrder);

router.post('/PaymentOrderWithSlip/', productController.PaymentOrderWithSlip);

router.post('/SentPaymentMessageOrder/', productController.SentPaymentMessageOrder);

router.post('/VerifySlipOrder/', productController.VerifySlipOrder);

router.post('/GetHistorySubScribeOrderByMemberID/', productController.GetHistorySubScribeOrderByMemberID);

router.post('/GetHistorySubScribeOrderNotApprove/', productController.GetHistorySubScribeOrderNotApprove);

router.post('/GetHistorySubScribeOrderWaitInvitation/', productController.GetHistorySubScribeOrderWaitInvitation);

router.post('/GetHistorySubScribeOrderWaitCheckPayment/', productController.GetHistorySubScribeOrderWaitCheckPayment);

router.post('/GetHistorySubScribeOrderCheckedPayment/', productController.GetHistorySubScribeOrderCheckedPayment);

router.post('/GetOrderNearExpire/', productController.GetOrderNearExpire);

router.post('/GetSubScribeOrderById/', productController.GetSubScribeOrderById);

module.exports = router