"use strict";
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Secret = require("../../config/secret");
const Cryptof = require("../models/cryptof.model");
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const SCBModel = require('../models/scb.model');

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

const Scb_app_lib = require('./../modules/scbapplib');
const Kplus_lib_202204 = require('./../modules/kplusclass');


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

exports.getSelfProfile = async function(req, res) {

  try {
      console.log('getSelfProfile');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?req.body.id:0;

                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                                    
                  let tmpLineData = lineChatSetting.findByID(tmpId);
                  if (tmpLineData.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found data',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    const lineChatAPI = new LineChatAPI();
                    lineChatAPI.setToken(tmpLineData['channel_token']);
                    let profile = await lineChatAPI.getBotProfile();
                    if (profile['error']) 
                    {
                      tmpLineData['note'] = profile['error'];
                      let tmpUpdateData = await lineChatSetting.updateByID(tmpLineData);

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
                        tmpLineData['display_name'] = profile.displayName?profile.displayName.replaceAll("'"," "):"";
                        tmpLineData['user_id'] = profile.userId?profile.userId:"";
                        tmpLineData['basic_id'] = profile.basicId?profile.basicId:"";
                        tmpLineData['picture_url'] = profile.pictureUrl?profile.pictureUrl:"";                        
                        tmpLineData['last_login'] = cTime;
                        tmpLineData['note'] = "";

                        // if (isUnicodeString(profileData['display_name'])) 
                        // {
                        //     profileData['display_name'] = unicodeToHex(profileData['display_name']);
                        // }
                        
                        let tmpUpdateData = await lineChatSetting.updateByID(tmpLineData);
                        if(tmpUpdateData['affectedRows'])
                        {
                            delete tmpLineData['channel_token'];        
                            
                            // if (isUnicodeHex(tmpLineData['display_name'])) 
                            // {
                            //   tmpLineData['display_name'] = hexToUnicode(tmpLineData['display_name']);
                            // }

                            res.status(200).json(
                              { 
                                  status: 'success', 
                                  message: '',
                                  auth : true,                          
                                  data : tmpLineData,
                              }
                            );
                            return;
                        }
                        else
                        {
                            tmpLineData['display_name'] = "Customer "+tmpLineData['user_id'].substr(tmpLineData['user_id'].length-5,4);
                            let tmpUpdateData2 = await lineChatSetting.updateByID(tmpLineData);
                            if(tmpUpdateData['affectedRows'])
                            {
                                delete tmpLineData['channel_token'];        
                                
                                // if (isUnicodeHex(tmpLineData['display_name'])) 
                                // {
                                //   tmpLineData['display_name'] = hexToUnicode(tmpLineData['display_name']);
                                // }

                                res.status(200).json(
                                  { 
                                      status: 'success', 
                                      message: '',
                                      auth : true,                          
                                      data : tmpLineData,
                                  }
                                );
                                return;
                            }
                            

                            res.status(202).json(
                              { 
                                  status: 'error', 
                                  message: 'Cant update data',
                                  auth : false,
                                  data : [],
                              }
                            );
                            return;
                        }
                    }

                  }

              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getProfile = async function(req, res) {

  try {
      console.log('getProfile');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?req.body.id:0;
                  let lineUserId = req.body.lineUserId?req.body.lineUserId:'';

                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (lineUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                                    
                  let tmpLineData = lineChatSetting.findByID(tmpId);
                  if (tmpLineData.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found data',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    const lineChatAPI = new LineChatAPI();
                    lineChatAPI.setToken(tmpLineData['channel_token']);
                    let profile = await lineChatAPI.getProfile(lineUserId);
                    if (profile['error']) 
                    {
                      
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
                        let profileData = [];                                                                        
                        profileData['bot_user_id'] = tmpLineData['user_id'];
                        profileData['user_id'] = profile.userId?profile.userId:"";
                        profileData['display_name'] = profile.displayName?profile.displayName.replaceAll("'"," "):"";
                        profileData['language'] = profile.language?profile.language:"";
                        profileData['picture_url'] = profile.pictureUrl?profile.pictureUrl:"";                        
                        profileData['status_message'] = profile.statusMessage?profile.statusMessage:"";     

                        // if (isUnicodeString(profileData['display_name'])) 
                        // {
                        //     profileData['display_name'] = unicodeToHex(profileData['display_name']);
                        // }

                        if (tmpLineData['user_id'] && profileData['user_id'].length>0) 
                        {
                          let tmpLineContact = await MainModel.query(`SELECT * FROM line_contact WHERE bot_user_id='${tmpLineData['user_id']}' and user_id='${profileData['user_id']}' `);
                          if (tmpLineContact.length>0) 
                          {
                              //Update                                                            
                              if (!MainModel.update("line_contact",profileData,{id:tmpLineContact[0]['id']})) 
                              {
                                profileData['display_name'] = "Customer "+profileData['user_id'].substring(profileData['user_id'].length- 4, profileData['user_id'].length);
                                MainModel.update("line_contact",profileData,{id:tmpLineContact[0]['id']});
                              }
                          }
                          else
                          {
                              //Insert                              
                              if (!MainModel.insert("line_contact",profileData)) 
                              {
                                profileData['display_name'] = "Customer "+profileData['user_id'].substring(profileData['user_id'].length- 4, profileData['user_id'].length);
                                MainModel.insert("line_contact",profileData);
                              }
                          }
                        }

                        // if (isUnicodeHex(profileData['display_name'])) {
                        //   profileData['display_name'] = hexToUnicode(profileData['display_name']);
                        // }
                        
                        res.status(200).json(
                          { 
                              status: 'success', 
                              message: '',
                              auth : true,                          
                              data : profileData,
                          }
                        );
                    }

                  }

                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getContact = async function(req, res) {

  try {
      console.log('getContact');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let tmpLineData = await lineChatSetting.getContact(bot_user_id);
                  let tmpReturnData = [];
                  for (let index = 0; index < tmpLineData.length; index++) {

                    // if (isUnicodeHex(tmpLineData[index]['display_name'])) 
                    // {
                    //   tmpLineData[index]['display_name'] = hexToUnicode(tmpLineData[index]['display_name']);
                    // }

                    tmpReturnData.push(
                      {
                        id : tmpLineData[index]['user_id'],
                        fullName : tmpLineData[index]['display_name'],
                        role : '-',
                        about : tmpLineData[index]['status_message'],
                        avatar :  tmpLineData[index]['picture_url'],
                        status: 'online',
                        alias_userid : tmpLineData[index]['alias_userid']?tmpLineData[index]['alias_userid']:tmpLineData[index]['alias_userid'],
                        note : tmpLineData[index]['note']?tmpLineData[index]['note']:'',
                        tag : tmpLineData[index]['tag']?tmpLineData[index]['tag'].split(','):[],
                        note_by : tmpLineData[index]['note_by']?tmpLineData[index]['note_by']:'',                        
                        note_at : tmpLineData[index]['note_at'],
                      }
                    );
                  }
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getActiveChatContact = async function(req, res) {

  try {
      console.log('getActiveChatContact');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }

                  let tmpLineData = await lineChatSetting.getActiveChatContact(bot_user_id,isAdmin,userid);
                  let tmpReturnData = tmpLineData;
                  
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getActiveChatContact2 = async function(req, res) {

  try {
      console.log('getActiveChatContact2');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }

                  let tmpLineData = await lineChatSetting.getActiveChatContact2(bot_user_id,isAdmin,userid);
                  let tmpReturnData = tmpLineData;
                  
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getChatWithUserId = async function(req, res) {

  try {
      console.log('getChatWithUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  let openAllHistory = req.body.openAllHistory?req.body.openAllHistory:false;
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }
                  
                  const lineChatAPI = new LineChatAPI();
                  lineChatAPI.setToken(tmpChatSetting['channel_token']);

                  let line_chat_active_id=0;
                  let tmpLineData = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,openAllHistory);
                  if (tmpLineData.length>0) 
                  {
                    for (let index = 0; index < tmpLineData.length; index++) {
                      if(tmpLineData[index]['message_type']==2)
                      {
                        let tmpJSON = JSON.parse(tmpLineData[index]['message_detail']);
                        if (tmpJSON['id']) 
                        {
                          let contentId = tmpJSON['id'];
                          if (tmpJSON['content_url']==null) 
                          {
                             let tmpDataContent = await lineChatAPI.getContent2(contentId);
                             if (tmpDataContent) {                                       
                              if (tmpDataContent['error']) 
                                {
                                  
                                }
                                else if (tmpDataContent['message']) 
                                {
                                  
                                }   
                                else
                                {
                                  tmpJSON['content_url'] = tmpDataContent;
                                  MainModel.update("line_chat_message",{message_detail:JSON.stringify(tmpJSON)},{id:tmpLineData[index]['id']});
                                  tmpLineData[index]['message_detail'] = JSON.stringify(tmpJSON);
                                }                              
                             }
                          }
                        }
                      }                    
                    }
  
                    MainModel.update("line_chat_message",{is_read:1},
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id  : tmpUserId,
                      }
                    );

                    const wsMessage = {
                      wstype : 'open_chat',
                      bot_id : tmpChatSetting['id'],
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,       
                      open_by : userid,                                        
                    };
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            wsMessage: wsMessage, 
                            auth : true,                          
                            data : tmpLineData,
                        }
                    );
                    return;
                  }
                  else
                  {
                    await MainModel.insert("line_chat_active",
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id : tmpUserId,
                        chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                        active: 1,
                        reply_by : userid,
                      }
                    );
                      
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                    line_chat_active_id = getLastId[0]['id'];

                    await MainModel.insert("line_chat_message",
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id : tmpUserId,
                        line_chat_active_id : line_chat_active_id,
                        message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                        message : "Start Conversation",
                        message_type : -1,
                        reply_to_id : '',
                        message_detail:'',
                        is_read :0,
                        is_deleted:0,
                        is_sending :1,
                        send_by: userid,
                      }
                    );

                    let tmpLineData2 = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,false);

                    const wsMessage = {
                      wstype : 'open_chat',
                      bot_id : tmpChatSetting['id'],
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,       
                      open_by : userid,                                            
                    };

                    res.status(200).json(
                      { 
                          wsMessage: wsMessage,    
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData2,
                      }
                    );
                    return;
                    
                  }
                  
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.deleteChatUserId = async function(req, res) {

  try {
      console.log('deleteChatUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }
                  
                  let tmpLineData = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,true);

                  MainModel.update("line_chat_message",{is_deleted:1},
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id  : tmpUserId,
                      }
                  );

                  if (tmpLineData.length>0) {
                      const indexData = tmpLineData.length-1;
                      
                      const insertData = {
                        'bot_user_id' : tmpLineData[indexData]['bot_user_id'],
                        'chat_with_user_id' : tmpLineData[indexData]['chat_with_user_id'],
                        'line_chat_active_id' : tmpLineData[indexData]['line_chat_active_id'],
                        'message_datetime' : timerHelper.convertDatetimeToStringNoT(cTime),
                        'message' : "Clear Chat",
                        'message_type' : 0,
                        'reply_to_id' : "",
                        'message_detail' : "",
                        'is_read' : 1,
                        'is_deleted' : 0,
                        'send_by' : userid,
                        'is_sending' : 1,
                        'send_completed' : 1,
                      }                      
                      
                      await MainModel.insert("line_chat_message",insertData);
                  }

                  tmpLineData = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,false);
                  let tmpReturnData = tmpLineData;
                  
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
                    return;
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.sendMessageToUserId = async function(req, res) {

  try {
      console.log('sendMessageToUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  let msg = req.body.msg?req.body.msg:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (msg.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid Message',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }
                  
                  
                  let over10Minute = true;
                  let replyToken = "";
                  let line_chat_active_id=0;

                  let checkDupActiveChat = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by last_chattime desc `);
                  if (checkDupActiveChat.length>0) 
                  {

                    replyToken = checkDupActiveChat[0]['reply_token']?checkDupActiveChat[0]['reply_token']:'';
                    
                    let diffMilliseconds = cTime - new Date(checkDupActiveChat[0]['last_chattime']);
                    let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

                    if (diffMinutes>10) 
                    {
                      await MainModel.update("line_chat_active",
                        {            
                          close_by : 'SYSTEM',
                          active: 0,
                        },
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                        }
                      );

                      //Close chat active and Insert New Chat active
                      await MainModel.insert("line_chat_active",
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                          chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                          active: 1,
                          reply_by : userid,
                        }
                      );
                      
                      let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                      line_chat_active_id = getLastId[0]['id'];
                    }
                    else
                    {
                        over10Minute = false;
                        line_chat_active_id = checkDupActiveChat[0]['id'];

                        if (checkDupActiveChat[0]['reply_by']==null || checkDupActiveChat[0]['reply_by']=='') 
                        {
                            //Update  
                            MainModel.update("line_chat_active",
                              {            
                                last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                                active: 1,
                                reply_by : userid,
                                reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                              },
                              {
                                id : line_chat_active_id,                                
                              }
                            );
                        }
                        else
                        {
                          //Update  
                          MainModel.update("line_chat_active",
                            {            
                              last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                              active: 1,
                            },
                            {
                              id:line_chat_active_id,
                            }
                          );
                        }

                    }

                    
                  }
                  else
                  {
                    await MainModel.insert("line_chat_active",
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id : tmpUserId,
                        chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        active: 1,
                      }
                    );

                    let getLastActiveId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                    line_chat_active_id = getLastActiveId[0]['id'];
                  }

                  await MainModel.update("line_chat_message",{is_read:1},{line_chat_active_id:line_chat_active_id});

                  await MainModel.insert("line_chat_message",
                    {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : msg,
                      message_type : 0,
                      reply_to_id : '',
                      message_detail:'',
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    }
                  );



                  const lineChatAPI = new LineChatAPI();
                  lineChatAPI.setToken(tmpChatSetting['channel_token']);
                  let tmpSend;
                  
                  if (over10Minute) 
                  {
                    console.log("push message");
                    tmpSend = await lineChatAPI.pushMessage(tmpUserId ,msg);  
                  }
                  else if(replyToken.length>0)
                  {
                    console.log("reply message");
                    tmpSend = await lineChatAPI.replyMessage(replyToken ,msg);  
                    if(tmpSend['error'])
                    {
                      console.log("reply error just push message");
                      tmpSend = await lineChatAPI.pushMessage(tmpUserId ,msg);  
                    }
                  }
                  else
                  {
                    console.log("push message");
                    tmpSend = await lineChatAPI.pushMessage(tmpUserId ,msg);  
                  }
                  
                  if (tmpSend['error']) 
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }                    

                    let tmpLineData2 = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,false);
                    let tmpReturnData = tmpLineData2;

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['error'],
                            auth : true,                          
                            data : tmpReturnData,
                        }
                    );
                    return;
                  }
                  else if(tmpSend['message'])
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['message'],
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else
                  {

                  }            
                  
                  const wsMessage = {
                    wstype : 'send_message',
                    bot_id : tmpChatSetting['id'],
                    bot_user_id : bot_user_id,
                    chat_with_user_id : tmpUserId,       
                    send_by : userid,
                    message_content : {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : msg,
                      message_type : 0,
                      reply_to_id : '',
                      message_detail: '',
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    },
                  };

                  let tmpLineData = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,false);                  
                  let tmpReturnData = tmpLineData;
                  //let tmpReturnData = [];
                  
                  res.status(200).json(
                      { 
                          wsMessage:wsMessage,
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.sendStickerToUserId = async function(req, res) {

  try {
      console.log('sendStickerToUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  let packageId = req.body.packageId?req.body.packageId:'';
                  let stickerId = req.body.stickerId?req.body.stickerId:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (stickerId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid stickerId',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }
                  
                  
                  let over10Minute = true;
                  let replyToken = "";
                  let line_chat_active_id=0;

                  let checkDupActiveChat = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by last_chattime desc `);
                  if (checkDupActiveChat.length>0) 
                  {

                    replyToken = checkDupActiveChat[0]['reply_token']?checkDupActiveChat[0]['reply_token']:'';
                    
                    let diffMilliseconds = cTime - new Date(checkDupActiveChat[0]['last_chattime']);
                    let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

                    if (diffMinutes>10) 
                    {
                      await MainModel.update("line_chat_active",
                        {            
                          close_by : 'SYSTEM',
                          active: 0,
                        },
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                        }
                      );

                      //Close chat active and Insert New Chat active
                      await MainModel.insert("line_chat_active",
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                          chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),        
                          reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),  
                          active: 1,
                          reply_by : userid,
                        }
                      );
                      
                      let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                      line_chat_active_id = getLastId[0]['id'];
                    }
                    else
                    {
                        over10Minute = false;
                        line_chat_active_id = checkDupActiveChat[0]['id'];

                        if (checkDupActiveChat[0]['reply_by']==null || checkDupActiveChat[0]['reply_by']=='') 
                        {
                            //Update  
                            MainModel.update("line_chat_active",
                              {            
                                last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                                active: 1,
                                reply_by : userid,
                              },
                              {
                                id: line_chat_active_id,
                              }
                            );
                        }
                        else
                        {
                          //Update  
                          MainModel.update("line_chat_active",
                            {            
                              last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                              active: 1,
                            },
                            {
                              id : line_chat_active_id,                              
                            }
                          );
                        }

                    }

                    

                    
                  }
                  else
                  {
                    await MainModel.insert("line_chat_active",
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id : tmpUserId,
                        chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        active: 1,
                      }
                    );

                    let getLastActiveId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                    line_chat_active_id = getLastActiveId[0]['id'];
                  }

                  await MainModel.update("line_chat_message",{is_read:1},{line_chat_active_id:line_chat_active_id});

                  let message_detail =                   
                    {
                      "type":"sticker",
                      "stickerId":stickerId.toString(),
                      "packageId":packageId.toString(),                    
                    };

                  await MainModel.insert("line_chat_message",
                    {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : '',
                      message_type : 1,
                      reply_to_id : '',
                      message_detail: JSON.stringify(message_detail),
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    }
                  );

                  const lineChatAPI = new LineChatAPI();
                  lineChatAPI.setToken(tmpChatSetting['channel_token']);
                  let tmpSend;
                  
                  if (over10Minute) 
                  {
                    console.log("push sticker");
                    tmpSend = await lineChatAPI.pushSticker(tmpUserId ,packageId,stickerId);  
                  }
                  // else if(replyToken.length>0)
                  // {
                  //   console.log("reply message");
                  //   tmpSend = await lineChatAPI.replyMessage(replyToken ,msg);  
                  // }
                  else
                  {
                    console.log("push sticker");
                    tmpSend = await lineChatAPI.pushSticker(tmpUserId ,packageId,stickerId);  
                  }
                  
                  if (tmpSend['error']) 
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }                    

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['error'],
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else if(tmpSend['message'])
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['message'],
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else
                  {

                  }                  

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }

                  const wsMessage = {
                    wstype : 'send_message',
                    bot_id : tmpChatSetting['id'],
                    bot_user_id : bot_user_id,
                    chat_with_user_id : tmpUserId,       
                    send_by : userid,
                    message_content : {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : '',
                      message_type : 1,
                      reply_to_id : '',
                      message_detail: JSON.stringify(message_detail),
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    },
                  };
                  
                  let tmpLineData = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,false);
                  let tmpReturnData = tmpLineData;
                  
                  res.status(200).json(
                      { 
                          wsMessage:wsMessage,
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.sendImageToUserId = async function(req, res) {

  try {
      console.log('sendImageToUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  let originalContentUrl = req.body.originalContentUrl?req.body.originalContentUrl:'';
                  let previewImageUrl = req.body.previewImageUrl?req.body.previewImageUrl:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (originalContentUrl.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid originalContentUrl',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (previewImageUrl.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid previewImageUrl',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }
                  
                  
                  let over10Minute = true;
                  let replyToken = "";
                  let line_chat_active_id=0;

                  let checkDupActiveChat = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by last_chattime desc `);
                  if (checkDupActiveChat.length>0) 
                  {

                    replyToken = checkDupActiveChat[0]['reply_token']?checkDupActiveChat[0]['reply_token']:'';
                    
                    let diffMilliseconds = cTime - new Date(checkDupActiveChat[0]['last_chattime']);
                    let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

                    if (diffMinutes>10) 
                    {
                      await MainModel.update("line_chat_active",
                        {            
                          close_by : 'SYSTEM',
                          active: 0,
                        },
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                        }
                      );

                      //Close chat active and Insert New Chat active
                      await MainModel.insert("line_chat_active",
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                          chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          active: 1,
                          reply_by : userid,
                        }
                      );
                      
                      let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                      line_chat_active_id = getLastId[0]['id'];
                    }
                    else
                    {
                        over10Minute = false;
                        line_chat_active_id = checkDupActiveChat[0]['id'];

                        if (checkDupActiveChat[0]['reply_by']==null || checkDupActiveChat[0]['reply_by']=='') 
                        {
                            //Update  
                            MainModel.update("line_chat_active",
                              {            
                                last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                                active: 1,
                                reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                                reply_by : userid,
                              },
                              {
                                id : line_chat_active_id,                                
                              }
                            );
                        }
                        else
                        {
                          //Update  
                          MainModel.update("line_chat_active",
                            {            
                              last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                              active: 1,
                            },
                            {
                              id : line_chat_active_id,
                            }
                          );
                        }

                    }

                    
                  }
                  else
                  {
                    await MainModel.insert("line_chat_active",
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id : tmpUserId,
                        chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        active: 1,
                      }
                    );

                    let getLastActiveId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                    line_chat_active_id = getLastActiveId[0]['id'];
                  }

                  let message_detail =                   
                    {
                      "type":"image",      
                      "id":"",
                      "quoteToken":"",
                      "contentProvider":
                        {'type':'line'},
                      "content_url": originalContentUrl,
                    };

                  await MainModel.update("line_chat_message",{is_read:1},{line_chat_active_id:line_chat_active_id});

                  await MainModel.insert("line_chat_message",
                    {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : '',
                      message_type : 2,
                      reply_to_id : '',
                      message_detail: JSON.stringify(message_detail),
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    }
                  );

                  let getLastIdRow = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by id desc `);
                  let getLastId = 0;
                  if (getLastIdRow.length>0) 
                  {
                    getLastId = getLastIdRow[0]['id'];
                  }

                  const lineChatAPI = new LineChatAPI();
                  lineChatAPI.setToken(tmpChatSetting['channel_token']);
                  let tmpSend;
                  
                  if (over10Minute) 
                  {
                    console.log("push sticker");
                    tmpSend = await lineChatAPI.pushImage(tmpUserId ,originalContentUrl,previewImageUrl);  
                  }
                  // else if(replyToken.length>0)
                  // {
                  //   console.log("reply message");
                  //   tmpSend = await lineChatAPI.replyMessage(replyToken ,msg);  
                  // }
                  else
                  {
                    console.log("push sticker");
                    tmpSend = await lineChatAPI.pushImage(tmpUserId ,originalContentUrl,previewImageUrl);  
                  }
                  
                  if (tmpSend['error']) 
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }                    

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['error'],
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else if(tmpSend['message'])
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['message'],
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else
                  {

                  }                  

                  message_detail['id'] = tmpSend['sentMessages'][0]['id'];
                  message_detail['quoteToken'] = tmpSend['sentMessages'][0]['quoteToken'];
                  

                  await MainModel.update("line_chat_message",{message_detail: JSON.stringify(message_detail)},{id:getLastId});

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }

                  const wsMessage = {
                    wstype : 'send_message',
                    bot_id : tmpChatSetting['id'],
                    bot_user_id : bot_user_id,
                    chat_with_user_id : tmpUserId,       
                    send_by : userid,
                    message_content : {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : '',
                      message_type : 2,
                      reply_to_id : '',
                      message_detail: JSON.stringify(message_detail),
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    },
                  };
                  
                  let tmpLineData = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,false);
                  let tmpReturnData = tmpLineData;
                  
                  res.status(200).json(
                      { 
                          wsMessage:wsMessage,
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.sendVideoToUserId = async function(req, res) {

  try {
      console.log('sendVideoToUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  let originalContentUrl = req.body.originalContentUrl?req.body.originalContentUrl:'';
                  let previewImageUrl = req.body.previewImageUrl?req.body.previewImageUrl:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (originalContentUrl.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid originalContentUrl',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (previewImageUrl.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid previewImageUrl',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }
                  
                  
                  let over10Minute = true;
                  let replyToken = "";
                  let line_chat_active_id=0;

                  let checkDupActiveChat = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by last_chattime desc `);
                  if (checkDupActiveChat.length>0) 
                  {

                    replyToken = checkDupActiveChat[0]['reply_token']?checkDupActiveChat[0]['reply_token']:'';
                    
                    let diffMilliseconds = cTime - new Date(checkDupActiveChat[0]['last_chattime']);
                    let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

                    if (diffMinutes>10) 
                    {
                      await MainModel.update("line_chat_active",
                        {            
                          close_by : 'SYSTEM',
                          active: 0,
                        },
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                        }
                      );

                      //Close chat active and Insert New Chat active
                      await MainModel.insert("line_chat_active",
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                          chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          active: 1,
                          reply_by : userid,
                        }
                      );
                      
                      let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                      line_chat_active_id = getLastId[0]['id'];
                    }
                    else
                    {
                        over10Minute = false;
                        line_chat_active_id = checkDupActiveChat[0]['id'];

                        if (checkDupActiveChat[0]['reply_by']==null || checkDupActiveChat[0]['reply_by']=='') 
                        {
                            //Update  
                            MainModel.update("line_chat_active",
                              {            
                                last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                                active: 1,
                                reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                                reply_by : userid,
                              },
                              {
                                bot_user_id : bot_user_id,
                                chat_with_user_id : tmpUserId,
                              }
                            );
                        }
                        else
                        {
                          //Update  
                          MainModel.update("line_chat_active",
                            {            
                              last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                              active: 1,
                            },
                            {
                              id:line_chat_active_id,
                            }
                          );
                        }

                    }

                    
                  }
                  else
                  {
                    await MainModel.insert("line_chat_active",
                      {
                        bot_user_id : bot_user_id,
                        chat_with_user_id : tmpUserId,
                        chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                        active: 1,
                      }
                    );

                    let getLastActiveId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                    line_chat_active_id = getLastActiveId[0]['id'];
                  }

                  let message_detail =                   
                    {
                      "type":"image",      
                      "id":"",
                      "quoteToken":"",
                      "contentProvider":
                        {'type':'line'},
                      "content_url": originalContentUrl,
                    };

                  await MainModel.update("line_chat_message",{is_read:1},{line_chat_active_id:line_chat_active_id});

                  await MainModel.insert("line_chat_message",
                    {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : '',
                      message_type : 3,
                      reply_to_id : '',
                      message_detail: JSON.stringify(message_detail),
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    }
                  );

                  let getLastIdRow = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by id desc `);
                  let getLastId = 0;
                  if (getLastIdRow.length>0) 
                  {
                    getLastId = getLastIdRow[0]['id'];
                  }

                  const lineChatAPI = new LineChatAPI();
                  lineChatAPI.setToken(tmpChatSetting['channel_token']);
                  let tmpSend;
                  
                  if (over10Minute) 
                  {
                    console.log("push video");
                    tmpSend = await lineChatAPI.pushVideo(tmpUserId ,originalContentUrl,previewImageUrl);  
                  }
                  // else if(replyToken.length>0)
                  // {
                  //   console.log("reply message");
                  //   tmpSend = await lineChatAPI.replyMessage(replyToken ,msg);  
                  // }
                  else
                  {
                    console.log("push video");
                    tmpSend = await lineChatAPI.pushVideo(tmpUserId ,originalContentUrl,previewImageUrl);  
                  }
                  
                  if (tmpSend['error']) 
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }                    

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['error'],
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else if(tmpSend['message'])
                  {
                    let getLastId = await MainModel.query(`SELECT * FROM line_chat_message WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by message_datetime desc `);
                    if (getLastId.length>0) 
                    {
                        await MainModel.update("line_chat_message",{send_completed:0},{id:getLastId[0]['id']});  
                    }

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: tmpSend['message'],
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else
                  {

                  }                  

                  message_detail['id'] = tmpSend['sentMessages'][0]['id'];
                  message_detail['quoteToken'] = tmpSend['sentMessages'][0]['quoteToken'];
                  

                  await MainModel.update("line_chat_message",{message_detail: JSON.stringify(message_detail)},{id:getLastId});

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }

                  const wsMessage = {
                    wstype : 'send_message',
                    bot_id : tmpChatSetting['id'],
                    bot_user_id : bot_user_id,
                    chat_with_user_id : tmpUserId,       
                    send_by : userid,
                    message_content : {
                      bot_user_id : bot_user_id,
                      chat_with_user_id : tmpUserId,
                      line_chat_active_id : line_chat_active_id,
                      message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                      message : '',
                      message_type : 2,
                      reply_to_id : '',
                      message_detail: JSON.stringify(message_detail),
                      is_read :1,
                      is_deleted:0,
                      is_sending :1,
                      send_by: userid,
                    },
                  };
                  
                  let tmpLineData = await lineChatSetting.getChatWithUserId(bot_user_id,tmpUserId,isAdmin,userid,false);
                  let tmpReturnData = tmpLineData;
                  
                  res.status(200).json(
                      { 
                          wsMessage:wsMessage,
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpReturnData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.closeMessageOfUserId = async function(req, res) {

  try {
      console.log('closeMessageOfUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                                    
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }


                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }
                  
                  const lineChatAPI = new LineChatAPI();
                  lineChatAPI.setToken(tmpChatSetting['channel_token']);
                  
                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }
                    
                  let line_chat_active_id=0;

                  let checkDupActiveChat = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' order by last_chattime desc `);
                  if (checkDupActiveChat.length>0) 
                  {
                    if (isAdmin) 
                    {
                        await MainModel.update("line_chat_active",
                            {            
                              close_by : userid,
                              active: 0,
                            },
                            {
                              bot_user_id : bot_user_id,
                              chat_with_user_id : tmpUserId,                          
                            }
                        );    
                      }
                    else
                    {
                        await MainModel.update("line_chat_active",
                            {            
                              close_by : userid,
                              active: 0,
                            },
                            {
                              bot_user_id : bot_user_id,
                              chat_with_user_id : tmpUserId,
                              reply_by : userid,
                            }
                        );    
                    }
                    
                  }
                             
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getLineImageById = async function(req, res) {

  try {
      console.log('getLineImageById');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let contentId = req.body.contentId?req.body.contentId:'';
                                    
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                 
                  if (contentId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid contentId',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }
                      
                  const lineChatAPI = new LineChatAPI();
                  lineChatAPI.setToken(tmpChatSetting['channel_token']);                  
                  let tmpReturnData = {
                    data : null                    
                  };

                  let tmpSend = await lineChatAPI.getContent(contentId);
                  if (tmpSend['error']) 
                  {
                    res.status(200).json(
                      { 
                          status: 'error', 
                          message: tmpSend['error'],
                          auth : true,                          
                          data : tmpReturnData,
                      }
                    );
                    return;
                  }
                  else if (tmpSend['message']) 
                  {
                    res.status(200).json(
                      { 
                          status: 'error', 
                          message: tmpSend['message'],
                          auth : true,                          
                          data : tmpReturnData,
                      }
                    );
                    return;
                  }                  

                  // Read the image file synchronously
                  const data = fs.readFileSync(tmpSend);

                  // Encode the data to base64
                  let base64Image = Buffer.from(data).toString('base64');
                  
                  let returnURL = Secret.apiDomain+`getfile/line_${contentId}.jpg`;
                  
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : base64Image,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getLineSticker = async function(req, res) {

  try {
      console.log('getLineSticker');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.getLineSticker();
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.changeAliasUserId = async function(req, res) {

  try {
      console.log('changeAliasUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  let aliasUserId = req.body.aliasUserId?req.body.aliasUserId:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }
                  
                  let updateData = await MainModel.update("line_contact",{alias_userid :aliasUserId},{bot_user_id :bot_user_id,user_id : tmpUserId});
                  if (updateData) 
                  {
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Update Failed',
                          auth : false,
                          data : [],
                      }
                    );
                  }
                
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.getChatTag = async function(req, res) {

  try {
      console.log('getChatTag');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.getChatTag();
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.updateContactProfile = async function(req, res) {

  try {
      console.log('updateContactProfile');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  let note = req.body.note?req.body.note:'';                  
                  let tag = req.body.tag?req.body.tag:'';                  
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                
                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }
                  
                  let updateData = await MainModel.update("line_contact",
                    {
                      note : note,
                      note_by : userid,
                      tag : tag,
                    },                  
                    {bot_user_id :bot_user_id,user_id : tmpUserId},
                  );
                  if (updateData) 
                  {
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                          
                            data : [],
                        }
                    );
                    return;
                  }
                  else
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Update Failed',
                          auth : false,
                          data : [],
                      }
                    );
                  }
                
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.verifySlip = async function(req, res) {

  try {
      console.log('verifySlip');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let barCode = req.body.barCode?req.body.barCode:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (barCode.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid barCode',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  if (barCode!='') {
                    const checkExistQR  = MainModel.query("SELECT * FROM scan_slip WHERE barcode='"+barCode+"'");                                
                    if (checkExistQR.length>0) 
                    {
                        if (checkExistQR[0]['deposited_credit']==1) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'This slip has been used before.',
                                    auth : true,
                                    data : checkExistQR[0],
                                }
                            );
                            return;
                        }                         
                        else
                        {
                          res.status(202).json(
                              { 
                                  status: 'error', 
                                  message: 'This slip used to scan.',
                                  auth : true,
                                  data : checkExistQR[0],
                              }
                          );
                          return;
                        }
                        
                    }
                    else
                    {
                        
                        MainModel.insert("scan_slip",
                            {
                                userid : "-",
                                filename : "-",
                                upload_time : timerHelper.convertDatetimeToString(cTime),
                                barcode : barCode,
                                canceled : 0,
                            }
                        );                                    
                    }

                    let admin_banks_data = MainModel.query(`
                    select *
                    from admin_bank
                    where status = 1 and bank_id in (5) and (bank_type = 'WITHDRAW' or bank_type = 'BOTH' ) and (work_type = 'NODE' or work_type = 'IBK')
                        `);
                    
                    if (admin_banks_data.length>0) 
                    {
                        let admin_banks = admin_banks_data[0];
                        let tmpMeta = JSON.parse(admin_banks['meta_data']);
                        admin_banks['meta_data']= tmpMeta;
                        for (const [key,value] of Object.entries(tmpMeta))
                        {
                            admin_banks[key] = value;
                        }

                        let admin_info = admin_banks;
                                                                
                        //Bank Account                                                                        
                        if (admin_info) 
                        {                                            
                            if(admin_info['bank_id']==5)
                            {                                            
                                const scb_app_lib = new Scb_app_lib();
                                let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                let token = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                    
                                let resp = [];
                                let data = [];
                                let i = 0;

                                let loginPass = false;
                                if (token=='') 
                                {
                                  resp['status'] = '';
                                }
                                else
                                {
                                  resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);                                  
                                }
                                
                                if (resp['status']!=null && resp['status']!='error') 
                                {
                                    if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                    {          
                                        admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                        SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);        
                                        console.log(admin_info['bank_acc_number'] + "Read Slip Login : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                        loginPass = true;
                                    }
                                    else
                                    {
                                        console.log("Read Slip New Login");                                        
                                        token = "";										

                                        let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                        let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
                                            
                                        token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);

                                        scbtoken = token;
                                        
                                        if (token) 
                                        {                                            
                                            admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);                                            
                                            resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);                                            
                                            if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                            {
                                                admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                            }                                            
                                            SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);                                            
                                            console.log(admin_info['bank_acc_number'] + " : Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");    
                                            
                                            loginPass = true;
                                        }
                                        else
                                        {                                            
                                            console.log('Login Failed '+ admin_info['bank_acc_number']);                                                        
                                        }
                                    }
                                }
                                else
                                {                                    
                                    console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);                                               
                                }

                                console.log("Login Pass : ",loginPass);

                                if (loginPass) 
                                {
                                    let response = await scb_app_lib.CheckSlip(scbtoken,barCode);    
                                    console.log(response);
                                    if(response['status']['code'] == 1000)
                                    {  
                                        let credit = response['data']['amount'];
                                        let slipTime = response['data']['pullSlip']['dateTime']?new Date(response['data']['pullSlip']['dateTime']):new Date();
                                        let transRef = response['data']['pullSlip']['transRef']?response['data']['pullSlip']['transRef']:"";
                                        let sender = response['data']['pullSlip']['sender'];
                                        let receiver = response['data']['pullSlip']['receiver'];            
                                                                                

                                        if (typeof credit=='number') 
                                        {
                                            
                                            let slipData =  {
                                                    credit : credit,
                                                    sliptime : timerHelper.convertDatetimeToString(slipTime),
                                                    deposited_credit: credit, 
                                                    transRef : transRef,
                                                    from_acc : sender['accountNumber'],
                                                    from_name : sender['name'],
                                                    to_acc : receiver['accountNumber'],
                                                    to_name : receiver['name'],       
                                                    remark : '',
                                                    canceled : 0,
                                                };

                                            let slip_from_acc = '';
                                            const match = sender['accountNumber'].slice(-6).replaceAll("-","").replaceAll("x","");
                                            // Check if a match is found
                                            if (match) {
                                                slip_from_acc = match;                                                        
                                            } 

                                            let slip_to_acc = '';
                                            const match2 = receiver['accountNumber'].slice(-6).replaceAll("-","").replaceAll("x","");
                                            // Check if a match is found
                                            if (match2) {
                                                slip_to_acc = match2;                                                        
                                            } 

                                            let row_transfer = {
                                                credit : credit,
                                                datetime : slipTime,
                                                bankdesc : 'slip',
                                                acc : slip_from_acc,
                                                bank_name : '',
                                            };

                                            if (slip_from_acc=="") 
                                            {
                                                slipData['canceled'] = 1;
                                                slipData['remark'] = "Slip cannot read sender account.";

                                                MainModel.update("scan_slip",
                                                    slipData
                                                    ,
                                                    {
                                                        barcode : barCode                                                        
                                                    }
                                                );

                                                res.status(202).json(
                                                    { 
                                                        status: 'error', 
                                                        message: 'Slip cannot read sender account.',
                                                        auth : false,
                                                        data : slipData,
                                                    }
                                                );
                                                return;                                                            
                                            }

                                            let row_bank =  MainModel.query(`
                                                    select *
                                                    from bank_verify
                                                    where status = 1  and (bank_acc_number like '%${slip_to_acc}%' AND line_setting_id=${tmpId})
                                              `);
                                           

                                            if (row_bank.length == 0)
                                            { 
                                                slipData['canceled'] = 1;
                                                slipData['remark'] = "Slip not found receiver account.";
                                                MainModel.update("scan_slip",
                                                    slipData
                                                    ,
                                                    {
                                                        barcode : barCode                                                      
                                                    }
                                                );

                                                res.status(202).json(
                                                    { 
                                                        status: 'error', 
                                                        message: 'Slip not found receiver account.',
                                                        auth : true,
                                                        data : slipData,
                                                    }
                                                );
                                                return;
                                            }
                                            

                                            MainModel.update("scan_slip",
                                                        slipData
                                                        ,
                                                        {
                                                            barcode : barCode
                                                        }
                                                    );

                                            res.status(200).json(
                                                { 
                                                    status: 'success', 
                                                    message: '',
                                                    auth : true,
                                                    data : slipData,
                                                }
                                            );
                                            return; 
                                            
                                        }
                                        else
                                        {
                                          
                                            MainModel.update("scan_slip",
                                                {
                                                    canceled : 1,                                                                                     
                                                    remark : "Slip cannot read amount."
                                                }
                                                ,
                                                {
                                                    barcode : barCode                                                    
                                                }
                                            );

                                            res.status(202).json(
                                                { 
                                                    status: 'error', 
                                                    message: 'Slip cannot read amount.',
                                                    auth : true,
                                                    data : [],
                                                }
                                            );
                                            return;
                                        }                                                    
                                    }     
                                    else
                                    {
                                      MainModel.update("scan_slip",
                                                {
                                                    canceled : 1,                                                                                     
                                                    remark : response['status']['description'],
                                                }
                                                ,
                                                {
                                                    barcode : barCode                                                    
                                                }
                                            );

                                      res.status(202).json(
                                        { 
                                            status: 'error', 
                                            message: response['status']['description'],
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                    }                                       
                                }
                                else
                                {
                                    res.status(202).json(
                                        { 
                                            status: 'error', 
                                            message: 'Slip is some problem.',
                                            auth : false,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                                
                            }                                               
                            else
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Not found bank for service',
                                        auth : false,
                                        data : [],
                                    }
                                );
                                return;
                            }
                        }
                    }
                    else
                    {
                      res.status(202).json(
                        { 
                            status: 'error', 
                            message: 'Service is not available',
                            auth : true,
                            data : [],
                        }
                    );
                    return;
                    }



                }
                else
                {
                    res.status(202).json(
                        { 
                            status: 'error', 
                            message: 'Cannot read slip',
                            auth : false,
                            data : [],
                        }
                    );
                    return;
                }

                  
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : '',
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.checkIn = async function(req, res) {

  try {
      console.log('checkIn');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await MainModel.insert("line_shift",{time_in: timerHelper.convertDatetimeToStringNoT(cTime) , user_id: userid });
                  if (tmpLineData) 
                  {
                    res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData,
                      }
                    );
                    return;
                  }
                  else
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Cannot update data',
                          auth : true,
                          data : [],
                      }
                    );
                  }
                 
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                    );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.checkOut = async function(req, res) {

  try {
      console.log('checkOut');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpData = MainModel.query("SELECT * FROM line_shift WHERE user_id='"+userid+"' AND time_out is null");
                  
                  if (tmpData.length>0) 
                  {
                    let tmpLineData = await MainModel.update("line_shift",{time_out: timerHelper.convertDatetimeToStringNoT(cTime) },{user_id: userid}," AND time_out is NULL");
                    if (tmpLineData) 
                    {
                      res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                          
                            data : tmpLineData,
                        }
                      );
                      return;
                    }
                    else
                    {
                      res.status(202).json(
                        { 
                            status: 'error', 
                            message: 'Cannot update data',
                            auth : true,
                            data : [],
                        }
                      );
                    }
                  }
                  else
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'not found check in data',
                          auth : true,
                          data : [],
                      }
                    );
                  }

              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                    );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.getCheckInList = async function(req, res) {

  try {
      console.log('getCheckInList');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpAdmin = AdminList.findById(userid);

                  if (tmpAdmin.length<=0) 
                  {
                      res.status(202).json(
                        { 
                            status: 'error', 
                            message: 'Authenication Failed',
                            auth : false,
                            data : [],
                        }
                      );
                  }

                  let start = new Date(req.body.dateFrom);
                  let end = new Date(req.body.dateTo);

                  if (tmpAdmin['am_rank']==4) 
                  {
                    let tmpLineData = await MainModel.query("SELECT * FROM line_shift WHERE time_in>='"+ timerHelper.convertDateToString(start) +"' AND time_in<='"+timerHelper.convertDateToString(end)+"' ORDER BY time_in ");
                    res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData,
                      }
                    );
                    return;
                  }
                  else
                  {
                    let tmpLineData = await MainModel.query("SELECT * FROM line_shift WHERE time_in>='"+ timerHelper.convertDateToString(start) +"' AND time_in<='"+timerHelper.convertDateToString(end)+"' AND user_id='"+userid +"' ORDER BY time_in ");
                    res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData,
                      }
                    );
                    return;
                  }

              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                    );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.getQuickMessage = async function(req, res) {

  try {
      console.log('getQuickMessage');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpbotId = req.body.botId?parseInt(req.body.botId):0;
                  
                  let tmpLineData = await lineChatSetting.getQuickMessage(tmpbotId);
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.insertQuickMessage = async function(req, res) {

  try {
      console.log('insertQuickMessage');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.insertQuickMessage(req.body);
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.updateQuickMessage = async function(req, res) {

  try {
      console.log('updateQuickMessage');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.updateQuickMessage(req.body);
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.deleteQuickMessageById = async function(req, res) {
    
  try {
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);    
      
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
      }
      else
      {
          const headers = req.headers;
  
          console.log("deletePromotionById")
           //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  // console.log('updateadminbankbyid');
                  //console.log(req.body);            
                  let tmpData = lineChatSetting.deleteQuickMessageById(req.body);
  
                  if (tmpData['affectedRows']) 
                  {
                      res.status(200).json(
                          { 
                              status: 'success', 
                              message: '',
                              auth : true,
                          }
                          );
                  }
                  else
                  { 
                      res.status(202).json(
                      { 
                          status: 'error', 
                          message: tmpData.message,
                          auth : false,
                          data : [],
                      }
                      );
                  }
                  
                  
              }
              else
              {
                  res.status(200).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }

};

exports.insertLineSticker = async function(req, res) {

  try {
      console.log('insertLineSticker');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.insertLineSticker(req.body);
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.updateLineSticker = async function(req, res) {

  try {
      console.log('updateLineSticker');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.updateLineSticker(req.body);
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.deleteLineStickerById = async function(req, res) {
    
  try {
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);    
      
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
      }
      else
      {
          const headers = req.headers;
  
          console.log("deletePromotionById")
           //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  // console.log('updateadminbankbyid');
                  console.log(req.body);            
                  let tmpData = lineChatSetting.deleteLineStickerById(req.body);
  
                  if (tmpData['affectedRows']) 
                  {
                      res.status(200).json(
                          { 
                              status: 'success', 
                              message: '',
                              auth : true,
                          }
                          );
                  }
                  else
                  { 
                      res.status(202).json(
                      { 
                          status: 'error', 
                          message: tmpData.message,
                          auth : false,
                          data : [],
                      }
                      );
                  }
                  
                  
              }
              else
              {
                  res.status(200).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }

};

exports.getBankVerify = async function(req, res) {

  try {
      console.log('getBankVerify');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.getBankVerify();
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : tmpLineData,
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.insertBankVerify = async function(req, res) {

  try {
      console.log('insertBankVerify');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.insertBankVerify(req.body);
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.updateBankVerify = async function(req, res) {

  try {
      console.log('updateBankVerify');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);        
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpLineData = await lineChatSetting.updateBankVerify(req.body);
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }


  
};

exports.deleteBankVerifyById = async function(req, res) {
    
  try {
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
      // const ipAddress = req.socket.remoteAddress;
      // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
      // const ipAllowList = IpAllowList.findById(ipAddress);    
      
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
      }
      else
      {
          const headers = req.headers;
  
          console.log("deletePromotionById")
           //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  // console.log('updateadminbankbyid');
                  console.log(req.body);            
                  let tmpData = lineChatSetting.deleteBankVerifyById(req.body);
  
                  if (tmpData['affectedRows']) 
                  {
                      res.status(200).json(
                          { 
                              status: 'success', 
                              message: '',
                              auth : true,
                          }
                          );
                  }
                  else
                  { 
                      res.status(202).json(
                      { 
                          status: 'error', 
                          message: tmpData.message,
                          auth : false,
                          data : [],
                      }
                      );
                  }
                  
                  
              }
              else
              {
                  res.status(200).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }

};

exports.checkAndOpenChatByUserId = async function(req, res) {

  try {
      console.log('checkAndOpenChatByUserId');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
  
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                  let tmpUserId = req.body.user_id?req.body.user_id:'';
                  
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  if (tmpUserId.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid user_id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }

                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }

                  let line_chat_active_id=0;
                  
                  let getLastActiveId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);                  
                  if (getLastActiveId.length>0) 
                  {                    
                    let diffMilliseconds = cTime - new Date(getLastActiveId[0]['last_chattime']);
                    let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

                    if (diffMinutes>10) 
                    {
                     
                      await MainModel.update("line_chat_active",
                        {            
                          close_by : 'SYSTEM',
                          active: 0,
                        },
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                        }
                      );

                      //Close chat active and Insert New Chat active
                      await MainModel.insert("line_chat_active",
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                          chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                          active: 1,
                          reply_by : userid,
                        }
                      );
                      
                      let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                      line_chat_active_id = getLastId[0]['id'];

                      if (line_chat_active_id!=0) 
                      {
                        await MainModel.insert("line_chat_message",
                        {
                            bot_user_id : bot_user_id,
                            chat_with_user_id : tmpUserId,
                            line_chat_active_id : line_chat_active_id,
                            message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                            message : "Open Chat History",
                            message_type : 0,
                            reply_to_id : '',
                            message_detail:'',
                            is_read :1,
                            is_deleted:0,
                            is_sending :1,
                            send_by: userid,
                          }
                        );
                      }
                      
                    }
                    else
                    {            
                      
                        line_chat_active_id = getLastActiveId[0]['id'];

                        //Update  
                        MainModel.update("line_chat_active",
                          {            
                            last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                            active: 1,
                          },
                          {
                            id : line_chat_active_id,                            
                          }
                        );

                        if (line_chat_active_id!=0) 
                        {
                          await MainModel.insert("line_chat_message",
                          {
                              bot_user_id : bot_user_id,
                              chat_with_user_id : tmpUserId,
                              line_chat_active_id : line_chat_active_id,
                              message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                              message : "Open Chat History",
                              message_type : 0,
                              reply_to_id : '',
                              message_detail:'',
                              is_read :1,
                              is_deleted:0,
                              is_sending :1,
                              send_by: userid,
                            }
                          );
                        }
                    }

                  }
                  else
                  {
                      
                      await MainModel.insert("line_chat_active",
                        {
                          bot_user_id : bot_user_id,
                          chat_with_user_id : tmpUserId,
                          chat_datetime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          last_chattime : timerHelper.convertDatetimeToStringNoT(cTime),          
                          reply_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                          active: 1,
                          reply_by : userid,
                        }
                      );

                      let getLastId = await MainModel.query(`SELECT * FROM line_chat_active WHERE bot_user_id='${bot_user_id}' and chat_with_user_id='${tmpUserId}' and active=1 order by last_chattime desc `);
                      line_chat_active_id = getLastId[0]['id'];

                      if (line_chat_active_id!=0) 
                      {
                        await MainModel.insert("line_chat_message",
                        {
                            bot_user_id : bot_user_id,
                            chat_with_user_id : tmpUserId,
                            line_chat_active_id : line_chat_active_id,
                            message_datetime : timerHelper.convertDatetimeToStringNoT(cTime),
                            message : "Open Chat History",
                            message_type : 0,
                            reply_to_id : '',
                            message_detail:'',
                            is_read :1,
                            is_deleted:0,
                            is_sending :1,
                            send_by: userid,
                          }
                        );
                      }
                  }

                  
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
                    return;
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};

exports.readAll = async function(req, res) {

  try {
      console.log('readAll');
  
      const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
  
      const ipBlockList = IpAllowList.findBlockedById(ipAddress);        
      if (ipBlockList.length>0)
      {
          res.status(202).send('Unauthorize ip. ('+ipAddress+')');
          return;
      }
      else
      {
          const headers = req.headers;
  
          //handles null error
          if (headers.userid.length === 0 || headers.token.length === 0) {
              res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
              return;
          } else {
  
              // console.log(req.body.userid);
              // console.log(req.body.token);
  
              const userid = headers.userid;
              const token = headers.token;
  
              let IsAuth = AdminList.isAuthenicated(userid,token);
              // let IsAuth = true;
  
              if (IsAuth) 
              {
                  let cTime = new Date();
                  cTime = new Date(cTime.getTime() + (offsetTime));

                  let tmpId = req.body.id?parseInt(req.body.id):0;
                                    
                  if (tmpId==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Invalid id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  
                  let tmpChatSetting = await lineChatSetting.findByID(tmpId);                  
                  let bot_user_id='';
                  if (tmpChatSetting.length==0) 
                  {
                    res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Not found this bot id',
                          auth : false,
                          data : [],
                      }
                    );
                    return;
                  }
                  else
                  {
                    bot_user_id = tmpChatSetting['user_id'];                    
                  }

                  let adminData = await AdminList.findById(userid);
                  let isAdmin = false;

                  if (adminData['am_rank']==4) 
                  {
                    isAdmin = true;  
                  }

                  let line_chat_active_id=0;

                  MainModel.update("line_chat_message",{is_read:1},{bot_user_id:bot_user_id});
                  
                  res.status(200).json(
                      { 
                          status: 'success', 
                          message: '',
                          auth : true,                          
                          data : [],
                      }
                  );
                  return;
              }
              else
              {
                  res.status(202).json(
                      { 
                          status: 'error', 
                          message: 'Authenication Failed',
                          auth : false,
                          data : [],
                      }
                      );
                    return;
              }
          
          }
      }
  } catch (error) {
      res.status(202).json(
          { 
              status: 'error', 
              message: error.message,
              auth : false,
              data : [],
          }
      );
  }
  
};