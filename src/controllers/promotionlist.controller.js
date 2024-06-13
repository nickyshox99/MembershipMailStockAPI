'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const PromotionList = require('../models/promotionsetting.model');
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
            res.send('admin bank api');
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

exports.getPromotion = async function(req, res) {

    try {
        console.log('getPromotion..');
    
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
            const headers = req.headers;
    
            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                // let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (true) 
                {
                    
                    let tmpData = await PromotionList.findAll(req.body.searchword);
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

exports.getActivePromotion = async function(req, res) {

    try {
        console.log('getPromotion..');
    
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
            // const headers = req.headers;
    
            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                // const userid = headers.userid;
                // const token = headers.token;
    
                // let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (true) 
                {
                    
                    let tmpData = await PromotionList.findAllActive(req.body.searchword);
                    
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

exports.getPromotionById = async function(req, res) {

    try {
        console.log('getadminbankbyid');
    
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
    
                let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth)             
                {
                    let tmpData = PromotionList.findById(req.params.Id);                
                    
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
            console.log("insert promotion")
             //handles null error
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
                return;
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    let tmpData = await PromotionList.create(req.body);    
                    if (tmpData['error']) 
                    {
                        res.status(200).json(
                            { 
                                status: 'error', 
                                message: returnDatas['error'],                            
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

exports.updatePromotionById = async function(req, res) {
    
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
            console.log("updatePromotionById")
             //handles null error
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
                return;
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    let tmpData = await PromotionList.updateByID(req.body);
    
                    if (tmpData['error']) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData['error'],
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

exports.deletePromotionById = async function(req, res) {
    
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
            const headers = req.headers;
    
            console.log("deletePromotionById")
             //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
                return;
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = await AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    // console.log('updateadminbankbyid');                    
                    let tmpData = await PromotionList.deleteByID(req.body);
    
                    if (tmpData['error']) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData['error'],
                                auth : false,
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
