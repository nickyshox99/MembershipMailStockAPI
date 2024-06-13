'use strict';
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const Secret = require('../../config/secret');
const Cryptof = require('../models/cryptof.model');

const AdminList = require('../models/adminlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('../models/main.model');

const timerHelper = require('../modules/timehelper');
const fs = require('fs');
const path = require('path');

exports.uploadFile =  async (req, res) => {
    try
    {
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

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    const uploadedFile = req.file;       

                    if (!req.file ) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'No file uploaded or invalid file data',
                        });
                        return;
                    }

                    const splitExtensionName =uploadedFile.filename.split('.')[1];
                            
                    const destFileName= userid+ (new Date().getTime()).toString() + req.body.tofilename+'.'+splitExtensionName;
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','00tmpfile', uploadedFile.filename);
                    const destinationPath = path.join(__dirname, '..', '..','assets', destFileName );

                    console.log(sourceFilePath);
                    console.log(destinationPath);

                    fs.readFile(sourceFilePath, (err, data) => {
                        if (err) {
                            console.error('Error saving file:', err);
                            return res.status(500).json(
                                {
                                    status : 'error', 
                                    message:  err.message,
                                }
                            );
                        }
                    
                        // Write the file to the destination path
                        fs.writeFile(destinationPath, data, (err) => {
                            if (err) {
                                console.error('Error saving file:', err);
                                return res.status(500).json(
                                    {
                                        status : 'error', 
                                        message:  err.message,
                                    }
                                );
                            }

                            // Remove the source file
                            fs.unlink(sourceFilePath, (err) => {
                                if (err) {
                                    console.error('Error removing source file:', err);
                                    // Handle the error as needed
                                } else {
                                    console.log('Source file removed successfully');
                                }
                            });

                            console.log(Secret.apiDomain+'getfile/'+ destFileName);

                            res.status(200).json(
                            {   status : 'success' ,
                                message: 'File uploaded successfully',
                                url: Secret.apiDomain+'getfile/'+ destFileName,
                            });        
                            return;
                        });

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
                    return;
                }
            }
        }
    } 
    catch (error) {        
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
}

exports.uploadFileAndDeleteOldFile =  async (req, res) => {
    try
    {
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

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    const uploadedFile = req.file;       

                    if (!req.file ) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'No file uploaded or invalid file data',
                        });
                        return;
                    }

                    let oldFilePath = req.body.oldFilePath??'';

                    const splitExtensionName =uploadedFile.filename.split('.')[1];
                            
                    const destFileName= userid+ (new Date().getTime()).toString() + req.body.tofilename+'.'+splitExtensionName;
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','00tmpfile', uploadedFile.filename);
                    const destinationPath = path.join(__dirname, '..', '..','assets', destFileName );

                    console.log(sourceFilePath);
                    console.log(destinationPath);

                    fs.readFile(sourceFilePath, (err, data) => {
                        if (err) {
                            console.error('Error saving file:', err);
                            return res.status(500).json(
                                {
                                    status : 'error', 
                                    message:  err.message,
                                }
                            );
                        }
                    
                        // Write the file to the destination path
                        fs.writeFile(destinationPath, data, (err) => {
                            if (err) {
                                console.error('Error saving file:', err);
                                return res.status(500).json(
                                    {
                                        status : 'error', 
                                        message:  err.message,
                                    }
                                );
                            }

                            // Remove the source file
                            fs.unlink(sourceFilePath, (err) => {
                                if (err) {
                                    console.error('Error removing source file:', err);
                                    // Handle the error as needed
                                } else {
                                    console.log('Source file removed successfully');
                                }
                            });

                            if (oldFilePath!='') {
                                oldFilePath = path.basename(oldFilePath);
                                oldFilePath = path.join(__dirname, '..', '..','assets',oldFilePath);
                                fs.unlink(oldFilePath, (err) => {
                                    if (err) {
                                        console.error('Error removing old file:', err);
                                        // Handle the error as needed
                                    } else {
                                        console.log('Old file removed successfully');
                                    }
                                });
                            }

                            console.log(Secret.apiDomain+'getfile/'+ destFileName);

                            res.status(200).json(
                            {   status : 'success' ,
                                message: 'File uploaded successfully',
                                url: Secret.apiDomain+'getfile/'+ destFileName,
                            });        
                            return;
                        });

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
                    return;
                }
            }
        }
    } 
    catch (error) {        
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
}

exports.deleteFile =  async (req, res) => {
    try
    {
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

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let oldFilePath = req.body.oldFilePath??'';
                    if (oldFilePath!='') {

                        oldFilePath = path.basename(oldFilePath);
                        oldFilePath = path.join(__dirname, '..', '..','assets',oldFilePath);

                        fs.unlink(oldFilePath, (err) => {
                            if (err) {
                                console.error('Error removing old file:', err);
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: err.message,
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                                
                            } else {
                                console.log('Old file removed successfully');
                                res.status(200).json(
                                    {   status : 'success' ,
                                        message: 'File delete successfully',    
                                        auth : true,  
                                        data : [],                  
                                    });        
                                    return;
                            }
                        });
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
    } 
    catch (error) {        
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
}