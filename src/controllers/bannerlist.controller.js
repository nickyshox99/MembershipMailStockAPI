'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const BannerList = require('../models/bannersetting.model');
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

exports.getBanner = async function(req, res) {
    console.log('get banner..');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        //const ipAllowList = await IpAllowList.findById(ipAddress);            
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
                    
                    let tmpData = await BannerList.findAll(req.body.searchword);
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
        res.status(505).json(
            { 
                status: 'error', 
                message: 'Code Error',
                auth : false,
                data : [],
            }
            );
    }
    

    
};

exports.getActiveBanner = async function(req, res) {
    console.log('get active banner..');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        //const ipAllowList = IpAllowList.findById(ipAddress);    
        
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;

            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                // let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (true) 
                {
                    
                    let tmpData = await BannerList.getAllActive("");
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
        res.status(505).json(
            { 
                status: 'error', 
                message: 'Code Error',
                auth : false,
                data : [],
            }
            );
    }
    

    
};

exports.getBannerById = async function(req, res) {
    console.log('getBannerById');
    
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
                    let tmpData = await BannerList.findById(req.params.Id);                
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

                if (IsAuth) 
                {
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    let tmpData = await BannerList.create(req.body);

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
                            message: "",
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

exports.updateBannerById = async function(req, res) {
    
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
            console.log("updateBannerById")
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
                    let tmpData = await BannerList.updateByID(req.body);

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

exports.deleteBannerById = async function(req, res) {
    
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

            console.log("deleteBannerById")
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
                    //console.log(req.body);            
                    let tmpData = await BannerList.deleteByID(req.body);

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
