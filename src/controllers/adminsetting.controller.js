'use strict';
const jwt = require('jsonwebtoken');
const AdminSetting = require('../models/adminsetting.model');
const AdminList = require('../models/adminlist.model');
const IpAllowList = require('../models/ipallowlist.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


var session = require('express-session');
const { count } = require('console');

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
            return;
        }
        else
        {
            res.status(200).send('admin truewallet api');
            return;
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

exports.getadminsetting = async function(req, res) {
    
    
    try {
        console.log('getadmintruewallet..');
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

                let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    
                    let tmpData = await AdminSetting.findAll(req.body.searchword);
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,
                            total : count(tmpData),
                            data : tmpData,
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
        return;
    }

    

    
};

exports.getadminsettingbyid = async function(req, res) {

    try {
        console.log('getadminsettingbyid..');
            
        const ipAddress = await IpAllowList.getIPv4Address(req);        
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            let byPassId= ['agreement','brand_setting','getname_auto','otp_register','website_online_setting','line_login'];
            let byPass = false;
            const headers = req.headers;
    
            if (byPassId.includes(req.body.id)) 
            {
                byPass=true;
            }
    
            headers.userid = headers.userid?headers.userid:'';
            headers.token = headers.token?headers.token:'';
    
            //handles null error        
            if (!byPass && (headers.userid.length === 0 || headers.token.length === 0)) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid?headers.userid:'';
                const token = headers.token?headers.token:'';
    
                let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth||byPass) 
                {
                    
                    let tmpData = await AdminSetting.findById(req.body.id);                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                            
                            data : tmpData,
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
        return;
    }

   

    
};

exports.updateadminsettingbyid = async function(req, res) {
    
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
            console.log("updateadminsettingbyid")
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

                let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    // console.log('updateadmintruewalletbyid');
                    // console.log(req.body);            
                    let tmpData = await AdminSetting.updateByID(req.body);
                    
                    if (tmpData['error']) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: tmpData['error'],                            
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
        return;
    }

   
};

