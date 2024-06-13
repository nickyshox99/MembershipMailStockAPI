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
var crypto = require('crypto');
const cryptof = require('../models/cryptof.model');

const timerHelper = require('../modules/timehelper');

var session = require('express-session');
const { count } = require('console');

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

exports.getStaff = async function(req, res) {

    try {
        console.log('get staff group..');
    
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

                    if (!(adminPagePermission.canView||adminPagePermission.canViewAll)) {
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
                    
                    let tmpData = await StaffList.findAll(req.body.searchword);                    
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
    }

   

    
};

exports.getStaffById = async function(req, res) {

    try {
        console.log('getadminbankbyid');
    
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
                    let tmpData = await StaffList.findById(req.params.Id);                
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
            console.log("insert promotion")
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
                // var key = 'SuperSumohmomo';
                // var encrypted = crypto.createHmac('sha1', key).update(req.body.am_password).digest('hex');
    
    
                if (IsAuth) 
                {
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;
                                        
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!adminPagePermission.canAdd) {
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


                    const salt = await cryptof.getSalt();                                
                    const hashPassword = await cryptof.hashPassword(req.body.adminName,salt.data);
                    
                    const newUser = {
                        adminName: req.body.adminName,
                        hash : hashPassword.data,
                        salt : salt.data,
                        fullName : req.body.fullName,
                        status : parseInt(req.body.status),
                        createdAt : timerHelper.getDateTimeNowString(),
                        createdBy : userid,
                        updatedAt : timerHelper.getDateTimeNowString(),
                        updatedBy : userid,
                        am_rank : req.body.am_rank,
                        am_group : req.body.am_group,
                    };

                    let tmpData = await StaffList.create(newUser);
    
                    if (tmpData.errorMessage) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,                            
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

exports.updateStaffById = async function(req, res) {
    
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
            console.log("updateStaffById")
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

                    const admin_id = userid;
                    const page_name = req.body.page_name;
                                        
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!adminPagePermission.canEdit) {
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

                    let tmpData = await StaffList.updateByID(req.body);
    
                    if (tmpData.errorMessage)
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                            }
                            );
                    }
                    else
                    { 
                        res.status(202).json(
                        { 
                            status: 'success', 
                            message: '',
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

exports.deleteStaffById = async function(req, res) {
    
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
                    const admin_id = userid;
                    const page_name = req.body.page_name;
                                        
                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                    if (!adminPagePermission.canDelete) {
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

                    let tmpData = await StaffList.deleteByID(req.body);
    
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : false,
                                data : [],
                            }
                            );
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
