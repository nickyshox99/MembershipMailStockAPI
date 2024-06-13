'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const InterestTypeList = require('../models/interesttype.model');
const IpAllowList = require('../models/ipallowlist.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


var session = require('express-session');
const { count } = require('console');

exports.getInterestType = async function(req, res) {

    try {
        console.log('getInterestType');
    
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
                    
                    let tmpData = await InterestTypeList.findAll(req.body.searchword);
                    
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

exports.getActiveInterestType = async function(req, res) {

    try {
        console.log('getActiveInterestType');
    
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
                    
                    let tmpData = await InterestTypeList.findAllActive(req.body.searchword);
                    
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

exports.getInterestTypeById = async function(req, res) {

    try {
        console.log('getInterestTypeById');
    
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
                    let tmpData = await InterestTypeList.findById(req.params.Id);                
                    
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

exports.getInterestPeriod = async function(req, res) {

    try {
        console.log('getInterestPeriod');
    
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
                    
                    let tmpData = await InterestTypeList.getInterestPeriod(req.body.searchword);
                    
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

exports.getCollateralType = async function(req, res) {

    try {
        console.log('getCollateralType');
    
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
                    
                    let tmpData = await InterestTypeList.getCollateralType(req.body.searchword);
                    
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

                    let tmpData = await InterestTypeList.create(req.body);
    
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

                    let tmpData = await InterestTypeList.updateByID(req.body);
    
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

                    let tmpData = await InterestTypeList.deleteByID(req.body);
    
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

