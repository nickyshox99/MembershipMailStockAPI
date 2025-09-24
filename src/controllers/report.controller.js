'use strict';
const jwt = require('jsonwebtoken');
const ReportList = require('../models/reportlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const LoanList = require('../models/loanlist.model');
const ProductList = require('../models/productlist.model');

const AdminSetting = require('../models/adminsetting.model');

const Secret = require('../../config/secret');

const timerHelper = require('../modules/timehelper');

var crypto = require('crypto'); 

var session = require('express-session');
const { offsetTime } = require('../../config/offsettime');

exports.default = async function(req, res) {

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
            res.send('report api');
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

// exports.getReportSMS = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportSMS(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getReportDeposit = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportDeposit(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getReportWithdraw = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportWithdraw(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getReportRefund = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportRefund(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getLastBonusTransaction = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getLastBonusTransaction(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getReportBetlog = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportBetlog(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };


// exports.getReportTransferOut = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;

        
//                 if (IsAuth) 
//                 {
//                     let start = new Date(req.body.dateFrom);
//                     let end = new Date(req.body.dateTo);

//                     let tmpData = ReportList.getReportTransferOut(req.body);

//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getReportAff = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportAff(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getReportAffDeposit = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportAffDeposit(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };


// exports.getReportSummaryMember = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getReportSummaryMember(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getDashboardData = async function(req, res) {
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//             // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;

//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else {

//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);

//                 const userid = headers.userid;
//                 const token = headers.token;

//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;

//                 if (IsAuth) 
//                 {
//                     // Step 1: Get the current date
//                     let now = new Date();                  
//                     now = new Date(now.getTime() + (offsetTime));   

//                     let now2 = new Date();                  
//                     now2 = new Date(now.getTime() + (offsetTime));   

//                     const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//                     const lastDayOfMonth = new Date(now2.getFullYear(), now2.getMonth() + 1, 0);
                    
//                     let tmpFromDate = firstDayOfMonth;
//                     tmpFromDate.setHours(0,0,0,0);
//                     let tmpToDate = lastDayOfMonth;
//                     tmpToDate.setDate(tmpToDate.getDate() + 1);
//                     tmpToDate.setHours(0,0,0,0);

//                     let tmpCurrentDate = new Date(); 
//                     tmpCurrentDate = new Date(tmpCurrentDate.getTime() + (offsetTime));  
//                     tmpCurrentDate.setHours(0,0,0,0);  
                                     
                    
//                     let tmpNextDate = new Date();
//                     tmpNextDate = new Date(tmpNextDate.getTime() + (offsetTime));  
//                     tmpNextDate.setDate(tmpNextDate.getDate() + 1);
//                     tmpNextDate.setHours(0,0,0,0);
                    
//                     const dayOfWeek = now.getDay();
//                     const daysUntilSunday = dayOfWeek;
//                     const daysUntilSaturday = 6 - dayOfWeek;

//                     let now3 = new Date();                  
//                     now3 = new Date(now.getTime() + (offsetTime));   
//                     let now4 = new Date();                  
//                     now4 = new Date(now.getTime() + (offsetTime));   

//                     const firstDayOfWeek = new Date(now3.getFullYear(), now3.getMonth(), now3.getDate() - daysUntilSunday);
//                     let lastDayOfWeek = new Date(now4.getFullYear(), now4.getMonth(), now4.getDate() + daysUntilSaturday);
//                     lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 1);
//                     lastDayOfWeek.setHours(0,0,0,0);
                    
//                     let inputData = {
//                         searchWord:'',
//                         dateFrom:tmpFromDate,
//                         dateTo:tmpToDate,
//                     }

//                     let inputData2 = {
//                         searchWord:'',
//                         dateFrom:tmpCurrentDate,
//                         dateTo:tmpNextDate,
//                     }

//                     let inputData3 = {
//                         searchWord:'',
//                         dateFrom:firstDayOfWeek,
//                         dateTo:lastDayOfWeek,
//                     }

//                     let inputDataList = [];

//                     let dateIndex = new Date();
//                     dateIndex = new Date(dateIndex.getTime() + (offsetTime));
//                     dateIndex.setDate(dateIndex.getDate() - 6);
//                     dateIndex.setHours(0,0,0,0);

//                     for (let index = 0; index < 7; index++) {

//                         let indexDate = new Date(dateIndex);
//                         indexDate.setDate(dateIndex.getDate()+index);
//                         let indexEndDate = new Date(dateIndex);
//                         indexEndDate.setDate(dateIndex.getDate()+index+1);

//                         inputDataList.push(
//                             {
//                                 searchWord:'',
//                                 dateFrom:indexDate,
//                                 dateTo:indexEndDate,
//                             }
//                         );
//                     }
                    
//                     Promise.all([
//                         MemberList.getCountMember(),
//                         MemberList.getCountNewMember(inputData),
//                         MemberList.getCountNewMember(inputData2),
//                         MemberList.getCountNewMember(inputData3),
//                         ReportList.getReportSumDeposit(inputData),
//                         ReportList.getReportSumWithdraw(inputData),
//                         ReportList.getReportSumRefund(inputData),
//                         ReportList.getReportSumBonus(inputData),
//                         ReportList.getReportSumDeposit(inputData2),
//                         ReportList.getReportSumWithdraw(inputData2),
//                         ReportList.getReportSumRefund(inputData2),
//                         ReportList.getReportSumBonus(inputData2),
//                         ReportList.getReportSumDeposit(inputData3),
//                         ReportList.getReportSumWithdraw(inputData3),
//                         ReportList.getReportSumRefund(inputData3),
//                         ReportList.getReportSumBonus(inputData3),

//                         ReportList.getReportSumDeposit(inputDataList[0]),
//                         ReportList.getReportSumWithdraw(inputDataList[0]),
//                         MemberList.getCountNewMember(inputDataList[0]),

//                         ReportList.getReportSumDeposit(inputDataList[1]),
//                         ReportList.getReportSumWithdraw(inputDataList[1]),
//                         MemberList.getCountNewMember(inputDataList[1]),

//                         ReportList.getReportSumDeposit(inputDataList[2]),
//                         ReportList.getReportSumWithdraw(inputDataList[2]),
//                         MemberList.getCountNewMember(inputDataList[2]),

//                         ReportList.getReportSumDeposit(inputDataList[3]),
//                         ReportList.getReportSumWithdraw(inputDataList[3]),
//                         MemberList.getCountNewMember(inputDataList[3]),

//                         ReportList.getReportSumDeposit(inputDataList[4]),
//                         ReportList.getReportSumWithdraw(inputDataList[4]),
//                         MemberList.getCountNewMember(inputDataList[4]),

//                         ReportList.getReportSumDeposit(inputDataList[5]),
//                         ReportList.getReportSumWithdraw(inputDataList[5]),
//                         MemberList.getCountNewMember(inputDataList[5]),

//                         ReportList.getReportSumDeposit(inputDataList[6]),
//                         ReportList.getReportSumWithdraw(inputDataList[6]),
//                         MemberList.getCountNewMember(inputDataList[6]),

//                       ]).then(([countMem, countNewMem, countNewMemberDay, countNewMemberWeek
//                         ,reportDep, reportWit, reportRef, reportBonus
//                         ,reportDepDay, reportWitDay, reportRefDay, reportBonusDay 
//                         ,reportDepWeek, reportWitWeek, reportRefWeek, reportBonusWeek
//                         ,reportDepDay1,reportWitDay1,reportCountNewMemberDay1
//                         ,reportDepDay2,reportWitDay2,reportCountNewMemberDay2
//                         ,reportDepDay3,reportWitDay3,reportCountNewMemberDay3
//                         ,reportDepDay4,reportWitDay4,reportCountNewMemberDay4
//                         ,reportDepDay5,reportWitDay5,reportCountNewMemberDay5
//                         ,reportDepDay6,reportWitDay6,reportCountNewMemberDay6
//                         ,reportDepDay7,reportWitDay7,reportCountNewMemberDay7
//                         ]) => {

//                         const seriesDeposit = [
//                             reportDepDay1[0]['credit']?reportDepDay1[0]['credit']:0,
//                             reportDepDay2[0]['credit']?reportDepDay2[0]['credit']:0,
//                             reportDepDay3[0]['credit']?reportDepDay3[0]['credit']:0,
//                             reportDepDay4[0]['credit']?reportDepDay4[0]['credit']:0,
//                             reportDepDay5[0]['credit']?reportDepDay5[0]['credit']:0,
//                             reportDepDay6[0]['credit']?reportDepDay6[0]['credit']:0,
//                             reportDepDay7[0]['credit']?reportDepDay7[0]['credit']:0,
//                         ];
//                         const seriesWithdraw = [
//                             reportWitDay1[0]['credit']?reportWitDay1[0]['credit']:0.0,
//                             reportWitDay2[0]['credit']?reportWitDay2[0]['credit']:0.0,
//                             reportWitDay3[0]['credit']?reportWitDay3[0]['credit']:0.0,
//                             reportWitDay4[0]['credit']?reportWitDay4[0]['credit']:0.0,
//                             reportWitDay5[0]['credit']?reportWitDay5[0]['credit']:0.0,
//                             reportWitDay6[0]['credit']?reportWitDay6[0]['credit']:0.0,
//                             reportWitDay7[0]['credit']?reportWitDay7[0]['credit']:0.0,
//                         ];

//                         const seriesCountNewMember = [
//                             reportCountNewMemberDay1[0]['C']?reportCountNewMemberDay1[0]['C']:0,
//                             reportCountNewMemberDay2[0]['C']?reportCountNewMemberDay2[0]['C']:0,
//                             reportCountNewMemberDay3[0]['C']?reportCountNewMemberDay3[0]['C']:0,
//                             reportCountNewMemberDay4[0]['C']?reportCountNewMemberDay4[0]['C']:0,
//                             reportCountNewMemberDay5[0]['C']?reportCountNewMemberDay5[0]['C']:0,
//                             reportCountNewMemberDay6[0]['C']?reportCountNewMemberDay6[0]['C']:0,
//                             reportCountNewMemberDay7[0]['C']?reportCountNewMemberDay7[0]['C']:0,
//                         ];
                        
//                         let tmpData = {
//                             countMember : countMem[0]['C']?countMem[0]['C']:0.0,
//                             countNewMember : countNewMem[0]['C']?countNewMem[0]['C']:0.0,
//                             countNewMemberDay : countNewMemberDay[0]['C']?countNewMemberDay[0]['C']:0.0,
//                             countNewMemberWeek : countNewMemberWeek[0]['C']?countNewMemberWeek[0]['C']:0.0,

//                             sumDeposit : reportDep[0]['credit']?reportDep[0]['credit']:0.0,
//                             countDeposit : reportDep[0]['counts']?reportDep[0]['counts']:0.0,
//                             sumWithdraw : reportWit[0]['credit']?reportWit[0]['credit']:0.0,
//                             countWithdraw : reportWit[0]['counts']?reportWit[0]['counts']:0.0,
//                             sumRefund : reportRef[0]['credit']?reportRef[0]['credit']:0.0,
//                             countRefund : reportRef[0]['counts']?reportRef[0]['counts']:0.0,
//                             sumBonus : reportBonus[0]['credit']?reportBonus[0]['credit']:0.0,
//                             countBonus : reportBonus[0]['counts']?reportBonus[0]['counts']:0.0,          
                            
//                             sumDepositDay : reportDepDay[0]['credit']?reportDepDay[0]['credit']:0.0,
//                             countDepositDay : reportDepDay[0]['counts']?reportDepDay[0]['counts']:0.0,
//                             sumWithdrawDay : reportWitDay[0]['credit']?reportWitDay[0]['credit']:0.0,
//                             countWithdrawDay : reportWitDay[0]['counts']?reportWitDay[0]['counts']:0.0,
//                             sumRefundDay : reportRefDay[0]['credit']?reportRefDay[0]['credit']:0.0,
//                             countRefundDay : reportRefDay[0]['counts']?reportRefDay[0]['counts']:0.0,
//                             sumBonusDay : reportBonusDay[0]['credit']?reportBonusDay[0]['credit']:0.0,
//                             countBonusDay : reportBonusDay[0]['counts']?reportBonusDay[0]['counts']:0.0,    

//                             sumDepositWeek : reportDepWeek[0]['credit']?reportDepWeek[0]['credit']:0.0,
//                             countDepositWeek : reportDepWeek[0]['counts']?reportDepWeek[0]['counts']:0.0,
//                             sumWithdrawWeek : reportWitWeek[0]['credit']?reportWitWeek[0]['credit']:0.0,
//                             countWithdrawWeek : reportWitWeek[0]['counts']?reportWitWeek[0]['counts']:0.0,
//                             sumRefundWeek : reportRefWeek[0]['credit']?reportRefWeek[0]['credit']:0.0,
//                             countRefundWeek : reportRefWeek[0]['counts']?reportRefWeek[0]['counts']:0.0,
//                             sumBonusWeek : reportBonusWeek[0]['credit']?reportBonusWeek[0]['credit']:0.0,
//                             countBonusWeek : reportBonusWeek[0]['counts']?reportBonusWeek[0]['counts']:0.0, 
                            
//                             seriesDeposit:seriesDeposit,
//                             seriesWithdraw:seriesWithdraw,
//                             seriesCountNewMember:seriesCountNewMember,

//                         };
                        
//                         res.status(200).json(
//                             { 
//                                 status: 'success', 
//                                 message: '',
//                                 auth : true,
//                                 data : tmpData,
//                             }
//                         );

//                       }).catch((err) => {                        
//                         res.status(202).json(
//                             { 
//                                 status: 'error', 
//                                 message: err,
//                                 auth : false,
//                                 data : [],
//                             }
//                             );
//                       });
                    
                    

                    
//                 }
//                 else
//                 {
//                     res.status(202).json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
//             }
//         }
        
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );

//         console.log(error);
//     }
    
// };

exports.getDashboardDataByDate = async function(req, res) {
    
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
                    // Step 1: Get the current date
                    let dateFrom = new Date(req.body.dateFrom);
                    dateFrom.setHours(0,0,0,0);

                    let dateTo = new Date(req.body.dateTo);                    
                    dateTo.setHours(0,0,0,0);
                    dateTo.setDate(dateTo.getDate() + 1);
                    
                    let inputData = {
                        searchWord:'',
                        dateFrom:dateFrom,
                        dateTo:dateTo,
                    }
                                        
                    Promise.all([                        
                        MemberList.getCountMember(),
                        MemberList.getCountNewMember(inputData),
                        MemberList.getCountNewMemberAndDeposit(inputData),   
                        MemberList.getCountMemberFromInvite(inputData),   
                        MemberList.getCountMemberGroupByKnowUs(inputData),                           
                        ReportList.getReportSumDeposit(inputData),
                        ReportList.getReportSumWithdraw(inputData),
                        ReportList.getReportSumRefund(inputData),
                        ReportList.getReportSumBonus(inputData),         
                        ReportList.getReportSumAffCredit(inputData),        
                        
                        
                      ]).then(([
                            countMem, countNewMem ,countNewMemAndDep,countNewMemFromInvite,countMemberGroupByKnowUs
                            ,reportDep, reportWit, reportRef, reportBonus ,reportSumAffCredit
                        ]) => {
                        

                        let tmpData = {
                            countMember : countMem[0]['C']?countMem[0]['C']:0.0,
                            countNewMember : countNewMem[0]['C']?countNewMem[0]['C']:0.0,
                            countNewMemAndDep : countNewMemAndDep[0]['C']?countNewMemAndDep[0]['C']:0.0,
                            countNewMemFromInvite : countNewMemFromInvite[0]['C']?countNewMemFromInvite[0]['C']:0.0,
                            countMemberGroupByKnowUs : countMemberGroupByKnowUs?countMemberGroupByKnowUs:[],

                            sumDeposit : reportDep[0]['credit']?reportDep[0]['credit']:0.0,
                            countDeposit : reportDep[0]['counts']?reportDep[0]['counts']:0.0,
                            sumWithdraw : reportWit[0]['credit']?reportWit[0]['credit']:0.0,
                            countWithdraw : reportWit[0]['counts']?reportWit[0]['counts']:0.0,
                            sumRefund : reportRef[0]['credit']?reportRef[0]['credit']:0.0,
                            countRefund : reportRef[0]['counts']?reportRef[0]['counts']:0.0,
                            sumBonus : reportBonus[0]['credit']?reportBonus[0]['credit']:0.0,
                            countBonus : reportBonus[0]['counts']?reportBonus[0]['counts']:0.0, 

                            sumAffCredit : reportSumAffCredit[0]['credit_bonus']?reportSumAffCredit[0]['credit_bonus']:0.0,
                            countAffCredit : reportSumAffCredit[0]['counts']?reportSumAffCredit[0]['counts']:0.0, 

                        };
                        
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : tmpData,
                            }
                        );

                      }).catch((err) => {                        
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: err,
                                auth : false,
                                data : [],
                            }
                            );
                      });
                    
                    

                    
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

        console.log(error);
    }
    
};

