const lineChatAPI = require('./lineChatAPI');
const MemberList = require('../models/memberlist.model');
const ProductList = require('../models/productlist.model');

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ "สมัคร"
 * @param {string} reply_token - Token สำหรับตอบกลับ
 * @param {string} sourceUserId - ID ของผู้ใช้
 * @param {object} oSecretkey - Object ที่มี webDomain
 */
async function handleRegistration(reply_token, sourceUserId, oSecretkey) {
  let replyMessage = oSecretkey.webDomain + "registeremail?sourceUserId=" + sourceUserId;
  lineChatAPI.replyMessage(
    reply_token,
    "เปิดลิงค์นี้เพื่อทำการสมัคร " + replyMessage
  );
}

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ "ต่ออายุ" หรือ "ซื้อ"
 * @param {string} reply_token - Token สำหรับตอบกลับ
 * @param {object} profileData - ข้อมูลโปรไฟล์ผู้ใช้
 * @param {object} oSecretkey - Object ที่มี webDomain
 */
async function handleRenewalOrPurchase(reply_token, profileData, oSecretkey) {
  let userList = await MemberList.getUserByLineSourceId(profileData['user_id']);
  if (userList.length > 0) {
    let userData = userList[0];
    let replyMessage = oSecretkey.webDomain + "buyproduct?sourceUserId=" + profileData['user_id'];
    lineChatAPI.replyMessage(
      reply_token,
      "เปิดลิงค์นี้เพื่อทำการซื้อ " + replyMessage,
    );
  }
  else {
    lineChatAPI.replyMessage(
      reply_token,
      'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม'
    );
  }
}

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ "เช็ควัน"
 * @param {string} reply_token - Token สำหรับตอบกลับ
 * @param {object} profileData - ข้อมูลโปรไฟล์ผู้ใช้
 */
async function handleCheckDays(reply_token, profileData) {
  let replyMessage = "ไม่มีข้อมูล";
  let userList = await MemberList.getUserByLineSourceId(profileData['user_id']);
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

    lineChatAPI.replyMessage(
      reply_token,
      replyMessage
    );
  }
  else {
    lineChatAPI.replyMessage(
      reply_token,
      'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม'
    );
  }
}

/**
 * ฟังก์ชันสำหรับตอบกลับเมื่อผู้ใช้พิมพ์ข้อความอื่นๆ
 * @param {string} reply_token - Token สำหรับตอบกลับ
 */
function handleDefaultMessage(reply_token) {
  let replyMessage = 'พิมพ์คำสั่ง เช่น "สมัคร", "ต่ออายุ", "ซื้อ", "เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม';
  lineChatAPI.replyMessage(
    reply_token,
    replyMessage
  );
}

module.exports = {
  handleRegistration,
  handleRenewalOrPurchase,
  handleCheckDays,
  handleDefaultMessage
};

