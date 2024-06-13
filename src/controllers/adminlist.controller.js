'use strict';
const jwt = require('jsonwebtoken');

const IpAllowList = require('../models/ipallowlist.model');

const GoogleAuthenticator = require('../modules/GoogleAuthenticator');

const url = require('url');

const Secret = require('../../config/secret');

var crypto = require('crypto'); 

var session = require('express-session');
const { count } = require('console');
const AdminList = require('../models/adminlist.model');

const cryptof = require('../models/cryptof.model');

const speakeasy = require('speakeasy');
const MainModel = require('../models/main.model');
const timerHelper = require('../modules/timehelper');

const StaffGroupSetting = require('../models/staffgroupsetting.model');
const MemberList = require('../models/memberlist.model');

exports.default = async function(req, res) {

    try {
       
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);        
        if (ipBlockList[0].length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            return;
        }
        else
        {
            res.send('admin api');
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

exports.initial = async function(req, res) {

    try {
       
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const SuperWinData = await AdminList.findById('superwin');            
            if (SuperWinData['error']) {
                res.status(200).json(
                    { 
                        status: 'error', 
                        message: SuperWinData['error'],                            
                        data : [],
                    }
                );
                return;
            }
            else if (SuperWinData.length>0  ) 
            {                
                res.status(200).json(
                    { 
                        status: 'error', 
                        message: 'Have data already.',                            
                        data : [],
                    }
                );
                return;
            }
            else
            {
                const salt = await cryptof.getSalt();                                
                const hashPassword = await cryptof.hashPassword('superwinAa',salt.data);
                
                const newUser = {
                    adminName:'superwin',
                    hash : hashPassword.data,
                    salt : salt.data,
                    fullName : 'superwin',
                    status : 1,
                    createdAt : timerHelper.getDateTimeNowString(),
                    createdBy : 'SYSTEM',
                    updatedAt : null,
                    updatedBy : null,
                    am_rank : 4,
                };

                const tmpData = await AdminList.create(newUser);                      
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

            
        }
    } catch (error) {
        console.log(error.message);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,                
                data : [],
            }
        );
        return;
    }
    
   
    
};