exports.testOrderStatusData = async function(req, res) {
    console.log('testOrderStatusData');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let testData = await ProductList.testOrderStatusData();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : testData,
                        }
                    );
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
        console.log(error);
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

exports.getSubscriptionTypeReport = async function(req, res) {
    console.log('getSubscriptionTypeReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let subscriptionData = await ProductList.getSubscriptionTypeReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : subscriptionData,
                        }
                    );
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
        console.log(error);
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

exports.getOrderStatusReport = async function(req, res) {
    console.log('getOrderStatusReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let orderStatusData = await ProductList.getOrderStatusReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : orderStatusData,
                        }
                    );
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
        console.log(error);
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

exports.getMonthlyRevenueReport = async function(req, res) {
    console.log('getMonthlyRevenueReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let revenueData = await ProductList.getMonthlyRevenueReport(fromDate, toDate);

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : revenueData,
                        }
                    );
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
        console.log(error);
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

exports.getAccountSummaryReport = async function(req, res) {
    console.log('getAccountSummaryReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
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

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    // Get account summary data
                    let summaryData = await ProductList.getAccountSummaryReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : summaryData,
                        }
                    );
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
        console.log(error);
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

exports.getDashboardDataByDate2 = async function(req, res) {
    console.log('getDashboardDataByDate2');
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

                    const admin_id = userid;
                    const page_name = req.body.page_name;
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    // Step 1: Get the current date
                    let dateFrom = new Date(req.body.dateFrom);
                    dateFrom.setHours(0,0,0,0);

                    let dateTo = new Date(req.body.dateTo);                    
                    dateTo.setHours(0,0,0,0);
                    dateTo.setDate(dateTo.getDate() + 1);
                    
                    let inputData = {
                        searchWord:'',
                        dateFrom:dateFrom,
                        dateTo:dateTo,
                    }
                                        
                    Promise.all([                        
                        MemberList.getCountMember(),
                        MemberList.getCountNewMember(inputData),
                        ReportList.getPaidPayment(inputData),
                        ReportList.getNotPaidPayment(inputData),
                        ReportList.getFinePayment(inputData),
                        ReportList.getPrinciplePayment(inputData),
                        LoanList.getAllPaidPayment(dateFrom,dateTo),
                        LoanList.getPaymentAll(dateFrom,dateTo),
                        LoanList.getAllApproveLoan(dateFrom,dateTo),                                                
                        
                      ]).then(([
                            countMem, 
                            countNewMem,

                            paidPayment,
                            notPaidPayment,
                            finePayment,
                            principlePayment,
                            
                            tmpReceive,
                            tmpAllPayment,
                            tmpAllLoan
                        ]) => {
                        
                        let shareReceive = {};
                        let summaryReceive=0;
                        
                        // Use a Set to store unique full names based on the 'fullName' property
                        const uniqueInterestTypeSet = new Set(tmpReceive.map(x => x.interest_name));

                        // Convert the Set back to an array if needed
                        const uniqueInterestTypeArray = Array.from(uniqueInterestTypeSet);
                        
                        for (let index = 0; index < tmpReceive.length; index++) {
                            
                            const element = tmpReceive[index];
                            
                            summaryReceive+= parseFloat(element['total_received_amount']);
                            const sharePerson = element['shareData'];
                            const interestName = element['interest_name'];
                                                        
                            for (let indexSharePerson = 0; indexSharePerson < sharePerson.length; indexSharePerson++) {
                                const elementPerson = sharePerson[indexSharePerson];
                                if (shareReceive[elementPerson.owner_id]) 
                                {
                                    shareReceive[elementPerson.owner_id]['totalReceiveAmount'] += parseFloat(elementPerson['totalReceiveAmount']);
                                    
                                    if (shareReceive[elementPerson.owner_id][interestName]==null) {
                                        shareReceive[elementPerson.owner_id][interestName] = 
                                        {
                                            totalReceiveAmount: parseFloat(elementPerson['totalReceiveAmount']),
                                            totalPrincipleAmount: parseFloat(elementPerson['totalPrincipleAmount'])
                                        }
                                    }
                                    shareReceive[elementPerson.owner_id][interestName]['totalReceiveAmount'] += parseFloat(elementPerson['totalReceiveAmount']);
                                    shareReceive[elementPerson.owner_id][interestName]['totalPrincipleAmount'] += parseFloat(elementPerson['totalPrincipleAmount']);
                                    
                                    
                                }
                                else
                                {
                                    shareReceive[elementPerson.owner_id] = 
                                    {
                                        totalReceiveAmount : parseFloat(elementPerson['totalReceiveAmount']),
                                        totalPrincipleAmount : parseFloat(elementPerson['totalPrincipleAmount']),
                                        fullName : elementPerson['fullName']
                                    };

                                    if (shareReceive[elementPerson.owner_id][interestName]==null) {
                                        shareReceive[elementPerson.owner_id][interestName] = 
                                        {
                                            totalReceiveAmount: parseFloat(elementPerson['totalReceiveAmount']),
                                            totalPrincipleAmount: parseFloat(elementPerson['totalPrincipleAmount'])
                                        }
                                    }
                                                                        
                                }
                            }
                        }
                        
                        
                        let receiveData = [];
                        Object.keys(shareReceive).forEach(_id => {
                            
                            let interestName = (Object.keys(shareReceive[_id])).filter(x=> !['fullName','_id','totalReceiveAmount','totalPrincipleAmount'].some(substring => x.includes(substring)));                            
                            let totalReceiveAmountByType = [];

                            for (let indexInterest = 0; indexInterest < interestName.length; indexInterest++) {
                                const element = interestName[indexInterest];
                                totalReceiveAmountByType.push({                                    
                                    interestName : element,
                                    receiveAmount : shareReceive[_id][element]['totalReceiveAmount'],
                                    principleAmount : shareReceive[_id][element]['totalPrincipleAmount'],
                                    }
                                )
                            }
                            

                            let tmpData = {
                                _id,
                                totalReceiveAmount : shareReceive[_id]['totalReceiveAmount'],                                    
                                fullName : shareReceive[_id]['fullName'], 
                                receiveAmountByType : totalReceiveAmountByType,
                            };
                            receiveData.push(tmpData);
                        });

                        let indexData = 0;
                        let totalPaid = 0;
                        let listPaid = [];
                        let listUnPaid = [];
                        let listFine = [];
                        let indexDate = new Date(req.body.dateFrom);
                        indexDate.setHours(0,0,0,0);

                        while(indexDate.getTime()<= dateTo.getTime() )
                        {
                            const strDate = timerHelper.convertDateToString(indexDate);
                            const filterDate = tmpAllPayment.filter(x=> timerHelper.convertDateToString(x.due_date)==strDate);

                            let sumPaid = 0;
                            let sumUnPaid = 0;
                            let sumFine = 0;

                            if (filterDate.length>0) 
                            {
                                for (let index = 0; index < filterDate.length; index++) {
                                    const element = filterDate[index];
                                    if (element.paid==1) {
                                        sumPaid+= parseFloat(element.total_amount);
                                        totalPaid+= parseFloat(element.total_amount);
                                    }
                                    else
                                    {
                                        sumUnPaid+= parseFloat(element.total_amount);
                                    }
                                    sumFine+= parseFloat(element.fine_amount);
                                }
                            }
                            listPaid.push(sumPaid);
                            listUnPaid.push(sumUnPaid);
                            listFine.push(sumFine);

                            indexDate.setDate(indexDate.getDate()+1);
                        }
                    
                         const sumCostAmount = tmpAllLoan.reduce((accumulator, x) => accumulator + parseFloat(x.loan_amount), 0);
                        

                        let tmpData = {
                            countMember : countMem[0]['C']?countMem[0]['C']:0.0,
                            countNewMember : countNewMem[0]['C']?countNewMem[0]['C']:0.0,
                            countPaid : paidPayment[0]['C']?paidPayment[0]['C']:0.0,
                            sumPaid : paidPayment[0]['S']?paidPayment[0]['S']:0.0,
                            countNotPaid : notPaidPayment[0]['C']?notPaidPayment[0]['C']:0.0,
                            sumNotPaid : notPaidPayment[0]['S']?notPaidPayment[0]['S']:0.0,
                            countFine : finePayment[0]['C']?finePayment[0]['C']:0.0,
                            sumFine : finePayment[0]['S']?finePayment[0]['S']:0.0,
                            countCost : principlePayment[0]['C']?principlePayment[0]['C']:0.0,
                            sumCost : principlePayment[0]['S']?principlePayment[0]['S']:0.0,
                            sharePerson :receiveData,
                            listPaid : listPaid,
                            listUnPaid : listUnPaid,
                            listFine : listFine,
                            totalPaid:totalPaid,
                            summaryReceive:summaryReceive,
                            sumCostAmount:sumCostAmount,

                        };
                        
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : tmpData,
                            }
                        );

                      }).catch((err) => {                        
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: err,
                                auth : false,
                                data : [],
                            }
                            );
                      });
                    
                    

                    
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
        console.log(error);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );

        console.log(error);
    }
    
};

