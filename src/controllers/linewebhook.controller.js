"use strict";
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Secret = require("../../config/secret");
const Cryptof = require("../models/cryptof.model");
const IpAllowList = require('../models/ipallowlist.model');

const timerHelper = require("../modules/timehelper");
const fs = require("fs");
const path = require("path");

const OffsetTime = require("../../config/offsettime");

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

const { createCanvas, loadImage } = require("canvas");
const jsQR = require("jsqr");

const axios = require("axios");
const MainModel = require("../models/main.model");

const lineChatSetting = require('../models/linechatsetting.model');
const LineChatAPI = require('./../modules/lineChatAPI');
const oSecretkey = require("../../config/secret");


function encodeToUTF8(str) {
  return Buffer.from(str, 'utf8').toString('utf8');
}

function unicodeToHex(str) {
  let hex = '';
  for(let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

function hexToUnicode(hexString) {
  let unicodeString = '';
  for (let i = 0; i < hexString.length; i += 4) {
      let hex = hexString.substr(i, 4);
      unicodeString += String.fromCharCode(parseInt(hex, 16));
  }
  return unicodeString;
}

function isUnicodeString(str) {
  for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) {
          return true; // Unicode character found
      }
  }
  return false; // No Unicode characters found
}

function isUnicodeHex(str) {
  // Regular expression to match hexadecimal characters
  const hexRegex = /^[0-9A-Fa-f]+$/;
  
  // Check if the string contains only hexadecimal characters
  return hexRegex.test(str);
}

async function readQRCode(filePath) {
  try {
    // Load the JPEG image
    const image = await loadImage(filePath);

    // Create a canvas with the same dimensions as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    // Decode the QR code
    const qrCode = await jsQR(imageData.data, image.width, image.height);

    if (qrCode) {
      // If a QR code is found, log the result
      // console.log('QR Code Data:', qrCode.data);
      return qrCode.data;
    } else {
      // console.log('No QR Code found in the image.');
      return "";      
    }
  } catch (error) {
    // console.error('Error reading QR code:', error);
    return "";      
  }
}

