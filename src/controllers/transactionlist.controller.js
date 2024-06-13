'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const AdminSetting = require('../models/adminsetting.model');
const MemberList = require('../models/memberlist.model');
const TransactionList = require('../models/transactionlist.model');
const TransactionManage = require('../models/transactionmanage.model');
const IpAllowList = require('../models/ipallowlist.model');
const Cryptof = require('../models/cryptof.model');
const LogList = require('../models/loglist.model');
const NoticeManage = require('../models/noticemanage.model');
const LineManage = require('../models/linemanage.model');
//const AgentMain = require('../models/agentapi/agentmain.model');
const SCBModel = require('../models/scb.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


var session = require('express-session');
const { count } = require('console');
const MainModel = require('../models/main.model');
const timerHelper = require('../modules/timehelper');
const SCB_App_lib = require('./../modules/scbapplib');
const KPlusClass = require('./../modules/kplusclass');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

exports.default = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);   
        
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            return;
        }
        else
        {
            res.send('transaction api');
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

exports.test = async function(req, res) {
    console.log("transaction test");
    res.send('transaction test');
}

exports.getWaitWithdrawTransaction = async function(req, res) {

    try {
        console.log('getwaitwithdrawtransaction');
    
        const ipAddress = await IpAllowList.getIPv4Address(req);
        
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        
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
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                
                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    
                    let tmpData = await TransactionList.getWaitWithdrawTransaction(req.body.searchword);
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

exports.countWaitWithdrawTransaction = async function(req, res) {

    try {
        console.log('countWaitWithdrawTransaction');
    
        const ipAddress = await IpAllowList.getIPv4Address(req);
        
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        
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
                    
                    let tmpData = await TransactionList.countWaitWithdrawTransaction(req.body.searchword);
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

exports.getWaitDepositTransaction = async function(req, res) {

    try {
        console.log('getwaitdeposittransaction');
    
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        
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
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    
                    let tmpData = await TransactionList.getWaitDepositTransaction(req.body.searchword);
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

exports.approveAutoWaitWithdrawTransactionById = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
            return;
        }
        else
        {
            console.log("approveAutoWaitWithdrawTransactionById")
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
                    if (!req.body.withdrawPIN) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Withdraw PIN is Correct',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }

                    let checkPIN = await TransactionList.getWithdrawPIN(req.body.withdrawPIN); 
                    if (checkPIN.length<=0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Withdraw PIN is Correct',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
    
                    //Check Transaction
                    let checkTrans = await TransactionList.getTransactionById(req.body.id);
                    if (checkTrans.length>0) 
                    {
                        if (checkTrans[0].approve_status!=null)
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Transaction is approved',
                                    auth : true,
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
                                message: 'Not Found Transaction',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
    
                    let row_user = await MemberList.findById(req.body.mobile_no);

                    let row_admin = await AdminList.findById(req.body.approve);
                    let admin_banks = await  MainModel.queryFirstRow(`select *
                        from admin_bank
                        where status = 1 and (bank_id = 5 or bank_id = 1) and (bank_type = 'WITHDRAW' or bank_type = 'BOTH') and (work_type = 'NODE' or work_type='DECIMAL_NODE' OR work_type='IBK') 
                    `);
    
                    //Auto Transfer
                    
                    if (admin_banks) 
                    {                    
                        
    
                        let metadata = JSON.parse(admin_banks.meta_data);
                        admin_banks['meta_data'] = metadata;

                        let admin_info = admin_banks;
    
                        if (admin_banks.bank_id==5) 
                        {                        
                            //checkTrans

                            //SCB
                            let amount 	= req.body.credit;
                            let acc 	= req.body.bank_acc_no;
                            let bankinfo = await MainModel.getBankInfo(row_user.bank_id);
                            let bank_id = "";
                            if (!bankinfo.scb_id) 
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Not Found Bank Code',
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            else
                            {
                                bank_id = bankinfo.scb_id;
                                let token = admin_banks['meta_data']['scb_app_token'] ? Cryptof.decryption(admin_banks['meta_data']['scb_app_token']) : "";    
                                const scb_app_lib = new SCB_App_lib();

                                console.log("transferAuto");
                                console.log(token,admin_banks['bank_acc_number'],acc,bank_id,amount);

                                let resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                let data = [];
                                let i = 0;

                                // console.log(resp.data);
                                if (resp['status'] && resp['status']!='error')  
                                {
                                    if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                    {          
                                        admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                        await SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);        
                                        console.log(admin_info['bank_acc_number'] + "Auto Transfer Login : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                    }
                                    else
                                    {
                                        console.log("Auto Transfer New Login");                                        
                                        token = "";										

                                        let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                        let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
                                            
                                        token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);
                                        
                                        if (token) 
                                        {                                            
                                            admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);                                            
                                            resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                            console.log(resp.data);
                                            if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                            {
                                                admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                            }                                            
                                            await SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);                                            
                                            console.log(admin_info['bank_acc_number'] + " : Auto Transfer Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");                                            
                                        }
                                        else
                                        {                                            
                                            console.log('Login Failed '+ admin_info['bank_acc_number']);
                                            res.status(202).json(
                                                { 
                                                    status: 'error', 
                                                    message: 'โอนเงินออกอัตโนมัติไม่สำเร็จ : '+ 'Login Failed '+ admin_info['bank_acc_number'],
                                                    auth : true,
                                                    data : [],
                                                }
                                            );
                                            return;
                                        }
                                    }
                                }
                                else
                                {                                    
                                    console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
                                    res.status(202).json(
                                        { 
                                            status: 'error', 
                                            message: 'โอนเงินออกอัตโนมัติไม่สำเร็จ : '+ 'Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message,
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }

                                
                                let response = await scb_app_lib.TransferAuto(token,admin_banks['bank_acc_number'],acc,bank_id,amount);
                                if(response['status'] == "success")
                                {                                
                                    req.body.am_bank_bank_acc =admin_banks['bank_acc_number'];
                                    req.body.am_bank_name  =admin_banks['bank_acc_name'];
                                    req.body.am_bank_bank  =admin_banks['bank_name'];
    
                                    //Update Transaction
                                    let tmpData = await TransactionList.approveAutoWaitWithdrawTransactionById(req.body);
                                    if (tmpData) 
                                    {
    
                                        //Insert Notice
                                        if (row_user) 
                                        {                                        
                                            NoticeManage.createAdmin(row_user,"success","อนุมัติถอนเงินแล้ว"
                                            ,'รหัสทำรายการ : '+ req.body.id
                                            ,'',1
                                            );
    
                                            NoticeManage.createMember(row_user,"success","อนุมัติถอนเงินแล้ว"
                                            ,'รหัสทำรายการ : '+ req.body.id
                                            ,'',1
                                            );
                                        }
    
                                        //Send Line Message
                                        let line_token ="";
                                        if (true)
                                        {
                                            let tmp = await AdminSetting.findById("line_token");
                                            let lineMeta = JSON.parse(tmp.value);
                                            line_token = lineMeta['Withdraw'];
                                        }
                                        else
                                        {
                                            let tmp = await MainModel.queryFirstRow(`
                                                select IFNULL(line_token,'') as line_token 
                                                from agent_account 
                                                where agent in (SELECT agent FROM sl_users WHERE id='${row_user['id']}') 
                                            `);
    
                                            let lineMeta = JSON.parse(tmp.line_token);
                                            line_token = lineMeta['Withdraw'];
                                        }

                                        let cTime = new Date();
                                        cTime = new Date(cTime.getTime() + (offsetTime));
                                        
                                        if (line_token!="") 
                                        {
                                            let tmp = await AdminSetting.findById("withdrawmessage");
                                            if (tmp) 
                                            {
                                                let tmpFormat = JSON.parse(tmp.value);
                                                let tag_value = 
                                                {
                                                    "<@userid>"     : row_user['id'],
                                                    "<@fullname>"   : row_user['fullname'],
                                                    "<@telno>"      : row_user['mobile_no'],
                                                    "<@bankaccno>"  : row_user['bank_acc_no'],
                                                    "<@bankname>"   : row_user['bank_name'],
                                                    "<@amount>" 	: amount,
                                                    "<@date>" 		: timerHelper.convertDatetimeToString(cTime),
                                                    "<@approveby>"  : row_admin['am_username'],
                                                };
        
                                                for (const [key, value] of Object.entries(tag_value)) 
                                                {
                                                    tmpFormat = tmpFormat.replaceAll(key,value);
                                                }
                                                LineManage.sendNotify(token,tmpFormat);
                                            }
                                            else
                                            {
                                                let tmpFormat = "";
                                                tmpFormat +='═════════════\n';
                                                tmpFormat +='🙁 ถอนสำเร็จ 🙁\n';
                                                tmpFormat +='\n';
                                                tmpFormat +='😡 ถอนจำนวน: '+amount+' 😡\n';
                                                tmpFormat +='\n';
                                                tmpFormat +='Username : '+row_user['id'];
                                                tmpFormat +='เบอร์มือถือ : '+row_user['mobile_no'];
                                                tmpFormat +='ชื่อ : '+row_user['fullname'];
                                                tmpFormat +='เลขบัญชี : '+row_user['bank_acc_no'];
                                                tmpFormat +='ธนาคาร : '+row_user['bank_name'];
                                                tmpFormat +='วันที่ : '+ timerHelper.convertDatetimeToString(cTime);
                                                tmpFormat +='═════════════\n';
                                                LineManage.sendNotify(token,tmpFormat);
                                            }
                                        }
                                        //Insert Log
                                        LogList.create("อนุมัติถอนเงิน "+req.body.id,req.body.approve,timerHelper.convertDatetimeToString(new Date()));
    
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
                                            message: tmpData.message,
                                            auth : true,
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
                                            message: 'โอนเงินออกอัตโนมัติไม่สำเร็จ : '+response['message'],
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                            }
                        }
                        else if (admin_banks.bank_id==1) 
                        {
                            //KBANK
                            //SCB
                            let amount 	= req.body.credit;
                            let acc 	= req.body.bank_acc_no;
                            let bankinfo = await MainModel.getBankInfo(row_user.bank_id);
                            let bank_id = "";                            
                            if (bankinfo==[])
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Not Found Bank Code',
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            else
                            {
                                bank_id = bankinfo['kbank_id'];
                                const url = admin_banks['meta_data']['url'] ? Cryptof.decryption(admin_banks['meta_data']['url']) : "";
                                                                
                                let bank_code = bank_id.toString().padStart(3, "0");
                                let kPlus =new KPlusClass();
                                let response = await kPlus.KbankTransferAuto(url , bank_code ,acc,amount );

                                if(response['status'] == "success")
                                {                                
                                    req.body.am_bank_bank_acc = admin_banks['bank_acc_number'];
                                    req.body.am_bank_name  = admin_banks['bank_acc_name'];
                                    req.body.am_bank_bank  = admin_banks['bank_name'];
    
                                    //Update Transaction
                                    let tmpData = await TransactionList.approveAutoWaitWithdrawTransactionById(req.body);
                                    if (tmpData) 
                                    {
                                        let row_user = await MemberList.findById(req.body.mobile_no);
    
                                        //Insert Notice
                                        if (row_user) 
                                        {                                        
                                            NoticeManage.createAdmin(row_user,"success","อนุมัติถอนเงินแล้ว"
                                            ,'รหัสทำรายการ : '+ req.body.id
                                            ,'',1
                                            );
    
                                            NoticeManage.createMember(row_user,"success","อนุมัติถอนเงินแล้ว"
                                            ,'รหัสทำรายการ : '+ req.body.id
                                            ,'',1
                                            );
                                        }
    
                                        //Send Line Message
                                        let line_token ="";
                                        if (true)
                                        {
                                            let tmp = await AdminSetting.findById("line_token");
                                            let lineMeta = JSON.parse(tmp.value);
                                            line_token = lineMeta['Withdraw'];
                                        }
                                        else
                                        {
                                            let tmp = await MainModel.queryFirstRow(`
                                                select IFNULL(line_token,'') as line_token 
                                                from agent_account 
                                                where agent in (SELECT agent FROM sl_users WHERE id='${row_user['id']}') 
                                            `);
    
                                            let lineMeta = JSON.parse(tmp.line_token);
                                            line_token = lineMeta['Withdraw'];
                                        }

                                        let cTime = new Date();
                                        cTime = new Date(cTime.getTime() + (offsetTime));
                                        
                                        if (line_token!="") 
                                        {
                                            let tmp = await AdminSetting.findById("withdrawmessage");
                                            if (tmp) 
                                            {
                                                let tmpFormat = JSON.parse(tmp.value);
                                                let tag_value = 
                                                {
                                                    "<@userid>"     : row_user['id'],
                                                    "<@fullname>"   : row_user['fullname'],
                                                    "<@telno>"      : row_user['mobile_no'],
                                                    "<@bankaccno>"  : row_user['bank_acc_no'],
                                                    "<@bankname>"   : row_user['bank_name'],
                                                    "<@amount>" 	: amount,
                                                    "<@date>" 		: timerHelper.convertDatetimeToString(cTime),
                                                    "<@approveby>"  : row_admin['am_username'],
                                                };
        
                                                for (const [key, value] of Object.entries(tag_value)) 
                                                {
                                                    tmpFormat = tmpFormat.replaceAll(key,value);
                                                }
                                                LineManage.sendNotify(token,tmpFormat);
                                            }
                                            else
                                            {
                                                let tmpFormat = "";
                                                tmpFormat +='═════════════\n';
                                                tmpFormat +='🙁 ถอนสำเร็จ 🙁\n';
                                                tmpFormat +='\n';
                                                tmpFormat +='😡 ถอนจำนวน: '+amount+' 😡\n';
                                                tmpFormat +='\n';
                                                tmpFormat +='Username : '+row_user['id'];
                                                tmpFormat +='เบอร์มือถือ : '+row_user['mobile_no'];
                                                tmpFormat +='ชื่อ : '+row_user['fullname'];
                                                tmpFormat +='เลขบัญชี : '+row_user['bank_acc_no'];
                                                tmpFormat +='ธนาคาร : '+row_user['bank_name'];
                                                tmpFormat +='วันที่ : '+ timerHelper.convertDatetimeToString(cTime);
                                                tmpFormat +='═════════════\n';
                                                LineManage.sendNotify(token,tmpFormat);
                                            }
                                        }
                                        //Insert Log
                                        LogList.create("อนุมัติถอนเงิน "+req.body.id,req.body.approve,timerHelper.convertDatetimeToString(new Date()));
    
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
                                            message: tmpData.message,
                                            auth : true,
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
                                            message: 'โอนเงินออกอัตโนมัติไม่สำเร็จ : '+response['message'],
                                            auth : true,
                                            data : [],
                                        }
                                    );
                                    return;
                                }
                            }
                        }
    
                    }
                    else
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'No Have Bank for Withdraw',
                                auth : true,
                                data : [],
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

exports.approveManaulWaitWithdrawTransactionById = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("approveManaulWaitWithdrawTransactionById")
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
                    // console.log("Check Pin");
                    // let checkPIN =TransactionList.getWithdrawPIN(req.body.withdrawPIN); 
                    // if (count(checkPIN)==0) 
                    // {
                    //     res.status(202).json(
                    //         { 
                    //             status: 'error', 
                    //             message: 'Withdraw PIN is Correct',
                    //             auth : true,
                    //             data : [],
                    //         }
                    //     );
                    //     return;
                    // }
    
                    //Check Transaction
                    // console.log("Check Transaction");
                    let checkTrans = await TransactionList.getTransactionById(req.body.id);
                    let row_admin = await AdminList.findById(req.body.approve);
                    if (checkTrans.length>0) 
                    {
                        if (checkTrans[0].approve_status!=null)
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Transaction is approved',
                                    auth : true,
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
                                message: 'Not Found Transaction',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
    
                    console.log(req.body.mode);
    
                    if (req.body.mode=="cancel") 
                    {
                         //Update Transaction
                         let tmpData = await TransactionList.approveManaulWaitWithdrawTransactionById(req.body);
                         if (tmpData) 
                         {
     
                             let row_user = await MemberList.findById(req.body.mobile_no); 
                             //Insert Notice
                             if (row_user) 
                             {                                        
                                 NoticeManage.createAdmin(row_user,"success","ไม่อนุมัติ (ไม่คืนเงิน)"
                                 ,'รหัสทำรายการ : '+ req.body.id
                                 ,'',1
                                 );
     
                                 NoticeManage.createMember(row_user,"success","ไม่อนุมัติ (ไม่คืนเงิน)"
                                 ,'รหัสทำรายการ : '+ req.body.id
                                 ,'',1
                                 );
                             }
    
                             //Reset หลังถอนเงินเสร็จ
                             await MainModel.update("sl_users",{bet:0,turn:0,accept_promotion:0},{id:row_user['id']});
                             await MainModel.update("meta_promotion",{status:0},{username:row_user['id']});
                                                      
     
                             //Insert Log
                             LogList.create("ไม่อนุมัติ (ไม่คืนเงิน) โดย "+req.body.id,req.body.approve,timerHelper.convertDatetimeToString(new Date()));
     
                             res.status(200).json(
                                 { 
                                     status: 'success', 
                                     message: 'ยกเลิกสำเร็จ',
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
                                 message: tmpData.message,
                                 auth : true,
                                 data : [],
                             }
                             );
                             return;
                         }
                    }
                    else if (req.body.mode=="manualconfirm") 
                    {
                         //Update Transaction
                        let tmpData = await TransactionList.approveManaulWaitWithdrawTransactionById(req.body);
                        if (tmpData) 
                        {
    
                            let row_user = await MemberList.findById(req.body.mobile_no);
    
                            //Insert Notice
                            if (row_user) 
                            {                                        
                                NoticeManage.createAdmin(row_user,"success","อนุมัติ (Manual)"
                                ,'รหัสทำรายการ : '+ req.body.id
                                ,'',1
                                );
    
                                NoticeManage.createMember(row_user,"success","อนุมัติ (Manual)"
                                ,'รหัสทำรายการ : '+ req.body.id
                                ,'',1
                                );
                            }
    
                            //Send Line Message
                            let line_token ="";
                            if (true)
                            {
                                let tmp = AdminSetting.findById("line_token");
                                let lineMeta = JSON.parse(tmp.value);
                                line_token = lineMeta['Withdraw'];
                            }
                            else
                            {
                                let tmp = await  MainModel.queryFirstRow(`
                                    select IFNULL(line_token,'') as line_token 
                                    from agent_account 
                                    where agent in (SELECT agent FROM sl_users WHERE id='${row_user['id']}') 
                                `);
    
                                let lineMeta = JSON.parse(tmp.line_token);
                                line_token = lineMeta['Withdraw'];
                            }

                            let cTime = new Date();
                            cTime = new Date(cTime.getTime() + (offsetTime));
                            
                            if (line_token!="") 
                            {
                                let tmp = await AdminSetting.findById("withdrawmessage");
                                if (tmp) 
                                {
                                    let tmpFormat = JSON.parse(tmp.value);
                                    let tag_value = 
                                    {
                                        "<@userid>"     : row_user['id'],
                                        "<@fullname>"   : row_user['fullname'],
                                        "<@telno>"      : row_user['mobile_no'],
                                        "<@bankaccno>"  : row_user['bank_acc_no'],
                                        "<@bankname>"   : row_user['bank_name'],
                                        "<@amount>" 	: amount,
                                        "<@date>" 		: timerHelper.convertDatetimeToString(cTime),
                                        "<@approveby>"  : row_admin['am_username'],
                                    };
    
                                    for (const [key, value] of Object.entries(tag_value)) 
                                    {
                                        tmpFormat = tmpFormat.replaceAll(key,value);
                                    }
                                    LineManage.sendNotify(token,tmpFormat);
                                }
                                else
                                {
                                    let tmpFormat = "";
                                    tmpFormat +='═════════════\n';
                                    tmpFormat +='🙁 ถอนสำเร็จ (Manual) 🙁\n';
                                    tmpFormat +='\n';
                                    tmpFormat +='😡 ถอนจำนวน: '+amount+' 😡\n';
                                    tmpFormat +='\n';
                                    tmpFormat +='Username : '+row_user['id'];
                                    tmpFormat +='เบอร์มือถือ : '+row_user['mobile_no'];
                                    tmpFormat +='ชื่อ : '+row_user['fullname'];
                                    tmpFormat +='เลขบัญชี : '+row_user['bank_acc_no'];
                                    tmpFormat +='ธนาคาร : '+row_user['bank_name'];
                                    tmpFormat +='วันที่ : '+ timerHelper.convertDatetimeToString(cTime);
                                    tmpFormat +='═════════════\n';
                                    LineManage.sendNotify(token,tmpFormat);
                                }
                            }
    
                            //Insert Log
                            LogList.create("อนุมัติ (Manual) โดย "+req.body.id,req.body.approve,timerHelper.convertDatetimeToString(new Date()));
    
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
                                message: tmpData.message,
                                auth : true,
                                data : [],
                            }
                            );
                            return;
                        }
                    }
                    else if (req.body.mode=="refund") 
                    {
                        
                        let credit 	= req.body.credit;
                        let username = req.body.username;
                        let row_user = await MemberList.findById(req.body.mobile_no,"");
                        let row_admin = await AdminList.findById(req.body.approve);
    
                        let idReq = await TransactionList.generateRequestID();
                        let oldusername= row_user['id'];
    
                        if (row_user['accept_promotion']>0) 
                        {							
                            row_user['id']	= row_user['alias_id'];
                        }	
    
                        row_user['id'] = oldusername;
    
                        // console.log("Create Transaction");
                        let tmpData = await TransactionManage.create(idReq,row_user,"SYSTEM",credit,0,row_user.credit,row_user.credit + credit,"REF",row_user.bank_acc_no,row_user.bank_name
                        ,null,"",null,null,"",row_admin['am_fullname'],1
                        ,timerHelper.convertDatetimeToString(new Date()),0,timerHelper.convertDatetimeToString(new Date())
                        ,"ปฏิเสธ การถอนและคืนเงิน โดย " + row_admin['am_fullname']
                        ,null,null,null,null,null,0); 

                        if (tmpData) 
                        {                            
                            await MemberList.increaseCredit(row_user['id'],credit);

                            tmpData = await TransactionList.approveManaulWaitWithdrawTransactionById(req.body);
                            if (tmpData) 
                            {
                                //Insert Notice
                                if (row_user) 
                                {                                        
                                    NoticeManage.createAdmin(row_user,"success","ไม่อนุมัติการถอนเงิน และคืนเงิน"
                                    ,'รหัสทำรายการ : '+ req.body.id
                                    ,'',1
                                    );
        
                                    NoticeManage.createMember(row_user,"success","ไม่อนุมัติการถอนเงิน และคืนเงิน"
                                    ,'รหัสทำรายการ : '+ req.body.id
                                    ,'',1
                                    );
                                }
        
                                                                                        
        
                                //Insert Log
                                LogList.create("ไม่อนุมัติการถอนเงิน และคืนเงิน โดย "+req.body.id,req.body.approve,timerHelper.convertDatetimeToString(new Date()));
        
                                res.status(200).json(
                                    { 
                                        status: 'success', 
                                        message: 'ยกเลิกและคืนเงินให้ '+ username +' จำนวน '+credit + 'สำเร็จ',
                                        auth : true,
                                    }
                                );
                                return true;
                            }
                             else
                             { 
                                 res.status(202).json(
                                 { 
                                     status: 'error', 
                                     message: tmpData.message,
                                     auth : true,
                                     data : [],
                                 }
                                 );
                                 return true;
                            }
                        }
                        else
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: tmpData.message,
                                    auth : true,
                                    data : [],
                                }
                                );
                            return;
                        }
    
                        
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
                    return true;
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
        return true;
    }

   

    
   
};

exports.updateWaitDepositTransactionById = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);        
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("updateWaitDepositTransactionById")
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
                    let checkTrans = await TransactionList.getTransactionById(req.body.id);
                    if (checkTrans.length>0) 
                    {
                        if (checkTrans[0].approve_status!=null)
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Transaction is approved',
                                    auth : true,
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
                                message: 'Not Found Transaction',
                                auth : true,
                                data : [],
                            }
                        );
                        return;
                    }
    
                    if (req.body.mode=="approve") 
                    {
                        let selectedUsername= "";
                        let row_user = [];
                        
                        //check user
                        if (req.body.transaction_type == "DEPMAN") 
                        {
                            selectedUsername = req.body.selectedUsername;                        
                        }
                        else if (req.body.transaction_type == "DEPNL") 
                        {
                            selectedUsername = req.body.selectedUsername;                        
                        }
                        else
                        {
                            selectedUsername = req.body.username;                        
                        }
    
                        row_user = await MemberList.findById(selectedUsername);
    
                        if (row_user.length<=0) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Not Found User : '+selectedUsername,
                                    auth : true,
                                    data : [],
                                }
                            );
                            return;
                        }
    
                        let oldusername = row_user['id'];
                        if (row_user['accept_promotion']>0) 
                        {							
                            row_user['id']	= row_user['alias_id'];
                        }	
    
                        let credit = parseFloat(req.body.credit);
                        row_user['id'] = oldusername;

                        req.body.approve_status = 1;
                        req.body.approve_date = timerHelper.convertDatetimeToString(new Date());
                        
                        req.body.agent = row_user['agent'];
                        req.body.username = row_user['id'];
                        req.body.uid = row_user['uid'];
                        req.body.mobile_no = row_user['mobile_no'];
                        req.body.bank_acc_name = row_user['fullname'];
                        req.body.bank_acc_no = row_user['bank_acc_no'];
                        req.body.bank_name = row_user['bank_name'];
                        req.body.note = 'ฝากเงิน จากรายการเติมผิดพลาด ยืนยันโดย '+ req.body.approve;
                        req.body.credit_before = row_user['credit'];
                        req.body.credit_after = parseFloat(row_user['credit']) + parseFloat(credit);
                        
                        let tmpData = await TransactionList.updateWaitDepositTransactionById(req.body);
                        if (tmpData) 
                        {
                            // $this->main_model->update("id", $row_user['id'], "sl_users", array("credit" => $row_user['credit'] + $total_deposit_credit, "AutoBank" => $onoff));
                            if (req.body.autobank==1) 
                            {
                                await MemberList.increaseCreditAndAutoBank(row_user['id'],credit,req.body.autobank);
                            }
                            else
                            {
                                await MemberList.increaseCredit(row_user['id'],credit);
                            }
                            
                            //Insert Notice
                            if (row_user) 
                            {                                        
                                NoticeManage.createAdmin(row_user,"success","เติมเงินสำเร็จ"
                                ,'รหัสทำรายการ : '+ req.body.id
                                ,'',1
                                );
    
                                NoticeManage.createMember(row_user,"success","เติมเงินสำเร็จ"
                                ,'รหัสทำรายการ : '+ req.body.id
                                ,'',1
                                );
                            }
        
                            //Insert Log
                            LogList.create("ยืนยันรายการเติมผิดพลาด ของยูเซอร์ "+ row_user['mobile_no']+" ก่อนยืนยัน "+ row_user['credit']+" หลังยืนยัน "+(parseFloat(row_user['credit']) + credit)
                            ,req.body.approve,timerHelper.convertDatetimeToString(new Date()));

                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: 'เพิ่มเงินให้ '+ row_user['mobile_no'] +' จำนวน ' +credit+ ' บาท สำเร็จ',
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
                                message: tmpData.message,
                                auth : false,
                                data : [],
                            }
                            );
                            return;
                        }
                        
    
                    }
                    else if (req.body.mode=="cancel") 
                    {                    
                        //cancel
                        let row_user = await MemberList.findById(req.body.username);
    
                        req.body.approve_status = 0;
                        req.body.approve_date = timerHelper.convertDatetimeToString(new Date());                        
                        req.body.note = 'ฝากเงิน จากรายการเติมผิดพลาด ปฏิเสธโดย '+ req.body.approve;
                        req.body.credit_before = row_user['credit']?parseFloat(row_user['credit']):0;
                        req.body.credit_after = row_user['credit']?parseFloat(row_user['credit']):0;
    
                        let tmpData = await TransactionList.updateWaitDepositTransactionById(req.body);
                        
                        if (tmpData) 
                        {
                           
                            //Insert Log
                            LogList.create("ยกเลิกรายการฝาก "+ req.body.id +" credit : "+ req.body.credit
                            ,req.body.approve,timerHelper.convertDatetimeToString(new Date()));
    
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: 'ยกเลิกรายการนี้แล้ว',
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
                                message: tmpData.message,
                                auth : false,
                                data : [],
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
                                message: 'Not have this mode ',
                                auth : true,
                                data : [],
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

exports.deleteStaffById = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        
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
                    console.log(req.body);            
                    let tmpData = await TransactionList.deleteByID(req.body);
    
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
                        res.status(202).json(
                        { 
                            status: 'error', 
                            message: tmpData.message,
                            auth : false,
                            data : [],
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

exports.getTransactionByUsername = async function(req, res) {

    try {
        console.log('getTransactionByUsername');
    
        const ipAddress = await IpAllowList.getIPv4Address(req);
        
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = await IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = await IpAllowList.findById(ipAddress);    
        
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
                    
                    let tmpData = await TransactionList.getTransactionByUsername(req.body.username);
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
    }

   

    
};