exports.testOrderStatusData = async function(req, res) {
    console.log('testOrderStatusData');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let testData = await ProductList.testOrderStatusData();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : testData,
                        }
                    );
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
        console.log(error);
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

exports.getSubscriptionTypeReport = async function(req, res) {
    console.log('getSubscriptionTypeReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let subscriptionData = await ProductList.getSubscriptionTypeReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : subscriptionData,
                        }
                    );
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
        console.log(error);
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

exports.getOrderStatusReport = async function(req, res) {
    console.log('getOrderStatusReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let orderStatusData = await ProductList.getOrderStatusReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : orderStatusData,
                        }
                    );
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
        console.log(error);
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

exports.getMonthlyRevenueReport = async function(req, res) {
    console.log('getMonthlyRevenueReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let revenueData = await ProductList.getMonthlyRevenueReport(fromDate, toDate);

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : revenueData,
                        }
                    );
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
        console.log(error);
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

exports.getAccountSummaryReport = async function(req, res) {
    console.log('getAccountSummaryReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
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

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    // Get account summary data
                    let summaryData = await ProductList.getAccountSummaryReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : summaryData,
                        }
                    );
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
        console.log(error);
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

// exports.getLastTransaction = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getLastTransaction(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getLastDepTransaction = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getLastDepTransaction(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getLastWitTransaction = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getLastWitTransaction(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

