const LineChatAPI = require('./lineChatAPI');
const MemberList = require('../models/memberlist.model');
const ProductList = require('../models/productlist.model');

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ "สมัคร"
 * @param {string} reply_token - Token สำหรับตอบกลับ
 * @param {string} sourceUserId - ID ของผู้ใช้
 * @param {object} oSecretkey - Object ที่มี webDomain
 */
async function handleRegistration(reply_token, sourceUserId, oSecretkey, channelToken) {
  try {
    let replyMessage = oSecretkey.webDomain + "registeremail?sourceUserId=" + sourceUserId;
    const lineChatAPI = new LineChatAPI();
    lineChatAPI.setToken(channelToken);

    await lineChatAPI.replyMessage(
      reply_token,
      "เปิดลิงค์นี้เพื่อทำการสมัคร " + replyMessage
    );
  } catch (error) {
    console.error('Error in handleRegistration:', error.message);
  }
}

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ "ต่ออายุ" หรือ "ซื้อ"
 * @param {string} reply_token - Token สำหรับตอบกลับ
 * @param {object} profileData - ข้อมูลโปรไฟล์ผู้ใช้
 * @param {object} oSecretkey - Object ที่มี webDomain
 */
async function handleRenewalOrPurchase(reply_token, profileData, oSecretkey, channelToken) {
  try {
    let userList = await MemberList.getUserByLineSourceId(profileData['user_id']);
    const lineChatAPI = new LineChatAPI();
    lineChatAPI.setToken(channelToken);

    if (userList.length > 0) {
      let userData = userList[0];
      let replyMessage = oSecretkey.webDomain + "buyproduct?sourceUserId=" + profileData['user_id'];
      await lineChatAPI.replyMessage(
        reply_token,
        "เปิดลิงค์นี้เพื่อทำการซื้อ " + replyMessage,
      );
    }
    else {
      await lineChatAPI.replyMessage(
        reply_token,
        'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม'
      );
    }
  } catch (error) {
    console.error('Error in handleRenewalOrPurchase:', error.message);
  }
}

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ "เช็ควัน"
 * @param {string} reply_token - Token สำหรับตอบกลับ
 * @param {object} profileData - ข้อมูลโปรไฟล์ผู้ใช้
 */
async function handleCheckDays(reply_token, profileData, oSecretkey, channelToken) {
  try {
    let replyMessage = "ไม่มีข้อมูล";
    let userList = await MemberList.getUserByLineSourceId(profileData['user_id']);
    const lineChatAPI = new LineChatAPI();
    lineChatAPI.setToken(channelToken);

    if (userList.length > 0) {
      let products = await ProductList.GetDayExpireByUserId(userList[0].id);
      if (products.length > 0) {
        replyMessage = "";
        for (let index = 0; index < products.length; index++) {
          const element = products[index];
          const dayLeft = element['days_left'] < 0 ? " หมดอายุ " : " เหลือ " + element['days_left'] + " วัน";
          replyMessage += element['email'] + " หมดอายุวันที่ " + element['end_date'] + element['subscription_name'] + dayLeft + "\n";
        }
      }

      await lineChatAPI.replyMessage(
        reply_token,
        replyMessage
      );
    }
    else {
      await lineChatAPI.replyMessage(
        reply_token,
        'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม'
      );
    }
  } catch (error) {
    console.error('Error in handleCheckDays:', error.message);
  }
}

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ข้อความอื่นๆ
 * @param {string} reply_token - Token สำหรับตอบกลับ
 */
async function handleDefaultMessage(reply_token, oSecretkey, channelToken) {
  try {
    let replyMessage = 'พิมพ์คำสั่ง เช่น "ซื้อ","ต่ออายุ","เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม';
    const lineChatAPI = new LineChatAPI();
    lineChatAPI.setToken(channelToken);

    await lineChatAPI.replyMessage(
      reply_token,
      replyMessage
    );
  } catch (error) {
    console.error('Error in handleDefaultMessage:', error.message);
  }
}

module.exports = {
  handleRegistration,
  handleRenewalOrPurchase,
  handleCheckDays,
  handleDefaultMessage
};

