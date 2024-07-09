const express = require('express')
const router = express.Router()
const lineChatController = require('../controllers/linechat.controller');
let cors = require('cors')

router.use(cors());

router.post('/getSelfProfile/', lineChatController.getSelfProfile);

router.post('/getProfile/', lineChatController.getProfile);

router.post('/getContact/', lineChatController.getContact);

router.post('/getActiveChatContact/', lineChatController.getActiveChatContact);

router.post('/getActiveChatContact2/', lineChatController.getActiveChatContact2);

router.post('/getChatWithUserId/', lineChatController.getChatWithUserId);

router.post('/deleteChatUserId/', lineChatController.deleteChatUserId);

router.post('/sendMessageToUserId/', lineChatController.sendMessageToUserId);

router.post('/sendStickerToUserId/', lineChatController.sendStickerToUserId);

router.post('/sendImageToUserId/', lineChatController.sendImageToUserId);

router.post('/sendVideoToUserId/', lineChatController.sendVideoToUserId);

router.post('/closeMessageOfUserId/', lineChatController.closeMessageOfUserId);

router.post('/getLineImageById/', lineChatController.getLineImageById);

router.post('/getLineSticker/', lineChatController.getLineSticker);

router.post('/changeAliasUserId/', lineChatController.changeAliasUserId);

router.post('/getChatTag/', lineChatController.getChatTag);

router.post('/updateContactProfile/', lineChatController.updateContactProfile);

router.post('/verifySlip/', lineChatController.verifySlip);

router.post('/checkIn/', lineChatController.checkIn);

router.post('/checkOut/', lineChatController.checkOut);

router.post('/getCheckInList/', lineChatController.getCheckInList);

router.post('/getQuickMessage/', lineChatController.getQuickMessage);

router.post('/insertQuickMessage/', lineChatController.insertQuickMessage);

router.post('/updateQuickMessage/', lineChatController.updateQuickMessage);

router.post('/deleteQuickMessagebyid/', lineChatController.deleteQuickMessageById);

router.post('/insertLineSticker/', lineChatController.insertLineSticker);

router.post('/updateLineSticker/', lineChatController.updateLineSticker);

router.post('/deleteLineStickerbyid/', lineChatController.deleteLineStickerById);

router.post('/getBankVerify/', lineChatController.getBankVerify);

router.post('/insertBankVerify/', lineChatController.insertBankVerify);

router.post('/updateBankVerify/', lineChatController.updateBankVerify);

router.post('/deleteBankVerifybyid/', lineChatController.deleteBankVerifyById);

router.post('/checkAndOpenChatByUserId/', lineChatController.checkAndOpenChatByUserId);

router.post('/readAll/', lineChatController.readAll);

module.exports = router