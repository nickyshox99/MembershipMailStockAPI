'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const AdminBankList = require('../models/adminbanklist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('./../models/main.model');
const SCBModel = require('../models/scb.model');

const Secret = require('../../config/secret');

const Scb_app_lib = require('./../modules/scbapplib');
const Kplus_lib_202204 = require('./../modules/kplusclass');

const Cryptof = require('../models/cryptof.model');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


var session = require('express-session');
const { count } = require('console');
const timerHelper = require('../modules/timehelper');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

exports.default = async function(req, res) {
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            res.send('admin bank api');
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

exports.getadminbank = async function(req, res) {
    console.log('getadminbank..');
    try {          
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            // const headers = req.headers;

            //handles null error
            // if (headers.userid.length === 0 || headers.token.length === 0) {
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                // let IsAuth = AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) 
                {
                    
                    let tmpData = await AdminBankList.findAll(req.body.searchword);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
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

exports.getactiveadminbank = async function(req, res) {
    console.log('getactiveadminbank');
    try {          
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            // const headers = req.headers;

            //handles null error
            // if (headers.userid.length === 0 || headers.token.length === 0) {
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                // let IsAuth = AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) 
                {
                    
                    let tmpData = await AdminBankList.findAllActive(req.body.searchword);
                    for (let index = 0; index < tmpData.length; index++) {
                        delete tmpData[index].meta_data;
                    }
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpData,
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


exports.getadminbankbyid = async function(req, res) {
    console.log('getadminbankbyid');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
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
                    let tmpData = await AdminBankList.findById(req.params.Id);                
                    console.log(tmpData);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            total : count(tmpData),
                            data : tmpData,
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

exports.create = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("insertadminbank")
             //handles null error
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
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
                    // console.log(req.body);            
                    let tmpData = await AdminBankList.create(req.body);
    
                    if (tmpData) 
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

exports.updateadminbankbyid = async function(req, res) {
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("updateadminbankbyid")
             //handles null error
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
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
                    // console.log(req.body);            
                    let tmpData = await AdminBankList.updateByID(req.body);
    
                    if (tmpData) 
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

exports.deleteadminbankbyid = async function(req, res) {
   
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            console.log("deleteadminbankbyid")
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
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
                    let tmpData = await AdminBankList.deleteByID(req.body);

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

exports.getbankinfo = async function(req, res) {
    console.log('getbankinfo');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
    
            // const headers = req.headers;
    
            //handles null error
            // if (headers.userid.length === 0 || headers.token.length === 0) {
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                // const userid = headers.userid;
                // const token = headers.token;
    
                // let IsAuth = AdminList.isAuthenicated(userid,token);            
                let IsAuth = true;
                if (IsAuth) 
                {
                    let tmpData = await  AdminBankList.getBankInfo();
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            total : count(tmpData),
                            data : tmpData,
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

exports.getbankbreakinfo = async function(req, res) {
    console.log('getbankbreakinfo');
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
    
            // const headers = req.headers;
    
            //handles null error
            // if (headers.userid.length === 0 || headers.token.length === 0) {
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                // const userid = headers.userid;
                // const token = headers.token;
    
                // let IsAuth = AdminList.isAuthenicated(userid,token);            
                let IsAuth = true;
                if (IsAuth) 
                {
                    let tmpData = await AdminBankList.getBankBreakInfo();
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            total : count(tmpData),
                            data : tmpData,
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

exports.transferbankbyid = async function(req, res) {
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("transferbankbyid")
             //handles null error
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {
    
                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    
                    if (req.body.id==null)
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Incorrect id',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    if (req.body.bank_id==null)
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Incorrect bank id',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    if (req.body.bank_acc_no==null)
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Incorrect bank account no',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    if (req.body.amount==null)
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Incorrect amount',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    if (req.body.pin==null)
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Invalid PIN',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    const checkPin = await AdminBankList.getWithdrawPIN(req.body.pin);                    
                    if (checkPin.length>0) 
                    {                        
                        let admin_banks = MainModel.queryFirstRow(`
									select *
									from admin_bank
									where id=${req.body.id} 
                                `);
                            
                        if (admin_banks) 
                        {
                            let tmpMeta = JSON.parse(admin_banks['meta_data']);
                            admin_banks['meta_data']= tmpMeta;
                            for (const [key,value] of Object.entries(tmpMeta))
                            {
                                admin_banks[key] = value;
                            }
                            let admin_info = admin_banks;

                            if(admin_info['bank_id']=="5")
                            {                                            
                                const scb_app_lib = new Scb_app_lib();
                                let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";

                                 ///Login///
                                let resp = await scb_app_lib.Profile(scbtoken, admin_info['bank_acc_number']);
                                let data = [];
                                let i = 0;

                                // console.log(resp.data);
                                if (resp['status'] && resp['status']!='error')  
                                {
                                    if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                    {                  
                                        console.log("Still Login");
                                        //Still Login                  
                                        admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                        SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);
                                        console.log(admin_info['bank_acc_number'] + " : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                    }
                                    else
                                    {
                                        console.log("New Login");                                        
                                        let token = "";										

                                        let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                        let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
                                                                        
                                        token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);
                                        
                                        if (token) 
                                        {                                            
                                            admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);  
                                            
                                            resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                            // console.log(resp.data);
                                            if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                            {
                                                admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                            }                                            
                                            SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);                                            
                                            console.log(admin_info['bank_acc_number'] + " : Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                        }
                                        else
                                        {
                                            console.log('Login Failed '+ admin_info['bank_acc_number']);
                                            res.status(202).json(
                                                { 
                                                    status: 'error', 
                                                    message: 'Login Failed '+ admin_info['bank_acc_number'] ,
                                                    auth : true,
                                                    data : [],
                                                }
                                            );
                                            return;
                                        }
                                    }
                                }
                                else
                                {                                    
                                    console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
                                    res.status(202).json(
                                        { 
                                            status: 'error', 
                                            message: 'Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message ,
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                                
                                if (req.body.bank_id=="29")
                                {
                                    let amount 	= parseFloat(req.body.amount);
                                    let acc 	= req.body.bank_acc_no;                                        
                                    if (true) 
                                    {
                                        let response = await scb_app_lib.TransferAutoTrueWallet(scbtoken,admin_info['bank_acc_number'],acc,amount);    
                                        if(response['status'] == "success")
                                        {                     
                                            res.status(200).json(
                                                { 
                                                    status: 'success', 
                                                    message: 'Transfer Success',
                                                    auth : true,
                                                    data : [],
                                                }
                                            );
    
                                            MainModel.insert("bank_transfer_log",
                                                {
                                                    datetime: timerHelper.convertDatetimeToString(cTime),
                                                    from_bank_id : admin_info['bank_id'],        
                                                    from_acc_number : admin_info['bank_acc_number'], 
                                                    to_bank_id : req.body.bank_id, 
                                                    to_acc_number : acc, 
                                                    amount : amount,                                             
                                                }                                            
                                            );
    
                                            return;
                                        } 
                                        else
                                        {
                                            res.status(202).json(
                                                { 
                                                    status: 'error', 
                                                    message: response['message'] ,
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
                                                message: 'Not found bank_id : '+req.body.bank_id ,
                                                auth : true,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }   
                                }
                                else
                                {
                                    let amount 	= parseFloat(req.body.amount);
                                    let acc 	= req.body.bank_acc_no;
                                    const bankInfo =await  MainModel.getBankInfo(req.body.bank_id);
                                    let bank_id = bankInfo['scb_id']?bankInfo['scb_id']:'';
    
                                    if (bank_id!='') 
                                    {
                                        let response = await scb_app_lib.TransferAuto(scbtoken,admin_info['bank_acc_number'],acc,bank_id,amount);    
                                        if(response['status'] == "success")
                                        {                     
                                            res.status(200).json(
                                                { 
                                                    status: 'success', 
                                                    message: 'Transfer Success',
                                                    auth : true,
                                                    data : [],
                                                }
                                            );
    
                                            MainModel.insert("bank_transfer_log",
                                                {
                                                    datetime: timerHelper.convertDatetimeToString(cTime),
                                                    from_bank_id : admin_info['bank_id'],        
                                                    from_acc_number : admin_info['bank_acc_number'], 
                                                    to_bank_id : req.body.bank_id, 
                                                    to_acc_number : acc, 
                                                    amount : amount,                                             
                                                }                                            
                                            );
    
                                            return;
                                        } 
                                        else
                                        {
                                            res.status(202).json(
                                                { 
                                                    status: 'error', 
                                                    message: response['message'] ,
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
                                                message: 'Not found bank_id : '+req.body.bank_id ,
                                                auth : true,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }   
                                }

                                                            
                            }    
                            else if(admin_info['bank_id']=="1")
                            {

                                let kPlus =new Kplus_lib_202204();
                                admin_info['meta_data']['url'] = admin_info['meta_data']['url'] ? Cryptof.decryption(admin_info['meta_data']['url']) : "";       

                                let amount 	= parseFloat(req.body.amount);
                                let acc 	= req.body.bank_acc_no;
                                const bankInfo =await MainModel.getBankInfo(req.body.bank_id);
                                let bank_id = bankInfo['kbank_id']?bankInfo['kbank_id']:'';
                                
                                if (bank_id!='') 
                                {                                    
                                    let bank_code = bank_id.toString().padStart(3, "0");                                    
                                    let response = await kPlus.KbankTransferAuto(admin_info['meta_data']['url'] , bank_code ,acc,amount );
                                    console.log(response);
                                    if(response['status'] == "success")
                                    {                                       
        
                                        res.status(200).json(
                                            { 
                                                status: 'success', 
                                                message: 'Transfer Success',
                                                auth : true,
                                                data : [],
                                            }
                                        );

                                        MainModel.insert("bank_transfer_log",
                                            {
                                                datetime: timerHelper.convertDatetimeToStringNoT(cTime),
                                                from_bank_id : admin_info['bank_id'],        
                                                from_acc_number : admin_info['bank_acc_number'], 
                                                to_bank_id : req.body.bank_id, 
                                                to_acc_number : acc, 
                                                amount : amount,                                             
                                            }                                            
                                        );
                                        
                                        return;
                                    } 
                                    else
                                    {
                                        res.status(202).json(
                                            { 
                                                status: 'error', 
                                                message: response['message'] ,
                                                auth : true,
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
                                        message: 'Not found Bank ',
                                        auth : true,
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
                                message: 'Incorrect PIN',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
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

