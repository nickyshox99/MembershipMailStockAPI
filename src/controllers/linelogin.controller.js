'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const AdminBankList = require('../models/adminbanklist.model');
const MemberList = require('../models/memberlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const AdminSetting = require('../models/adminsetting.model');
const LineManage = require('../models/linemanage.model');
const NoticeManage = require('../models/noticemanage.model');

const Secret = require('../../config/secret');

const LineLoginLib = require('./../modules/lineloginlib');

const timerHelper = require('../modules/timehelper');
const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

const { count } = require('console');
const MainModel = require('../models/main.model');

exports.default = async function(req, res) {
    try {
        console.log("lineconnect api");
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
            res.send('linelogin');
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
    }

    
    
};

exports.login = async function(req, res) {
    console.log('line login2');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
        
        //console.log("ipBlockList");
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            return;
        }
        else
        {
            let tmpSetting = await AdminSetting.findById("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
                        
            const line_login_lib = new LineLoginLib(linelogin_setting['CLIENT_ID'],linelogin_setting['CLIENT_SECRET'],linelogin_setting['CALLBACK_URL']);
            
            if (req.body.ses_login_accToken_val) 
            {
                //verify
                const accToken = req.body.ses_login_accToken_val;
                const verifyToken = await line_login_lib.verifyToken(accToken);
                if (verifyToken!=null) 
                {
                    const userInfo = await line_login_lib.userProfile(accToken,true);
                    if (userInfo['userId']) 
                    {
                        const tmpData = {
                            line_userid: userInfo['userId'],
                            displayName: userInfo['displayName'],
                        }

                        const tmpUser = await MainModel.query(`
                            select *
                            from sl_users 
                            where line_userid = '${userInfo['userId']}'
                        `
                        );

                        if (tmpUser.length>0) 
                        {
                            const username = tmpUser[0]['id'];
                            if (tmpUser[0]['status']==0) 
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Account is inactive',
                                        auth : false,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: '',
                                    auth : false,
                                    data : 
                                    {
                                        id : tmpUser[0]['id'],
                                        line_id : tmpUser[0]['line_id'],
                                        password : tmpUser[0]['password'],
                                    },
                                }
                            );
                            return;

                        }
                        else
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: "Not found userid : " + userInfo['userId'],
                                    auth : false,
                                    data : [],
                                }
                            );
                            return;
                        }

                    }
                    else
                    {
                        const tmpData = {
                            line_userid: "",
                            displayName: "",
                        }

                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Have some problem in this service.",
                                auth : false,
                                data : tmpData,
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
                            message: 'Line login cannot verify.',
                            auth : false,
                            data : [],                                    
                        }
                    );
                    return;
                }
            }
            else
            {
                
                //new login
                //console.log(req.body.return_uri);
                const stateKey = await line_login_lib.randomToken();       
                //console.log(stateKey);
                const returnUrl = await line_login_lib.authorize(stateKey,req.body.return_uri);
                //console.log(returnUrl);
                await MainModel.insert("linelogin_token",{
                    state_key:stateKey,
                    access_token:'',
                    refresh_token:'',
                    user:'',
                });
                
                if (returnUrl.length>0) 
                {
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : false,
                            data : returnUrl,
                            STATE_KEY : stateKey,
                            CALLBACK_URL: linelogin_setting['CALLBACK_URL'],
                        }
                    );
                    return;
                }
                else
                {
                    res.status(202).json(
                        { 
                            status: 'error', 
                            message: "Have some problem in this service.",
                            auth : false,
                            data : [],                                    
                        }
                    );
                    return;
                }

            }
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.callback = async function(req, res) {
    console.log('callback');
    
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
            let tmpSetting = await AdminSetting.findById("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
            
            //console.log("line call back ");
            const line_login_lib = new LineLoginLib(linelogin_setting['CLIENT_ID'],linelogin_setting['CLIENT_SECRET'],linelogin_setting['CALLBACK_URL']);
            // console.log("req.query");
            // console.log(req.query);
            const dataToken = await line_login_lib.requestAccessToken(req.query , true);
            //console.log("dataToken");
            //console.log(dataToken);
            if (dataToken)
            {
                // if (dataToken['access_token']) 
                // {
                //     req.session.data['ses_login_accToken_val'] = dataToken['access_token'];  
                // }

                // if (dataToken['refresh_token']) 
                // {
                //     req.session.data['ses_login_refreshToken_val'] = dataToken['refresh_token'];
                // }

                // if (dataToken['id_token']) 
                // {
                //     req.session.data['ses_login_userData_val'] = dataToken['user'];                                 
                // }

                await MainModel.update("linelogin_token",
                    {
                        access_token: dataToken['access_token']?dataToken['access_token']:'',
                        refresh_token: dataToken['refresh_token']?dataToken['refresh_token']:'',
                        user: '',
                    }
                    ,
                    {
                        state_key : req.query['state']
                    }
                    ,""
                );

                res.status(200).json(                                            
                       "กลับไปกดปุ่ม Ok เพื่อ Login"                    
                );
                return; 
                
            }
            else
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: '',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.getAccessToken = async function(req, res) {
    console.log('getAccessToken');
    
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
            let tmpSetting = await AdminSetting.findById("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
           
            const statekey = req.body.statekey;
            const tmpData = await MainModel.query("SELECT * FROM linelogin_token WHERE state_key='"+statekey+"'");
            //console.log(tmpData);
            if (tmpData.length>0) 
            {
                res.status(200).json(
                    { 
                        status: 'success', 
                        message: '',
                        auth : false,
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
                        message: 'Not found data',
                        auth : false,
                        data : [],
                    }
                );
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

exports.loginByLineId = async function(req, res) {
    console.log('loginByLineId');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
                
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            return "";
        }
        else
        {
            let tmpSetting = await AdminSetting.findById("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
           
            const line_id = req.body.line_id;
            const line_displayurl = req.body.line_displayurl;

            await MainModel.update("sl_users",{line_displayurl:line_displayurl },{line_userid :line_id });

            const userlist = await MainModel.query("SELECT * FROM sl_users WHERE line_userid='"+line_id+"'");
            
            if (userlist.length>0) 
            {
                
                
                var key = 'SuperSumohmomo';
                await MemberList.updateLastLoginByID(userlist[0].id);

                let curTime = new Date();
                // let expiredAt = curTime + Secret.ExpiresIn;
                let jwtToken = jwt.sign({
                        userid: userlist[0].id,
                    },
                    Secret.SecretKey, {
                        expiresIn: Secret.ExpiresLabel
                    });
        
                // console.log(userlist[0].id);
                // console.log(jwtToken);
        
                res.status(200).json({
                    token: jwtToken,
                    createAt: curTime,            
                    expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                    id: userlist[0].id,
                    mobile_no: userlist[0].mobile_no,
                    fullName: userlist[0].fullname,
                    line_displayurl: userlist[0].line_displayurl,
                    message: "Login is successful.",
                    status:"success",        
                });

                return;
            }
            else
            {
                res.status(202).json({
                    message: "Authentication failed",
                    status:"error",
                });
            }
           
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.registerByLineId = async function(req, res) {
    console.log('registerByLineId');
    
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
            let cTime = new Date();
            cTime = new Date(cTime.getTime() + (offsetTime));

            let mobile_no = req.body.mobile_no?req.body.mobile_no:'';
            let password = req.body.password?req.body.password:'';
            let aff = req.body.aff?req.body.aff:null;
            let bank_acc_no = req.body.bank_acc_no?req.body.bank_acc_no:'';
            let bank_id = req.body.bank_id?req.body.bank_id:1;
            let knowus = req.body.knowus?req.body.knowus:'';
            let fullname = req.body.fullname?req.body.fullname:'';
            let line_id = req.body.line_id?req.body.line_id:'';
            let line_displayurl = req.body.line_displayurl?req.body.line_displayurl:'https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png';
            
            // let checkNumber = await MemberList.findById(mobile_no);                    
            // if (checkNumber.length>0) 
            // {
            //     res.status(200).json(
            //         { 
            //             status: 'error', 
            //             message: 'This number is used register.',
            //             auth : true,
            //             data : [],
            //         }
            //         );

            //     return;
            // }

            

            let checkLineAcc = await MainModel.query(`SELECT * FROM sl_users WHERE line_userid ='${line_id}' `);
            if (checkLineAcc.length>0) {

                await MainModel.update("sl_users",{line_displayurl:line_displayurl },{line_userid :line_id });

                const userdata = checkLineAcc[0];

                let curTime = new Date();
                let jwtToken = jwt.sign({
                    userid: userdata.id,
                },
                Secret.SecretKey, {
                    expiresIn: Secret.ExpiresLabel
                });
        
                res.status(200).json({
                    token: jwtToken,
                    createAt: curTime,            
                    expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                    id: userdata.id,
                    mobile_no: userdata.mobile_no,
                    fullName: userdata.fullname,          
                    line_displayurl: userdata.line_displayurl,          
                    message: "Login is successful.",
                    status:"success",        
                });
                return;
            }

            // let checkBankAcc = await MainModel.query(`SELECT id FROM sl_users WHERE bank_acc_no='${bank_acc_no}' `);
            // if (checkBankAcc.length>0) {
            //     res.status(200).json(
            //         { 
            //             status: 'error', 
            //             message: 'This bank account number is used register.',
            //             auth : true,
            //             data : [],
            //         }
            //         );
            //     return;
            // }

            // let checkTelNo = await MainModel.query(`SELECT id FROM sl_users WHERE mobile_no='${mobile_no}' `);
            // if (checkTelNo.length>0) {
            //     res.status(200).json(
            //         { 
            //             status: 'error', 
            //             message: 'This mobile number is used register.',
            //             auth : true,
            //             data : [],
            //         }
            //         );
            //     return;
            // }

            const prefix= "cb";
            let resultAPI = {};
            let username = '';
            let x = false;
            let round = 0;
            while (x===false && round < 5 ) {        
                username = await MemberList.generateMemberID(prefix,6);                       
                if (!await MemberList.isDuplicateUsername(prefix+username)) 
                {   
                    await MemberList.increaseRunningID();
                    x=true;
                }
                round++;
            }

            if (round>=5) 
            {
                res.status(200).json(
                { 
                    status: 'error', 
                    message: 'Cannot create new user.',
                    auth : true,
                    data : [],
                }
                );
                return;
            }

            username = prefix+username;

            let objData = {};

            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let charactersLength =  characters.length;
            let randomString = '';
            
            for (let index = 0; index < 6; index++) {                        
                randomString += characters[Math.floor(Math.random() * (charactersLength - 1))];
            }                    

            let tmpBankInfo = await AdminBankList.getBankInfoByBankID(bank_id);
            let bank_name = tmpBankInfo.bank_name;
            
            objData["codefree"] = randomString+"-"+ mobile_no;

            console.log("codefree :"+ objData["codefree"]);
            console.log("new username :"+username);

            objData.id = username;
            objData.uid = '';
            objData.mobile_no = mobile_no;
            objData.password = password;
            objData.lineid = '';
            objData.fullname = fullname;

            objData.bank_name = bank_name;
            objData.bank_id = bank_id;
            objData.bank_acc_no = bank_acc_no;

            objData.agent = "";
            objData.prefix = "";
            
            objData.turn =0;
            objData.bet =0;
            objData.credit =0;
            objData.credit_free =0;
            objData.credit_aff =0;
            objData.accept_promotion  =0 ;
            objData.last_check_aff = timerHelper.convertDatetimeToString(cTime);
            objData.create_at = timerHelper.convertDatetimeToString(cTime);
            objData.last_login = timerHelper.convertDatetimeToString(cTime);
            objData.aff = aff;

            objData.ticket_wheel  =0 ;
            objData.ticket_wheel_used  =0 ;
            objData.ticket_card  =0 ;
            objData.ticket_card_used  =0 ;
            objData.rank  = 999 ;
            objData.rank_note  ='' ;

            objData.game_login = null;
            objData.status = 1;
            objData.user_status = 'ยังไม่พร้อมใช้งาน';
            objData.knowus = knowus;

            objData.alias_id = '';
            objData.alias_credit = 0;
            objData.accept_promotion = 0;

            objData.line_userid = line_id;
            objData.line_displayurl = line_displayurl;
            
            console.log("MemberList.register");                    
            let tmpData = await MemberList.register(objData);

            if (tmpData) 
            {

                const lineSetting = await AdminSetting.findById("line_token");
                if (lineSetting) {
                    const token = JSON.parse(lineSetting.value);
                    const line_token = token['Register'];
            
                    let msgformat = "";
                    msgformat += "═════════════\n";
                    msgformat += "❄ สมัครสมาชิกใหม่ ❄\n";                            
                    msgformat += "Username : " + username + "\n";
                    msgformat += "ชื่อ : " + fullname + "\n";
                    msgformat += "เบอร์มือถือ : " + mobile_no + "\n";                            
                    msgformat += "ธนาคาร " + bank_name + " \n";
                    msgformat += "เลขบัญชี " + bank_acc_no + "  \n";                            
                    msgformat += "ip : " + ipAddress + "\n";
                    msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                    msgformat += "═════════════\n";

                    let response = "";
                    if (line_token) {
                        response = await LineManage.sendNotify(line_token, msgformat);
                    }
                }
                
                let userdata = await  MemberList.findById(username);
                NoticeManage.createAdmin(userdata, 'success', '', 'สมัครสมาชิกเรียบร้อยแล้ว' + timerHelper.convertDatetimeToString(cTime), '', 1);     
                                          
                let curTime = new Date();
                let jwtToken = jwt.sign({
                    userid: userdata.id,
                },
                Secret.SecretKey, {
                    expiresIn: Secret.ExpiresLabel
                });
        
                res.status(200).json({
                    token: jwtToken,
                    createAt: curTime,            
                    expireAt: new Date(new Date(curTime).getTime() + (Secret.ExpiresIn*1000) ) , 
                    id: userdata.id,
                    mobile_no: userdata.mobile_no,
                    fullName: userdata.fullname,                
                    line_displayurl: userdata.line_displayurl,          
                    message: "Login is successful.",
                    status:"success",        
                });

                // res.status(200).json(
                //     { 
                //         status: 'success', 
                //         message: '',
                //         auth : true,
                //     }
                // );
                return;
            }
            else
            { 
                res.status(200).json(
                { 
                    status: 'error', 
                    message: "Can't Register Member ",
                    auth : false,
                    data : [],
                }
                );
            }           
           
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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

exports.updateLineIdWithAccount = async function(req, res) {
    console.log('updateLineIdWithAccount');
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
            // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
        
        console.log("ipBlockList");
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            let tmpSetting = await AdminSetting.findById("line_login");
            let linelogin_setting = JSON.parse(tmpSetting['value']);      
            
            if (linelogin_setting['enable']==0) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Line login is not available service.',
                        auth : false,
                        data : [],
                    }
                );
                return;
            }
                       
            const tmpData = await MemberList.updateLineIdByID(req.body);
            
            if (tmpData['affectedRows']) 
            {
                res.status(200).json(
                    { 
                        status: 'success', 
                        message: 'Update Successful',
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
                        auth : true,                            
                    }
                );
            }
           
        }
    } catch (error) {
        console.log(error);
        res.status(505).json(
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