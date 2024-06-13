'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const StaffList = require('../models/staffsetting.model');
const IpAllowList = require('../models/ipallowlist.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


var session = require('express-session');
const { count } = require('console');
const MainModel = require('../models/main.model');
const timerHelper = require('../modules/timehelper');

const axios = require("axios");
const AdminSetting = require('../models/adminsetting.model');

exports.default = async function(req, res) {
    res.send('admin bank api');
}

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

exports.getRegisterOTP = async function(req, res) {
    console.log('getRegisterOTP');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);        
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {            
            let time = new Date((new Date().getTime()) - (10 * 60 * 1000));
            let mobile_no = req.body.mobile_no?req.body.mobile_no:'';
            
            let tmpCheck = await MainModel.query(`
                select * 
                from otp_ip 
                where ip = '${ipAddress}' and date > '${timerHelper.convertDatetimeToString(time)}'
            `);

            if(tmpCheck.length >= 3){
                
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Please wait 10 minute for next request OTP',
                        auth : true,
                        data : [],
                    }
                    );

                return;
            }

            let checkNumber = await MemberList.findById(mobile_no);
            if (checkNumber.length>0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'This number is used register.',
                        auth : true,
                        data : [],
                    }
                    );

                return;
            }


            let otpSetting = await AdminSetting.findById('otp_register');            
            for (const [key,value] of Object.entries(JSON.parse(otpSetting.value)))
            {
                otpSetting[key] = value;
            }
            
            let header = {                            
                'Accept': 'application/json;',
                'Content-Type': 'application/json;',            
            }

            let body = {
                'key'     : otpSetting['otp_key'],
                'secret'  : otpSetting['otp_secret'],
				'msisdn'  : mobile_no,
            }

            console.log(body);

            const api = 'https://otp.thaibulksms.com/v1/otp/request';

            let response ="";        
                
            await axios.post(api,body,
                {
                    headers: header
                }
            ).then(            
                resp => 
                {   
                    response = resp;                                   
                }
            )

            if (response.error) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: response.error,
                        auth : true,
                        data : [],
                    }
                    );
                return;
            }
            else
            {

                res.status(200).json(
                    { 
                        status: 'success', 
                        message: '',
                        auth : true,                    
                        data : response.data
                    }
                );
                return;
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
        return;
    }
   

    
};

exports.checkRegisterOTP = async function(req, res) {
    console.log('checkRegisterOTP');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);        
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {   
            let mobile_no = req.body.mobile_no?req.body.mobile_no:'';
            let mobile_otp = req.body.mobile_otp?req.body.mobile_otp:'';
            let otp_token = req.body.otp_token?req.body.otp_token:'';
            
            let otpSetting = await AdminSetting.findById('otp_register');            
            for (const [key,value] of Object.entries(JSON.parse(otpSetting.value)))
            {
                otpSetting[key] = value;
            }
            
            let header = {                            
                'Accept': 'application/json;',
                'Content-Type': 'application/json;',            
            }

            let body = {
                'key'     : otpSetting['otp_key'],
                'secret'  : otpSetting['otp_secret'],
				'token'  : otp_token,
                'pin'  : mobile_otp,
            }

            

            const api = 'https://otp.thaibulksms.com/v1/otp/verify';

            // console.log(body);
            // console.log(api);

            let response ="";        
                
            await axios.post(api,body,
                {
                    headers: header
                }
            ).then(            
                resp => 
                {   
                    response = resp;                                   
                }
            )

            // console.log(response);

            if (response.error) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: response.error,
                        auth : true,
                        data : [],
                    }
                    );
                return;
            }
            else
            {
                const ins = {                    
                    "ip"	: ipAddress,
                    "date"	: timerHelper.convertDatetimeToString(new Date()),
                };

                await MainModel.insert("otp_ip",ins);                

                res.status(200).json(
                    { 
                        status: 'success', 
                        message: '',
                        auth : true,                    
                        data : response.data
                    }
                );
            }
               
        }
    } catch (error) {
        // console.log(error);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,
                auth : false,
                data : [],
            }
            );

        return;
    }
   

    
};

exports.getForgotPasswordOTP = async function(req, res) {
    console.log('getForgotPasswordOTP');
    
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
            let ipAddress = req.body.ipAddress;
            let time = new Date((new Date().getTime()) - (10 * 60 * 1000));
            let mobile_no = req.body.mobile_no?req.body.mobile_no:'';
            
            let tmpCheck = await MainModel.query(`
                select * 
                from otp_ip 
                where ip = '${ipAddress}' and date > '${timerHelper.convertDatetimeToString(time)}'
            `);

            if(tmpCheck.length >= 3){
                
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Please wait 10 minute for next request OTP',
                        auth : true,
                        data : [],
                    }
                    );
                return;
            }

            let checkMember = await MemberList.findById(mobile_no);
            if (checkMember.length==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Not Have this mobile no in member list',                        
                        data : [],
                    }
                );
                return;
            }

            let otpSetting = await AdminSetting.findById('otp_register');            
            for (const [key,value] of Object.entries(otpSetting.value)) 
            {
                otpSetting[key] = value;
            }

            header = {                            
                'Accept': 'application/json;',
                'Content-Type': 'application/json;',            
            }

            body = {
                'key'     : otpSetting['otp_key'],
                'secret'  : otpSetting['otp_secret'],
				'msisdn'  : mobile_no,
            }

            const url = 'https://otp.thaibulksms.com/v1/otp/request';

            let response ="";        
                
            await axios.post(api,body,
                {
                    headers: header
                }
            ).then(            
                resp => 
                {   
                    response = resp;                                   
                }
            )

            if (response.error) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: response.error,
                        auth : true,
                        data : [],
                    }
                    );
                return;
            }
            else
            {

                res.status(200).json(
                    { 
                        status: 'success', 
                        message: '',
                        auth : true,                    
                        data : {
                            'token': response.data.token,
                            'mobile':mobile_no
                        },
                    }
                );
                return;
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
            return;
    }
   

    
};