// exports.getLastRegTransaction = async function(req, res) {  
    
//     try {
//         const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
//         // const ipAddress = req.socket.remoteAddress;
//         // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
//         // const ipAllowList = IpAllowList.findById(ipAddress);    
        
//         const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
//         if (ipBlockList.length>0)
//         {
//             res.status(202).send('Unauthorize ip. ('+ipAddress+')');
//         }
//         else
//         {
//             const headers = req.headers;
    
//             //handles null error
//             if (headers.userid.length === 0 || headers.token.length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
//             } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//                 res.status(400).send({ status: 'error', message: 'Please provide all required field' });
//             } else {
        
//                 // console.log(req.body.userid);
//                 // console.log(req.body.token);
        
//                 const userid = headers.userid;
//                 const token = headers.token;
    
//                 let IsAuth = AdminList.isAuthenicated(userid,token);
//                 // let IsAuth = true;
        
//                 if (IsAuth) 
//                 {
//                     let tmpData = ReportList.getLastRegTransaction(req.body);
//                     res.json(
//                         { 
//                             status: 'success', 
//                             message: '',
//                             auth : true,
//                             data : tmpData,
//                         }
//                         );
//                 }
//                 else
//                 {
//                     res.json(
//                         { 
//                             status: 'error', 
//                             message: 'Authenication Failed',
//                             auth : false,
//                             data : [],
//                         }
//                         );
//                 }
               