exports.findAll = async function(req, res) {
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);        
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const userlist = AdminList.findAll();
            res.json(userlist);
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
            const new_user = new AdminList(req.body);
            //handles null error
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ error: true, message: 'Please provide all required field' });
                return;
            } else {
                const userlist = AdminList.create(new_user);
                res.status(200).json({ error: false, message: "User added successfully!", data: userlist });
                return;
        
                // AdminList.create(new_user, function(err, userlist) {
                //     if (err)
                //         res.send(err);
                //     res.json({ error: false, message: "User added successfully!", data: userlist });
                // });
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

exports.findById = async function(req, res) {
    // AdminList.findById(req.params.id, function(err, userlist) {
    //     if (err)
    //         res.json(err);
    //     res.json(userlist);
    // });    

    

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
            const userlist = AdminList.findById(req.params.id);
            res.status(200).json(userlist);
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

exports.update = async function(req, res) {
   
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
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ error: true, message: 'Please provide all required field' });
                return;
            } else {
                const userlist = AdminList.update(req.params.id, new AdminList(req.body));
                res.status(200).json({ error: false, message: 'User successfully updated' });
                return;
        
                // AdminList.update(req.params.id, new AdminList(req.body), function(err, userlist) {
                //     if (err)
                //         res.send(err);
                //     res.json({ error: false, message: 'User successfully updated' });
                // });
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

exports.delete = async function(req, res) {
      
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
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ error: true, message: 'Please provide all required field' });
                return;
            } else {
                const userlist = await AdminList.delete(req.params.id);
                res.status(200).json({ error: false, message: 'User successfully deleted' });
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

exports.isAuthenicated = async function(req, res) {    

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
            const headers = req.getHeaders();
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });    
                return;        
            } 
            else
            {
                console.log("isAuthenicated");
                const isCorrectToken = await AdminList.isAuthenicated(headers.userid, headers.token);
                if (isCorrectToken) {
                    res.status(200).json({
                        message: "Authentication Correct"
                    });
                    return;
                } else {
                    res.status(202).json({
                        message: "Authentication Incorrect or expired"
                    });
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
   
}

exports.login = async function(req, res) {

    try {
        console.log("Login");
        
        const ipAddress = await IpAllowList.getIPv4Address(req);        
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            return;
        }
        else
        {
            //var key = 'SuperSumohmomo';
            //var encrypted = crypto.createHmac('sha1', key).update(req.body.password).digest('hex');
        
            // console.log("Encrypted");
            // console.log(encrypted);


            const userlist = await AdminList.findById(req.body.userid);
            
            if (userlist) {
                const tmpUser = userlist;

                const hash = await cryptof.hashPassword(req.body.password ,tmpUser['salt']); 
                
                if (tmpUser['hash']!=hash.data) 
                {
                    res.status(202).json({
                        message: "Authentication failed",
                        status:"error",
                    });
                    return;
                }

                let curTime = new Date();
                // let expiredAt = curTime + Secret.ExpiresIn;
                let jwtToken = jwt.sign({
                        userid: tmpUser.adminName,
                    },
                    Secret.SecretKey, {
                        expiresIn: Secret.ExpiresLabel
                });
        
                // console.log(userlist[0].am_username);
                // console.log(jwtToken);
                let pageAuthen = [];

                if (tmpUser.am_rank==4) 
                {
                    //get all page
                    let tmpPageAuthen = await StaffGroupSetting.getAllPage();
                    for (let index = 0; index < tmpPageAuthen.length; index++) {
                        const element = tmpPageAuthen[index];
                        pageAuthen.push(element.page_name);
                    }                    
                }
                else
                {                
                    let AmPermission = await StaffGroupSetting.getPermissionByAmGroup(tmpUser.am_group);                    
                    if (AmPermission.length>0) 
                    {
                        let tmpPermission = AmPermission[0]['permission'];
                        tmpPermission = tmpPermission.replaceAll('[',"");
                        tmpPermission = tmpPermission.replaceAll(']',"");
                        tmpPermission = tmpPermission.replaceAll('"',"'");
                        let tmpPageAuthen = await StaffGroupSetting.getPageByAmPermission(tmpPermission);
                        for (let index = 0; index < tmpPageAuthen.length; index++) {
                            const element = tmpPageAuthen[index];        
                            pageAuthen.push(element.page_name);
                        }
                    }
                    
                }

                const groupData = await AdminList.findByIdWithGroup(req.body.userid);
                
                        
                res.status(200).json({
                    token: jwtToken,
                    createAt: curTime,            
                    expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                    id: tmpUser.id,
                    fullName: tmpUser.am_fullname,
                    am_rank: tmpUser.am_rank,            
                    am_group: tmpUser.am_group,
                    message: "Login is successful.",
                    pageAuthen : pageAuthen,
                    defaultPage : groupData['default_page']??'',
                    am_group_name: groupData['name']??'',
                    status:"success",
                });
                return;
            } else {
                res.status(202).json({
                    message: "Authentication failed",
                    status:"error",
                });
                return;
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
        return;
    }
    


    

    
};

exports.refreshtoken = async function(req, res) {

    try {
        console.log('refresh token');

        // console.log(req.body.userid);
        // console.log(req.body.token);
    
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
            
            let jwtToken = jwt.verify(req.body.token, Secret.SecretKey);
            if (jwtToken.userid) {
                // console.log("Decode userid :", jwtToken.userid); 
    
                if (jwtToken.userid == req.body.userid) {
                    let curTime = new Date();
                    // let expiredAt = curTime + Secret.ExpiresIn;
                    let jwtToken = jwt.sign({
                            userid: req.body.userid,
                        },
                        Secret.SecretKey, {
                            expiresIn: Secret.ExpiresLabel
                        });
            
                    // console.log(req.body.userid);
                    // console.log(jwtToken);
            
                    res.status(200).json({
                        token: jwtToken,
                        createAt: curTime,
                        expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                        id: jwtToken.userid,            
                        message: "Refresh Token is successful.",
                        status:"success",
                    });
                    return;
            
                } else {
                    res.status(202).json({
                        message: "Refresh Token failed",
                        status:"error",
                    });
                    return;
                }
            }else {
                res.status(202).json({
                    message: "Refresh Token failed",
                    status:"error",
                });
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

exports.allowipaddress = async function(req, res) 
{

    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    let password = queryObject.password?queryObject.password:'';     
    if (queryObject.password!='sum0h') 
    {
        res.status(200).json(
            { 
                status: 'error', 
                message: 'Password is incorrect.',                                
            }
        );
        return;
    }
    else
    {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        let tmpData= AdminList.addAllowIPAdddress(ipAddress);
        if (tmpData['affectedRows']) 
        {
            res.status(200).json(
                { 
                    status: 'Add Allow Ip Address : '+ipAddress , 
                    message: '',
                }
            );
            return;
        }
        else
        {
            res.status(202).json(
                { 
                    status: 'error', 
                    message: tmpData.message,                
                }
            );
            return;
        }
    }
    
};

exports.googleAuthen = async function(req, res) {

    try {
        console.log('googleAuthen');
     
        const ipAddress = await IpAllowList.getIPv4Address(req);
     
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            return;
        }
        else
        {
            const otp = req.body.otp;
            const g = new GoogleAuthenticator();
            
            if (otp.length>0) 
            {
                // const chk = await g.checkCode("442M4MGVYZBZZHY3", otp);
                
                var base32secret = 'IISHQRCVI5CU45BUPE7CIURZOUYDM4TVFRGTMORMORBE6NBKAAAA';
                var chk = await speakeasy.totp.verify({ secret: base32secret,
                    encoding: 'base32',
                    token: otp ,
                    window: 6,
                });

                console.log("==============");
                console.log(chk);
                console.log("==============");
                
                if (chk) 
                {
                    res.status(200).json({
                        status:"success",
                    });
                    return;
                }
                else
                {
                    res.status(202).json({                    
                        status:"error",
                    });
                    return;
                }
            }else {
                res.status(202).json({                    
                    status:"error",
                });
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

exports.getGoogleAuthen = async function(req, res) {

    try {
        console.log('googleAuthen');
     
        var secret = await speakeasy.generateSecret();
            res.status(200).json({
                status:"success",
                data : secret,
            });
        return;
             
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

exports.getTime = async function(req, res) {

    try {
        console.log('getTime');

        const time = Math.floor(Date.now() / 1000 / 30);

        res.status(200).json(
            { 
                status: 'success', 
                message: '',
                auth : false,
                data : time,
            }
        );
        return;
       
             
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

exports.changePassword = async function(req, res) {
    
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
            console.log("changePassword")
            //handles null error
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

            
                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid,token);
            

                if (IsAuth) 
                {
                    // let key = 'SuperSumohmomo';

                    // let oldPassword = crypto.createHmac('sha1', key).update(req.body.oldPassword).digest('hex');
                    // let newPassword = crypto.createHmac('sha1', key).update(req.body.newPassword1).digest('hex');

                    // //check old password
                    // let chkPassword =  await MainModel.query(`select * from admins WHERE hash='${oldPassword}' and salt='${userid}' `);
                    // if (chkPassword.length<=0) 
                    // {
                    //     res.status(200).json(
                    //         { 
                    //             status: 'error', 
                    //             message: "Old Password is incorrect",
                    //             auth : false,
                    //             data : [],
                    //         }
                    //     );
                    //     return;
                    // }

                    const userlist = await AdminList.findById(userid);
            
                    if (userlist) {
                        const tmpUser = userlist;
                        const hash = await cryptof.hashPassword(req.body.oldPassword ,userlist['salt']);          
                        const newPassword = await cryptof.hashPassword(req.body.newPassword1 ,userlist['salt']);          
                        
                        if (userlist['hash']!=hash.data) 
                        {
                            res.status(202).json({
                                message: "Old Password is incorrect",
                                status:"error",
                            });
                            return;
                        }

                        let tmpData = await MainModel.update("admins", 
                            {
                                hash : newPassword.data
                            },
                            {
                                adminName : userid
                            }
                        );

                        if (tmpData) 
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
                            res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Have some problem.",
                                auth : false,
                                data : [],
                            }
                            );
                            return;
                        }
                    }
                    else
                    {
                        res.status(202).json({
                            message: "Old Password is incorrect",
                            status:"error",
                        });
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

exports.changePasswordMember = async function(req, res) {
    
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
            console.log("changePasswordMember")
            //handles null error
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required field' });
            } else {

            
                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid,token);
            

                if (IsAuth) 
                {
                    const memberId = req.body.memberId?req.body.memberId:'';
                    const userlist = await MemberList.findById(memberId);
            
                    if (userlist) {
                        const tmpUser = userlist;                        
                        const newPassword = await cryptof.hashPassword(req.body.newPassword ,tmpUser['salt']);          
                    
                        let tmpData = await MainModel.update("sl_users", 
                            {
                                password : newPassword
                            },
                            {
                                id : memberId
                            }
                        );

                        if (tmpData) 
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
                            res.status(200).json(
                            { 
                                status: 'error', 
                                message: "Have some problem.",
                                auth : false,
                                data : [],
                            }
                            );
                            return;
                        }
                    }
                    else
                    {
                        res.status(202).json({
                            message: "Old Password is incorrect",
                            status:"error",
                        });
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

exports.getPagePermission = async function(req, res) {
    
    let pagePermission = {};
    pagePermission['canView'] = 0;
    pagePermission['canEdit'] = 0;
    pagePermission['canDelete'] = 0;
    pagePermission['canAdd'] = 0;
    pagePermission['canApprove'] = 0;                            
    pagePermission['canViewAll'] = 0;

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
            console.log("getPagePermission")
            //handles null error
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            }else {

            
                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid,token);
            
                if (IsAuth) 
                {
                    let admin_id = req.body.admin_id??"";
                    let page_name = req.body.page_name??"";

                    if (admin_id=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "staff_id  is invalid",
                                auth : true,                                
                                data : pagePermission,
                            }
                        );
                        return;                        
                    }

                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name  is invalid",
                                auth : true,                                
                                data : pagePermission,
                            }
                        );
                        return;                        
                    }

                    let adminData = await AdminList.findByIdWithGroup(admin_id);                    
                    if (adminData==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not found admin",
                                auth : true,                                
                                data:pagePermission,
                            }
                            );
                        return;
                    }
                    

                    let tmpData=[];
                    let havePermissionInPage = false;
                    let foundPageId = 0;
                    if (adminData.am_rank==4) 
                    {
                        pagePermission['canView'] = 1;
                        pagePermission['canEdit'] = 1;
                        pagePermission['canDelete'] = 1;
                        pagePermission['canAdd'] = 1;
                        pagePermission['canApprove'] = 1;                            
                        pagePermission['canViewAll'] = 1;

                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,                                                                
                                data : pagePermission,
                            }
                        );
                        return;
                        
                    }                                        
                    else
                    {
                        
                        let tmpPermission = adminData.permission;
                        tmpPermission = tmpPermission.replaceAll('[',"");
                        tmpPermission = tmpPermission.replaceAll(']',"");
                        tmpPermission = tmpPermission.replaceAll('"',"'");
                        let tmpPageAuthen = await StaffGroupSetting.getPageByAmPermission(tmpPermission);
                        for (let index = 0; index < tmpPageAuthen.length; index++) {
                            const element = tmpPageAuthen[index];                                    
                            if (element.page_name==page_name) {                                
                                havePermissionInPage = true;
                                foundPageId = element.id;                                
                                break;
                            }
                        }
                        
                        if (!havePermissionInPage) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: "Not permission for view",
                                    auth : true,                                    
                                    data : pagePermission,
                                }
                                );
                            return;
                        }
                        
                        //check customer permission
                        
                        let customPagePermission = await StaffGroupSetting.getCustomPermissionByAmGroupId(adminData.am_group,foundPageId);                        
                        if (customPagePermission!=null) 
                        {                            
                            pagePermission['canView']    = customPagePermission.can_view1;   
                            pagePermission['canEdit']    = customPagePermission.can_edit1;   
                            pagePermission['canDelete']  = customPagePermission.can_delete1;   
                            pagePermission['canAdd']     = customPagePermission.can_add1;   
                            pagePermission['canApprove'] = customPagePermission.can_approve1;                               
                            pagePermission['canViewAll'] = customPagePermission.can_viewall1;
                        }
                        else
                        {
                            pagePermission['canView'] = 1;
                            pagePermission['canEdit'] = 1;
                            pagePermission['canDelete'] = 1;
                            pagePermission['canAdd'] = 1;
                            pagePermission['canApprove'] = 1;                            
                            pagePermission['canViewAll'] = 1;
                            
                        }

                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,     
                                data : pagePermission,
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
                            data : pagePermission,
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
                data : pagePermission,
            }
        );
        return;
    }

    
    
   
};

exports.getAllAdminActive = async function(req, res) {
    
   

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
            console.log("getAllAdminActive")
            //handles null error
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            }else {

            
                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid,token);
            
                if (IsAuth) 
                {
                    let tmpData = await AdminList.getAllAdminActive();
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