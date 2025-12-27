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

router.post('/updateEndDateById/', productController.updateEndDateById);

router.post('/deleteProduct/', productController.deleteProduct);

router.post('/inactive/', productController.inActiveProduct);

router.post('/GetActiveProduct/', productController.GetActiveProduct);

router.post('/GetProductSetting/', productController.GetProductSetting);

router.post('/OrderProduct/', productController.OrderProduct);

router.post('/SendProductByID/', productController.SendProductByID);

router.post('/ExchangeProductByID/', productController.ExchangeProductByID);

router.post('/deleteOrderById/', productController.DeleteOrderByID);

router.post('/GetHistoryOrderByMemberID/', productController.GetHistoryOrderByMemberID);

router.post('/CreateSubScribeOrder/', productController.CreateSubScribeOrder);

router.post('/RenewSubScribeOrder/', productController.RenewSubScribeOrder);

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

router.post('/GetHistorySubScribeOrderAll/', productController.GetHistorySubScribeOrderAll);

router.post('/GetOrderNearExpire/', productController.GetOrderNearExpire);

router.post('/GetOrderExpired/', productController.GetOrderExpired);

router.post('/GetSubScribeOrderById/', productController.GetSubScribeOrderById);


router.post('/SentPaymentMessageNearOrder/', productController.SentPaymentMessageNearOrder);

router.post('/SentPaymentMessageExpired/', productController.SentPaymentMessageExpired);

// เพิ่มบรรทัดนี้ในส่วนของ routes
router.post('/send-stripe-credentials', productController.SendStripeCredentials);

router.post('/send-email-password-manual', productController.SendEmailPasswordManual);

router.post('/GetRemainInviteInStock/', productController.GetRemainInviteInStock);

module.exports = router