//             }
//         }
//     } catch (error) {
//         res.status(202).json(
//             { 
//                 status: 'error', 
//                 message: error.message,
//                 auth : false,
//                 data : [],
//             }
//         );
//     }

   

   

// };

exports.getOldSummaryReport = async function(req, res) {
    console.log('getOldSummaryReport');
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

                    const admin_id = userid;
                    const page_name = req.body.page_name;
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    // Step 1: Get the current date
                    let dateFrom = new Date(req.body.dateFrom);
                    dateFrom.setHours(0,0,0,0);

                    let dateTo = new Date(req.body.dateTo);                    
                    dateTo.setHours(0,0,0,0);
                    dateTo.setDate(dateTo.getDate() + 1);
                    
                    let inputData = {
                        searchWord:'',
                        dateFrom:dateFrom,
                        dateTo:dateTo,
                    }

                    let tmpData = await ReportList.getOldSummaryReport(inputData);

                    const uniqueInterestTypeSet = new Set(tmpData.map(x => x.interest_name));
                    const uniqueInterestTypeArray = Array.from(uniqueInterestTypeSet);

                    let reportData = [];

                    let percentAdmin = await AdminSetting.findById("report_percent_setting");  
                    percentAdmin = JSON.parse(percentAdmin['value']);

                    for (let indexInterestType = 0; indexInterestType < uniqueInterestTypeArray.length; indexInterestType++) {
                        const element = uniqueInterestTypeArray[indexInterestType];                        
                        const typeName = element;

                        const filterByType = tmpData.filter(x=> x.interest_name==typeName);

                        if (filterByType.length>0) 
                        {
                            
                            const sumLoanAmount = filterByType.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.loan_amount), 0);
                            const sumInterestAmount = filterByType.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.payment_interest_amount), 0);

                            const sumRemainLoanAmount = filterByType.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.remain_loan), 0);
                            const sumRemainInterestAmount = filterByType.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.remain_interest), 0);

                            const sumRemainFineAmount = filterByType.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.remain_fine), 0);

                            let keepAll1 = sumInterestAmount * percentAdmin['percent_all_0'] /100;
                            let shareAll1 = sumInterestAmount * percentAdmin['percent_all_1'] /100;
                            let shareAll2 = sumInterestAmount * percentAdmin['percent_all_2'] /100;

                            let sumPaidPrinciple = (sumLoanAmount - sumRemainLoanAmount);
                            let sumPaidInterest = (sumInterestAmount - sumRemainInterestAmount) + (sumRemainFineAmount);
                            let sharePaid1 =  sumPaidInterest * percentAdmin['percentpercent_paid_1'] /100;
                        
                            const itemData = {
                                typeName : typeName,
                                interest : parseFloat(filterByType[0].interest) * parseFloat(filterByType[0].payment_count)  ,

                                sumLoanAmount : sumLoanAmount,
                                sumInterestAmount : sumInterestAmount,
                                sumRemainLoanAmount : sumRemainLoanAmount,
                                sumRemainInterestAmount : sumRemainInterestAmount,

                                keepAll1 :keepAll1,
                                shareAll1 :shareAll1,
                                shareAll2 :shareAll2,

                                sumPaidPrinciple:sumPaidPrinciple,
                                sumPaidInterest: sumPaidInterest,                                
                                sharePaid1 : sharePaid1,

                                percent_all_0 : percentAdmin['percent_all_0'],
                                percent_all_1 : percentAdmin['percent_all_1'],
                                percent_all_2 : percentAdmin['percent_all_2'],
                                percentpercent_paid_1 : percentAdmin['percentpercent_paid_1'],
                            }
                        
                            reportData.push(itemData);
                        }
                        
                    }


                                        
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : reportData,
                        }
                    );

                    
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
        console.log(error);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
        );

        console.log(error);
    }
    
};

