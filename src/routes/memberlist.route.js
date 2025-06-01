const express = require('express')
const router = express.Router()
const memberlistController = require('../controllers/memberlist.controller');
let cors = require('cors')

router.use(cors());

router.post('/create/', memberlistController.create);

router.post('/registermember/', memberlistController.registerMember);

router.post('/registermemberWithEmail/', memberlistController.registermemberWithEmail);

router.post('/getmember/', memberlistController.getmember);

router.post('/getMemberEmail/', memberlistController.getMemberEmail);

router.post('/getLineProfileByLineSourceId/', memberlistController.getLineProfileByLineSourceId);

router.post('/getAllMemberEmail/', memberlistController.getAllMemberEmail);

router.post('/addMemberEmail/', memberlistController.addMemberEmail);

router.post('/getEmailByLineSourceId/', memberlistController.getEmailByLineSourceId);

router.post('/deleteMemberEmail/', memberlistController.deleteMemberEmail);

router.post('/getuserforgive/', memberlistController.getUserForGive);

router.post('/getcountmember/', memberlistController.getCountMember);

router.post('/getcountnewmember/', memberlistController.getCountNewMember);

router.post('/getmemberbyid/', memberlistController.getmemberbyid);

router.post('/getMemberDepWitByID/', memberlistController.getMemberDepWitByID);

router.post('/updatememberbyid/', memberlistController.updatememberbyid);

router.post('/UpdateBankAccount/', memberlistController.updateBankAccount);

router.post('/inactivememberbyid/', memberlistController.inactivememberbyid);

router.post('/login/', memberlistController.login);

router.post('/refreshtoken/', memberlistController.refreshtoken);

router.post('/updateAutoBank/', memberlistController.updateAutoBank);

router.post('/cancelPromotion/', memberlistController.cancelPromotion);

router.post('/updateLineId/', memberlistController.updateLineId);

router.post('/getCreditByUsername/', memberlistController.getCreditByUsername);

router.post('/depositCreditMemberByid/', memberlistController.depositCreditMemberByid);

router.post('/withdrawCreditMemberByid/', memberlistController.withdrawCreditMemberByid);

router.post('/withdrawCreateByMemberId/', memberlistController.withdrawCreateByMemberId);

router.post('/changePromotionMemberByid/', memberlistController.changePromotionMemberByid);

router.post('/changePromotionMemberByid2/', memberlistController.changePromotionMemberByid2);

router.post('/getQuestDataMemberByid/', memberlistController.getQuestDataMemberByid);

router.post('/getTurnGraphDataMemberByid/', memberlistController.getTurnGraphDataMemberByid);

router.post('/getHistoryDepWitMemberByID/', memberlistController.getHistoryDepWitMemberByID);

router.post('/getHistoryDepMemberByID/', memberlistController.getHistoryDepMemberByID);

router.post('/getHistoryWitMemberByID/', memberlistController.getHistoryWitMemberByID);

router.post('/getHistoryBetLogByID/', memberlistController.getHistoryBetLogByID);

router.post('/changePasswordMemberByID/', memberlistController.changePasswordMemberByID);

router.post('/getAffiliateMemberByID/', memberlistController.getAffiliateMemberByID);

router.post('/getAffiliateCreditMemberByID/', memberlistController.getAffiliateCreditMemberByID);

router.post('/getCurrentAffiliateCreditMemberByID/', memberlistController.getCurrentAffiliateCreditMemberByID);

router.post('/withdrawAff/', memberlistController.withdrawAff);

router.post('/getNameAuto/', memberlistController.getNameAuto);

router.post('/getUserPromotion/', memberlistController.getUserPromotion);

router.post('/getDailyDepositInfoMemberByID/', memberlistController.getDailyDepositInfoMemberByID);

router.post('/getDailyDepositMemberByID/', memberlistController.getDailyDepositMemberByID);

router.post('/chooseLuckyCard/', memberlistController.chooseLuckyCard);

router.post('/getRefundMemberByID/', memberlistController.getRefundMemberByID);

router.post('/getuseronline/', memberlistController.getuseronline);

router.post('/getcodefree/', memberlistController.getCodefree);

router.post('/checkCanSpinWheel/', memberlistController.checkCanSpinWheel);

router.post('/getSpinWheel/', memberlistController.getSpinWheel);

router.post('/getCreditHistoryByMemberId/', memberlistController.getCreditHistoryByMemberId);

router.post('/getNoticeUser/', memberlistController.getNoticeUser);

router.post('/getAungPao/', memberlistController.getAungPao);

module.exports = router