module.exports = function(wsConnections) {

  const test = async (req, res) => {
    try {
      
      wsConnections.forEach(element => {
        console.log(element.id);
      });
  
      res.status(200).json({
        status: "success",
        data : wsConnections,
      });
      return;
    } catch (error) {
      res.status(202).json({
        status: "error",
      });
      return;
    }
  }

  const broadcast = async (req, res) => {
    try {
      
      console.log("Broadcast");
      wsConnections.forEach(element => {
        console.log(element.id);
        // element.send("hello");
        // console.log("send message "+wsConnections.id);        
        element.send(`TestTest`);
      });
  
      res.status(200).json({
        status: "success",
      });
      return;
    } catch (error) {
      res.status(202).json({
        status: "error",
      });
      return;
    }
  }


  const webhook = async (req, res) => {
    try {
      console.log("webhook");
  
      //handles null error
      const headers = req.headers;
  
      let cTime = new Date();
      cTime = new Date(cTime.getTime() + offsetTime);
  
      let pairKey = req.params.pairKey?req.params.pairKey:'';
  
      let tmpChatSetting = [];
      if (pairKey.length==0) 
      {
        console.log("Invalid Pair Key");
        res.status(202).json({
          status: "error",
        });
        return;
      }
      else
      {
        tmpChatSetting =  await MainModel.queryFirstRow(`SELECT * FROM line_setting WHERE pair_key='${pairKey}'`);
        if (tmpChatSetting.length==0) 
        {
          console.log("Invalid Pair Key");
          res.status(202).json({
            status: "error",
          });
          return;
        }      
  
      }

      if (tmpChatSetting['status']!=1) 
      {
        res.status(202).json(
          { 
              status: 'error', 
              message: 'This line is not active',
              auth : false,
              data : [],
          }
        );
        return;
      }
  
      let tmp_data = req.body;
      let channelToken ="";
      channelToken = tmpChatSetting['channel_token'];
      
      const lineChatAPI = new LineChatAPI();
      lineChatAPI.setToken(channelToken);
  
      if (tmp_data['events'].length==0) 
      {
        console.log("Verify Only");
        //Get Bot Profile      
        let profile = await lineChatAPI.getBotProfile();
        if (profile['error']) 
        {
          console.log(profile['error']);
          tmpChatSetting['note'] = profile['error'];
          let tmpUpdateData = await lineChatSetting.updateByID(tmpChatSetting);
  
          res.status(202).json(
            { 
                status: 'error', 
                message: profile['error'],
                auth : false,
                data : [],
            }
          );
          return;
  
        }
        else
        {
            tmpChatSetting['display_name'] = profile.displayName?profile.displayName.replaceAll("'"," "):"";
            tmpChatSetting['user_id'] = profile.userId?profile.userId:"";
            tmpChatSetting['basic_id'] = profile.basicId?profile.basicId:"";
            tmpChatSetting['picture_url'] = profile.pictureUrl?profile.pictureUrl:"";                        
            tmpChatSetting['last_login'] = cTime;
            tmpChatSetting['note'] = "";            
  
            // if (isUnicodeString(profileData['display_name'])) 
            //   {
            //       profileData['display_name'] = unicodeToHex(profileData['display_name']);
            //   }
            
            tmpChatSetting = await lineChatSetting.updateByID(tmpChatSetting);
            if(tmpChatSetting['affectedRows'])
            {
                res.status(202).json(
                  { 
                      status: 'error', 
                      message: 'Success',
                      auth : true,
                      data : [],
                  }
                );
                return;
            }
            else
            {
                console.log('Cant update bot profile data');
                res.status(202).json(
                  { 
                      status: 'error', 
                      message: 'Cant update bot profile data',
                      auth : false,
                      data : [],
                  }
                );
                return;
            }
        }      
  
      }
  
      let botUserId = tmpChatSetting['user_id'];
          
      let reply_token = req.body.events[0].replyToken? req.body.events[0].replyToken:"";
      let msg = "";
           
      try {
        if (req.body.events[0].message['text']) {
          msg = req.body.events[0].message['text'];
        } 
      } catch (error) {
        
      }

      let message_type_input = req.body.events[0].message.type ? req.body.events[0].message.type : "";
      let msg_detail = {};
  
      let quotedMessageId = req.body.events[0].message.quotedMessageId?req.body.events[0].message.quotedMessageId:"";
  
      let sourceType = req.body.events[0].source.type ? req.body.events[0].source.type : "";
      let sourceGroupId = req.body.events[0].source.groupId ?req.body.events[0].source.groupId: "";
      let sourceUserId = req.body.events[0].source.userId ? req.body.events[0].source.userId:"";
      
      let checkProfile = [];
      let profile2=null;
      let profileData = [];
      if (sourceUserId!='') 
      {
        let checkProfile = await MainModel.query(`SELECT * FROM line_contact WHERE bot_user_id='${botUserId}' AND user_id='${sourceUserId}'`);
        if (checkProfile.length==0) 
        {          
          lineChatAPI.setToken(channelToken);
          profile2 = await lineChatAPI.getProfile(sourceUserId);
          if (profile2['error']) 
          { 
            console.log(profile2['error']);
            res.status(202).json(
              { 
                  status: 'error', 
                  message: profile2['error'],
                  auth : false,
                  data : [],
              }
            );
            return;
          }
          else
          {
              
              profileData['bot_user_id'] = botUserId;            
              profileData['alias_userid'] = "";
              profileData['user_id'] = profile2.userId?profile2.userId:"";
              profileData['display_name'] = profile2.displayName?profile2.displayName.replaceAll("'"," "):"";
              profileData['language'] = profile2.language?profile2.language:"";
              profileData['picture_url'] = profile2.pictureUrl?profile2.pictureUrl:"";                        
              profileData['status_message'] = profile2.statusMessage?profile2.statusMessage:"";     
              profileData['last_update'] = timerHelper.convertDatetimeToStringNoT(cTime);
              profileData['note_at'] = timerHelper.convertDatetimeToStringNoT(cTime);
                            
              // if (isUnicodeString(profileData['display_name'])) 
              // {
              //     profileData['display_name'] = unicodeToHex(profileData['display_name']);
              // }
  
              if (botUserId && profileData['user_id'].length>0) 
              {
                if (!MainModel.insert("line_contact",profileData)) 
                {
                  profileData['display_name'] = "Customer "+profileData['user_id'].substring(profileData['user_id'].length- 4, profileData['user_id'].length);
                  MainModel.insert("line_contact",profileData)
                }
  
              }
              
          }
        }
        else
        {
          profileData=checkProfile[0];
          let lastUpdate = new Date(profileData['last_update']);

          let diffMilliseconds = cTime - lastUpdate;
          let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

          if (diffMinutes>1440) 
          {
            lineChatAPI.setToken(channelToken);
            profile2 = await lineChatAPI.getProfile(sourceUserId);
            if (profile2['error']) 
            { 
              
            }
            else
            {
              profileData['display_name'] = profile2.displayName?profile2.displayName.replaceAll("'"," "):"";
              profileData['language'] = profile2.language?profile2.language:"";
              profileData['picture_url'] = profile2.pictureUrl?profile2.pictureUrl:"";                        
              profileData['status_message'] = profile2.statusMessage?profile2.statusMessage:"";     
              profileData['last_update'] = timerHelper.convertDatetimeToStringNoT(cTime);
              profileData['note_at'] = profile2.note_at?timerHelper.convertDatetimeToStringNoT(profile2.note_at):timerHelper.convertDatetimeToStringNoT(cTime);

              MainModel.update("line_contact",profileData,{bot_user_id:botUserId,user_id:sourceUserId});
            }
          }

        }
  
  
        let message_type = 0;
        if(message_type_input=="text")
        {
          message_type = 0;
        }
        else if(message_type_input=="sticker")
        {
          message_type = 1;
          msg_detail = req.body.events[0].message?req.body.events[0].message:"{}";
        }
        else if(message_type_input=="image")
        {
          message_type = 2;
          msg_detail = req.body.events[0].message?req.body.events[0].message:"{}";
        }
        else if(message_type_input=="video")
        {
          message_type = 3;
          msg_detail = req.body.events[0].message?req.body.events[0].message:"{}";
        }
        else if(message_type_input=="audio")
        {
          message_type = 4;
          msg_detail = req.body.events[0].message?req.body.events[0].message:"{}";
        }
        else if(message_type_input=="location")
        {
          message_type = 5;
          msg_detail = req.body.events[0].message?req.body.events[0].message:"{}";
        }      
  
        let line_chat_active_id=0;
  
        let checkDupActiveChat = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${botUserId}' and chat_with_user_id='${sourceUserId}' order by last_chattime desc `);
        if (checkDupActiveChat.length>0) 
        {
          
          let diffMilliseconds = cTime - new Date(checkDupActiveChat[0]['last_chattime']);
          let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
          if (diffMinutes>10) 
          {
            await MainModel.update("line_chat_active",
              {            
                close_by : 'SYSTEM',
                active: 0,
                reply_token:reply_token,
              },
              {
                bot_user_id : botUserId,
                chat_with_user_id : sourceUserId,
              }
            );
  
            //Close chat active and Insert New Chat active
            await MainModel.insert("line_chat_active",
              {
                bot_user_id : botUserId,
                chat_with_user_id : sourceUserId,
                chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                active: 1,
                reply_token:reply_token,
              }
            );
            
            let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${botUserId}' and chat_with_user_id='${sourceUserId}' and active=1 order by last_chattime desc `);
            line_chat_active_id = getLastId[0]['id'];
          }
          else
          {
              line_chat_active_id = checkDupActiveChat[0]['id'];
  
              //Update  
              MainModel.update("line_chat_active",
                {            
                  last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                  active: 1,
                  reply_token:reply_token,
                },
                {
                  id : line_chat_active_id,                  
                }
              );
          }
  
          
        }
        else
        {
          await MainModel.insert("line_chat_active",
            {
              bot_user_id : botUserId,
              chat_with_user_id : sourceUserId,
              chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
              last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
              active: 1,
              reply_token:reply_token,
            }
          );
  
          let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${botUserId}' and chat_with_user_id='${sourceUserId}' and active=1 order by last_chattime desc `);
          line_chat_active_id = getLastId[0]['id'];
        }
  
        let tmpDataContent = [];
        if (message_type==2) 
        {
          if (msg_detail['id']) 
          {
            let contentId =msg_detail['id'];
            tmpDataContent = await lineChatAPI.getContent2(contentId);
              if (tmpDataContent['contentUrl']) {         
                  if (tmpDataContent['error']) 
                  {
                    
                  }
                  else if (tmpDataContent['message']) 
                  {
                    
                  }   
                  else
                  {
                    
                    const destinationPath = tmpDataContent['imagePath'];
                    msg_detail['content_url'] = tmpDataContent['contentUrl'];
                    let barCode = await readQRCode(destinationPath);         
                    if (barCode!="") {
                      msg_detail['qr_code'] = barCode;
                    }
                  }                              
              }
          }  
        }
        else if (message_type==3) 
        {
          console.log("video");
          console.log(message_type);
          if (msg_detail['id']) 
          {
            let contentId =msg_detail['id'];
            tmpDataContent = await lineChatAPI.getContent2(contentId);                               
              if (tmpDataContent['contentUrl']) {         
                  if (tmpDataContent['error']) 
                  {
                    
                  }
                  else if (tmpDataContent['message']) 
                  {
                    
                  }   
                  else
                  {
                    
                    const destinationPath = tmpDataContent['imagePath'];
                    msg_detail['content_url'] = tmpDataContent['contentUrl'];                    
                  }                              
              }
          }  
        }
        else if (message_type==0 && msg)
        {
          let tmp_msg_detail = msg;
          //tmp_msg_detail contain "สมัคร"          
            if ( tmp_msg_detail.includes("สมัคร")) {
              let replyMessage = oSecretkey.webDomain+ "/registeremail?sourceUserId="+sourceUserId;
                lineChatAPI.replyMessage(                  
                  reply_token,
                  {
                    type: 'text',
                    text: "เปิดลิงค์นี้เพื่อทำการสมัคร "+replyMessage,
                  }
                );
            }
            else if(tmp_msg_detail.includes("ต่ออายุ")||tmp_msg_detail.includes("ซื้อ"))
            {
              //let replyMessage = oSecretkey.webDomain+ "/register?sourceUserId="+sourceUserId;
              let userList = await MainModel.query(`SELECT * FROM sl_users WHERE line_sourceid ='${profileData['user_id']}' `);
              if (userList.length>0) 
              {
                let userData = userList[0];
                let replyMessage = oSecretkey.webDomain+ "/buyproduct?userId="+profileData['user_id'];
                lineChatAPI.replyMessage(                  
                  reply_token,
                  {
                    type: 'text',
                    text: "เปิดลิงค์นี้เพื่อทำการซื้อ " +replyMessage,
                  }
                );
              }
              else
              {
                lineChatAPI.replyMessage(
                  reply_token,
                  {
                    type: 'text',
                    text: 'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม',
                  }
                );
                
              }
            }
            else if(tmp_msg_detail.includes("เช็ควัน"))
            {

            }
            else if(tmp_msg_detail)
            {
              let replyMessage = 'พิมพ์คำสั่ง เช่น "สมัคร", "ต่ออายุ", "ซื้อ", "เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม';
              lineChatAPI.replyMessage(
                  reply_token,
                  {
                    type: 'text',
                    text: replyMessage,
                  }
                );
            }
        }
  
        delete msg_detail['keywords'];
        //delete msg_detail['contentProvider'];        

        //console.log(msg_detail);
  
        MainModel.insert("line_chat_message",
          {
            bot_user_id : botUserId,
            chat_with_user_id : sourceUserId,
            line_chat_active_id : line_chat_active_id,
            message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
            message : msg,
            message_type : message_type,
            reply_to_id : quotedMessageId,
            message_detail: JSON.stringify(msg_detail),
            is_read :0,
            is_deleted:0,
          }
        );

        const wsMessage = {
          wstype : 'new_message',
          bot_id : tmpChatSetting['id'],
          bot_user_id : botUserId,
          chat_with_user_id : sourceUserId,
          profileData : profileData,
          message_content : {
            bot_user_id : botUserId,
            chat_with_user_id : sourceUserId,
            line_chat_active_id : line_chat_active_id,
            message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
            message : msg,
            message_type : message_type,
            reply_to_id : quotedMessageId,
            message_detail: JSON.stringify(msg_detail),
            is_read :0,
            is_deleted:0,
          },
        };

        // wsConnections.forEach(element => {
        //   console.log("braodcast to : "+ element.id);
        //   element.send(JSON.stringify(wsMessage));
        // });
  
        res.status(200).json({
          status: "success",
          wsMessage: wsMessage,          
          message_type: message_type,
          newData : tmpDataContent['newData']?tmpDataContent['newData']:null,
          newFileName : tmpDataContent['newFileName']?tmpDataContent['newFileName']:null,
        });
        return;
  
      }
  
      res.status(202).json({
        status: "error",
      });
      return;
  
    } catch (error) {
      console.log(error.message);
      res.status(202).json({
        status: "error",
      });
    }
  }

  return {
    test,
    broadcast,
    webhook
  };
}