exports.testOrderStatusData = async function(req, res) {
    console.log('testOrderStatusData');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let testData = await ProductList.testOrderStatusData();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : testData,
                        }
                    );
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
        console.log(error);
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

exports.getSubscriptionTypeReport = async function(req, res) {
    console.log('getSubscriptionTypeReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let subscriptionData = await ProductList.getSubscriptionTypeReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : subscriptionData,
                        }
                    );
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
        console.log(error);
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

exports.getOrderStatusReport = async function(req, res) {
    console.log('getOrderStatusReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let orderStatusData = await ProductList.getOrderStatusReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : orderStatusData,
                        }
                    );
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
        console.log(error);
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

exports.getMonthlyRevenueReport = async function(req, res) {
    console.log('getMonthlyRevenueReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    let revenueData = await ProductList.getMonthlyRevenueReport(fromDate, toDate);

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : revenueData,
                        }
                    );
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
        console.log(error);
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

exports.getAccountSummaryReport = async function(req, res) {
    console.log('getAccountSummaryReport');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
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

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);

                if (IsAuth) 
                {
                    const admin_id = userid;
                    const page_name = req.body.page_name || "report_summary";
                    const fromDate = req.body.from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    const toDate = req.body.to_date || new Date().toISOString().split('T')[0];
                    
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!(adminPagePermission.canView || adminPagePermission.canViewAll)) {
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

                    // Get account summary data
                    let summaryData = await ProductList.getAccountSummaryReport();

                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            data : summaryData,
                        }
                    );
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
        console.log(error);
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



exports.getMonthlyExpenseReport = async function(req, res) {
    res.status(200).json({
        status: 'success',
        message: '',
        auth : true,
        data : await Report.getMonthlyExpenseReport(),
    });
};




