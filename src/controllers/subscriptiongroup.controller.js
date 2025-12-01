'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const SubscriptionGroup = require('../models/subscriptiongroup.model');
const SubscriptionGroupStock = require('../models/subscriptiongroupgroup.model');
const IpAllowList = require('../models/ipallowlist.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


var session = require('express-session');
const { count, time } = require('console');
const timerHelper = require('../modules/timehelper');

exports.getSubscriptionGroup = async function(req, res) {

    try {
        console.log('getSubscriptionGroup');
    
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
                    
                    let tmpData = await SubscriptionGroup.findAll(req.body.searchword);
                    
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

exports.getSubscriptionGroupStock = async function(req, res) {

    try {
        console.log('getSubscriptionGroup');
    
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
                    
                    let tmpData = await SubscriptionGroupStock.findAll(req.body.searchword);
                    
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

exports.getSubscriptionGroupForReport = async function(req, res) {

    try {
        console.log('getSubscriptionGroupForReport - For Report Only');
    
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
                    
                    let tmpData = await SubscriptionGroup.findAllForReport(req.body.searchword);
                    
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

exports.getSubscriptionGroupForReportStock = async function(req, res) {

    try {
        console.log('getSubscriptionGroupForReportStock - For Report Only');
    
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
                    
                    let tmpData = await SubscriptionGroupStock.findAllForReport(req.body.searchword);
                    
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

exports.getActiveSubscriptionGroup = async function(req, res) {

    try {
        console.log('getActiveSubscriptionGroup');
    
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
                    
                    let tmpData = await SubscriptionGroup.findAllActive(req.body.searchword);
                    
                    
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

exports.getActiveSubscriptionGroupStock = async function(req, res) {

    try {
        console.log('getActiveSubscriptionGroupStock');
    
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
                    
                    let tmpData = await SubscriptionGroupStock.findAllActive(req.body.searchword);
                    
                    
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

exports.getSubscriptionGroupById = async function(req, res) {

    try {
        console.log('getSubscriptionGroupById');
    
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
                    let tmpData = await SubscriptionGroup.findById(req.params.Id);                
                    
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

exports.getSubscriptionGroupStockById = async function(req, res) {

    try {
        console.log('getSubscriptionGroupStockById');
    
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
                    let tmpData = await SubscriptionGroupStock.findById(req.params.Id);                
                    
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

exports.getSubscribeMemberByGroupById = async function(req, res) {

    try {
        console.log('getSubscribeMemberByGroupById');
    
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
                    let tmpData = await SubscriptionGroup.getSubscribeMemberByGroupById(req.body.id);                
                    
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

exports.getSubscribeMemberByGroupStockById = async function(req, res) {

    try {
        console.log('getSubscribeMemberByGroupStockById');
    
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
                    let tmpData = await SubscriptionGroupStock.getSubscribeMemberByGroupById(req.body.id);                
                    
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

exports.getSubscribePaymentById = async function(req, res) {

    try {
        console.log('getSubscribePaymentById');
    
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
                    let tmpData = await SubscriptionGroup.getSubscribePaymentById(req.body.group_id);                
                    
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

exports.getSubscribeStockPaymentById = async function(req, res) {

    try {
        console.log('getSubscribeStockPaymentById');
    
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
                    let tmpData = await SubscriptionGroupStock.getSubscribePaymentById(req.body.group_id);                
                    
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

exports.getGroupOfMemberByMemberId = async function(req, res) {

    try {
        console.log('getGroupOfMemberByMemberId');
    
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
                    let tmpData = await SubscriptionGroup.getGroupOfMemberByMemberId(req.body.user_id);                
                    
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

exports.getGroupStockOfMemberByMemberId = async function(req, res) {

    try {
        console.log('getGroupStockOfMemberByMemberId');
    
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
                    let tmpData = await SubscriptionGroupStock.getGroupOfMemberByMemberId(req.body.user_id);                
                    
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

                    let objData = req.body;
                    objData.update_at = timerHelper.getDateTimeNowString();
                    objData.update_by = admin_id;

                    let tmpData = await SubscriptionGroup.create(objData);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.createStock = async function(req, res) {
    
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
            console.log("insert subscription group stock")
             //handles null error
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

                    let objData = req.body;
                    objData.update_at = timerHelper.getDateTimeNowString();
                    objData.update_by = admin_id;

                    let tmpData = await SubscriptionGroupStock.create(objData);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.updateById = async function(req, res) {
    
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
            console.log("updatePromotionById")
             //handles null error
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

                    let objData = req.body;
                    objData.update_at = timerHelper.getDateTimeNowString();
                    objData.update_by = admin_id;

                    let tmpData = await SubscriptionGroup.updateByID(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.updateStockById = async function(req, res) {
    
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
            console.log("updateSubscriptionGroupStockById")
             //handles null error
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

                    let objData = req.body;
                    objData.update_at = timerHelper.getDateTimeNowString();
                    objData.update_by = admin_id;

                    let tmpData = await SubscriptionGroupStock.updateByID(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.addMemberToGroup = async function(req, res) {
    console.log("addMemberToGroup");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;
                    const user_id = req.body.user_id? req.body.user_id : "";
                    const email = req.body.email? req.body.email : "";
                    const password = req.body.password? req.body.password : "";
                    const line_user_id = req.body.line_user_id? req.body.line_user_id : "";
                    const group_id = req.body.group_id? req.body.group_id : 0;
                    const note = req.body.note? req.body.note : "";
                                        
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

                    let objData =
                    {
                        subscription_group_id : group_id,
                        user_id : user_id,
                        email : email,
                    }
                    let tmpData2 = await SubscriptionGroup.checkDuplicateMember(objData); 
                    if (tmpData2[0].totalCount>0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'This member already exists in this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                        
                    }

                    let tmpData3 = await SubscriptionGroup.findById(group_id);                    
                    if (!tmpData3) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                    }

                    objData =
                    {
                        subscription_type_id : tmpData3.subscription_type_id,
                        subscription_group_id : group_id,
                        user_id : user_id,
                        email : email,
                        password : password,
                        line_user_id : line_user_id,
                        update_at : timerHelper.getDateTimeNowString(),
                        update_by : admin_id,
                        note : note,
                    }

                    let tmpData = await SubscriptionGroup.addMemberToGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.addMemberToGroupStock = async function(req, res) {
    console.log("addMemberToGroupStock");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;
                    const user_id = req.body.user_id? req.body.user_id : "";
                    const email = req.body.email? req.body.email : "";
                    const password = req.body.password? req.body.password : "";
                    const line_user_id = req.body.line_user_id? req.body.line_user_id : "";
                    const group_id = req.body.group_id? req.body.group_id : 0;
                    const note = req.body.note? req.body.note : "";
                                        
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

                    let objData =
                    {
                        subscription_group_id : group_id,
                        user_id : user_id,
                        email : email,
                    }
                    let tmpData2 = await SubscriptionGroupStock.checkDuplicateMember(objData); 
                    if (tmpData2[0].totalCount>0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'This member already exists in this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                        
                    }

                    let tmpData3 = await SubscriptionGroupStock.findById(group_id);                    
                    if (!tmpData3) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                    }

                    objData =
                    {
                        subscription_type_id : tmpData3.subscription_type_id,
                        subscription_group_stock_id : group_id,
                        user_id : user_id,
                        email : email,
                        password : password,
                        line_user_id : line_user_id,
                        update_at : timerHelper.getDateTimeNowString(),
                        update_by : admin_id,
                        note : note,
                    }

                    let tmpData = await SubscriptionGroupStock.addMemberToGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.setMemberToHeaderGroup = async function(req, res) {
    console.log("setMemberToHeaderGroup");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;                    
                    const email = req.body.email? req.body.email : "";
                    const isHeader = req.body.isHeader? req.body.isHeader : 0;
                    const group_id = req.body.group_id? req.body.group_id : 0;
                                        
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


                    let objData =
                    {
                        subscription_group_id : group_id,                        
                        email : email,
                        isHeader : isHeader,
                        update_at : timerHelper.getDateTimeNowString(),
                        update_by : admin_id,
                    }

                    let tmpData = await SubscriptionGroup.setMemberToHeaderGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.setMemberToHeaderGroupStock = async function(req, res) {
    console.log("setMemberToHeaderGroupStock");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;                    
                    const email = req.body.email? req.body.email : "";
                    const isHeader = req.body.isHeader? req.body.isHeader : 0;
                    const group_id = req.body.group_id? req.body.group_id : 0;
                                        
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


                    let objData =
                    {
                        subscription_group_id : group_id,                        
                        email : email,
                        isHeader : isHeader,
                        update_at : timerHelper.getDateTimeNowString(),
                        update_by : admin_id,
                    }

                    let tmpData = await SubscriptionGroupStock.setMemberToHeaderGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.addMemberToGroupById = async function(req, res) {
    console.log("addMemberToGroupById");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;                    
                    const id = req.body.id? req.body.id : 0;
                    const group_id = req.body.group_id? req.body.group_id : 0;
                                        
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

                    let tmpData3 = await MemberList.getUserEmailById(id); 
                    if (tmpData3.length==0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'This member does not exist.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                    }

                    let tmpData4 = await SubscriptionGroup.findById(group_id);                    
                    if (!tmpData4) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                    }

                    let email = tmpData3[0].email;
                    let user_id = tmpData3[0].user_id;

                    let objData =
                    {
                        subscription_group_id : group_id,
                        user_id : user_id,
                        email : email,
                    }
                    let tmpData2 = await SubscriptionGroup.checkDuplicateMember(objData); 
                    if (tmpData2[0].totalCount>0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'This member already exists in this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                        
                    }

                    objData =
                    {
                        subscription_type_id : tmpData4.subscription_type_id,
                        subscription_group_id : group_id,
                        user_id : user_id,
                        email : email,
                        update_at : timerHelper.getDateTimeNowString(),
                        update_by : admin_id,
                    }

                    let tmpData = await SubscriptionGroup.addMemberToGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.addMemberToGroupStockById = async function(req, res) {
    console.log("addMemberToGroupStockById");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;                    
                    const id = req.body.id? req.body.id : 0;
                    const group_id = req.body.group_id? req.body.group_id : 0;
                                        
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

                    let tmpData3 = await MemberList.getUserEmailById(id); 
                    if (tmpData3.length==0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'This member does not exist.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                    }

                    let tmpData4 = await SubscriptionGroupStock.findById(group_id);                    
                    if (!tmpData4) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                    }

                    let email = tmpData3[0].email;
                    let user_id = tmpData3[0].user_id;

                    let objData =
                    {
                        subscription_group_id : group_id,
                        user_id : user_id,
                        email : email,
                    }
                    let tmpData2 = await SubscriptionGroupStock.checkDuplicateMember(objData); 
                    if (tmpData2[0].totalCount>0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'This member already exists in this group.',
                                auth : false,
                                data : [],
                            }
                            );
                        return;
                        
                    }

                    objData =
                    {
                        subscription_type_id : tmpData4.subscription_type_id,
                        subscription_group_id : group_id,
                        user_id : user_id,
                        email : email,
                        update_at : timerHelper.getDateTimeNowString(),
                        update_by : admin_id,
                    }

                    let tmpData = await SubscriptionGroupStock.addMemberToGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.addPaymentNoteGroup = async function(req, res) {
    console.log("addPaymentNoteGroup");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;                    
                    const group_id = req.body.group_id? req.body.group_id : 0;
                    const start_at = req.body.start_at;
                    const end_at = req.body.end_at;
                    const paid_amount = req.body.paid_amount;
                    const paid_by = req.body.paid_by;
                    const ref_img1 = req.body.ref_img1? req.body.ref_img1 : "";
                    const ref_img2 = req.body.ref_img2? req.body.ref_img2 : "";
                                        
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

                    let objData =
                    {
                        subscription_group_id : group_id,
                        start_at  : start_at ,
                        end_at  : end_at ,
                        update_by   : admin_id  ,
                        update_at   : timerHelper.getDateTimeNowString() ,
                        paid_amount  : paid_amount ,
                        paid_by   : paid_by  ,
                        ref_img1  : ref_img1 ,
                        ref_img2  : ref_img2 ,
                    }
                   
                    let tmpData = await SubscriptionGroup.addPaymentNoteGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.addPaymentNoteGroupStock = async function(req, res) {
    console.log("addPaymentNoteGroupStock");
    
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
            
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    const admin_id = userid;
                    const page_name = req.body.page_name;                    
                    const group_id = req.body.group_id? req.body.group_id : 0;
                    const start_at = req.body.start_at;
                    const end_at = req.body.end_at;
                    const paid_amount = req.body.paid_amount;
                    const paid_by = req.body.paid_by;
                    const ref_img1 = req.body.ref_img1? req.body.ref_img1 : "";
                    const ref_img2 = req.body.ref_img2? req.body.ref_img2 : "";
                                        
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

                    let objData =
                    {
                        subscription_group_id : group_id,
                        start_at  : start_at ,
                        end_at  : end_at ,
                        update_by   : admin_id  ,
                        update_at   : timerHelper.getDateTimeNowString() ,
                        paid_amount  : paid_amount ,
                        paid_by   : paid_by  ,
                        ref_img1  : ref_img1 ,
                        ref_img2  : ref_img2 ,
                    }
                   
                    let tmpData = await SubscriptionGroupStock.addPaymentNoteGroup(objData);
    
                    if (tmpData.errorMessage==null) 
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
                    else
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

exports.deleteById = async function(req, res) {
    
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

                    let tmpData = await SubscriptionGroup.deleteByID(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.deleteStockById = async function(req, res) {
    
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
    
            console.log("deleteSubscriptionGroupStockById")
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

                    let tmpData = await SubscriptionGroupStock.deleteByID(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.deleteMemberFromGroupByID = async function(req, res) {
    
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
    
            console.log("deleteMemberFromGroupByID")
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

                    let tmpData = await SubscriptionGroup.deleteMemberFromGroupByID(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.deleteMemberFromGroupStockByID = async function(req, res) {
    
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
    
            console.log("deleteMemberFromGroupByID")
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

                    let tmpData = await SubscriptionGroupStock.deleteMemberFromGroupByID(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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


exports.deletePaymentHistoryByID = async function(req, res) {
    
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
    
            console.log("deleteMemberFromGroupByID")
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

                    let tmpData = await SubscriptionGroup.deletePaymentHistoryByID(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.deletePaymentHistoryStockByID = async function(req, res) {
    
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
    
            console.log("deletePaymentHistoryStockByID")
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

                    let tmpData = await SubscriptionGroupStock.deletePaymentHistoryByID(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.updateMemberData = async function(req, res) {
    console.log("updateMemberData");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    try {
        const headers = req.headers;
        
        if (!headers.userid || !headers.token) {
            res.status(202).json({status: "error", message: "Missing userid or token", auth: false, data: []});
            return;
        } else {
            const userid = headers.userid;
            const token = headers.token;
            let IsAuth = AdminList.isAuthenicated(userid,token);
            
            if (IsAuth) {
                const admin_id = userid;
                const page_name = req.body.page_name;
                const id = req.body.id;
                const email = req.body.email ? req.body.email : "";
                const password = req.body.password ? req.body.password : "";
                const user_id = req.body.user_id ? req.body.user_id : "";
                const note = req.body.note ? req.body.note : "";
                                        
                let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                if (!adminPagePermission.canEdit) {
                    res.status(200).json({status: "error", message: "Authentication Failed", auth: false, data: []});
                    return;
                }

                let objData = {id: id, email: email, password: password, user_id: user_id, note: note}
                console.log("objData to update:", objData);
                let tmpData = await SubscriptionGroup.updateMemberData(objData);
                console.log("Update result:", tmpData);
    
                if (tmpData.errorMessage==null) {
                    res.status(200).json({status: "success", message: "Member data updated successfully", auth: true});
                } else {
                    res.status(202).json({status: "error", message: tmpData.errorMessage, auth: false, data: []});
                }
            } else {
                res.status(200).json({status: "error", message: "Authentication Failed", auth: false, data: []});
            }
        }
    } catch (error) {
        res.status(202).json({status: "error", message: error.message, auth: false, data: []});
    }
};

exports.updateMemberStockData = async function(req, res) {
    console.log("updateMemberStockData");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    try {
        const headers = req.headers;
        
        if (!headers.userid || !headers.token) {
            res.status(202).json({status: "error", message: "Missing userid or token", auth: false, data: []});
            return;
        } else {
            const userid = headers.userid;
            const token = headers.token;
            let IsAuth = AdminList.isAuthenicated(userid,token);
            
            if (IsAuth) {
                const admin_id = userid;
                const page_name = req.body.page_name;
                const id = req.body.id;
                const email = req.body.email ? req.body.email : "";
                const password = req.body.password ? req.body.password : "";
                const user_id = req.body.user_id ? req.body.user_id : "";
                const note = req.body.note ? req.body.note : "";
                                        
                let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);

                if (!adminPagePermission.canEdit) {
                    res.status(200).json({status: "error", message: "Authentication Failed", auth: false, data: []});
                    return;
                }

                let objData = {id: id, email: email, password: password, user_id: user_id, note: note}
                console.log("objData to update:", objData);
                let tmpData = await SubscriptionGroupStock.updateMemberData(objData);
                console.log("Update result:", tmpData);
    
                if (tmpData.errorMessage==null) {
                    res.status(200).json({status: "success", message: "Member data updated successfully", auth: true});
                } else {
                    res.status(202).json({status: "error", message: tmpData.errorMessage, auth: false, data: []});
                }
            } else {
                res.status(200).json({status: "error", message: "Authentication Failed", auth: false, data: []});
            }
        }
    } catch (error) {
        res.status(202).json({status: "error", message: error.message, auth: false, data: []});
    }
};
