const LineChatAPI = require('./lineChatAPI');
const MemberList = require('../models/memberlist.model');
const ProductList = require('../models/productlist.model');

/**
 * ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบ dd/MM/yyyy
 * @param {string|Date} date - วันที่ที่ต้องการแปลง
 * @returns {string} วันที่ในรูปแบบ dd/MM/yyyy
 */
function formatDateToDDMMYYYY(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateToDDMMYYYY2(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

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
async function handleRenewalOrPurchase(reply_token, profileData, oSecretkey, channelToken,greeting_msg,greeting_banner_url) {
  try {
    let userList = await MemberList.getUserByLineSourceId(profileData['user_id']);
    const lineChatAPI = new LineChatAPI();
    lineChatAPI.setToken(channelToken);

    if (userList.length > 0) {
      let userData = userList[0];
      // let replyMessage = oSecretkey.webDomain + "buyproduct?sourceUserId=" + profileData['user_id'];
      let replyMessage = oSecretkey.webDomain + "SelectTopic?sourceUserId=" + profileData['user_id'];

      if (greeting_banner_url.length>0) {
        await lineChatAPI.replyImage(reply_token,greeting_banner_url,greeting_banner_url,replyMessage)
      }
      else
      {
        await lineChatAPI.replyMessage(
          reply_token,
          greeting_msg+" " + replyMessage,
        );
      }

     
    }
    else {
      await lineChatAPI.replyMessage(
        reply_token,
        'ไม่พบข้อมูลผู้ใช้'
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
      let products = await ProductList.GetDayExpireByUserId(profileData['user_id']);      
      if (products.length > 0) {
        replyMessage = "";
        for (let index = 0; index < products.length; index++) {
          const element = products[index];
          const dayLeft = element['days_left'] < 0 ? " หมดอายุ " : " เหลือ " + element['days_left'] + " วัน";
          const formattedDate = formatDateToDDMMYYYY2(element['end_date']);
          replyMessage += element['email'] + " ⏰หมดอายุวันที่ " + formattedDate +' '+ element['subscription_name'] + dayLeft + "\n";
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
 * @param {object} profileData - ข้อมูลโปรไฟล์ผู้ใช้
 * @param {object} oSecretkey - Object ที่มี webDomain
 * @param {string} channelToken - Token ของช่องทาง
 * @param {string} greeting_msg - ข้อความทักทาย
 * @param {string} greeting_banner_url - URL รูปภาพแบนเนอร์ทักทาย
 */
async function handleDefaultMessage(reply_token, profileData, oSecretkey, channelToken, greeting_msg, greeting_banner_url) {
  try {
    let replyMessage = greeting_msg ? greeting_msg : 'พิมพ์คำสั่ง เช่น "ซื้อ","ต่ออายุ","เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม';
    const lineChatAPI = new LineChatAPI();
    lineChatAPI.setToken(channelToken);

    if (greeting_banner_url && greeting_banner_url.length > 0) {
      // ถ้ามี greeting_banner_url แต่ไม่มี linkUrl จะส่งรูปธรรมดา (ไม่คลิกได้)
      await lineChatAPI.replyImage(reply_token, greeting_banner_url, greeting_banner_url);
      
      // ถ้ามีข้อความทักทาย แสดงข้อความแยก
      if (greeting_msg && greeting_msg.length > 0) {
        await lineChatAPI.replyMessage(reply_token, greeting_msg);
      }
    } else {
      await lineChatAPI.replyMessage(
        reply_token,
        replyMessage
      );
    }
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

