'use strict';
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const Secret = require('../../config/secret');
const Cryptof = require('../models/cryptof.model');

const SCBModel = require('../models/scb.model');
const AdminBankList = require('./../models/adminbanklist.model');
const MainModel = require('./../models/main.model');
const MemberList = require('./../models/memberlist.model');
const AdminList = require('./../models/adminlist.model');
const CreditManage = require('./../models/creditmanage.model');

const Scb_app_lib = require('./../modules/scbapplib');
const Kplus_lib_202204 = require('./../modules/kplusclass');

const timerHelper = require('./../modules/timehelper');
const AdminSetting = require('../models/adminsetting.model');

const NoticeManage = require('./../models/noticemanage.model');
const LogList = require('./../models/loglist.model');

const IpAllowList = require('../models/ipallowlist.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

const querystring = require('querystring');

function ff(no) {
    let pattern = /(\d{3})(\d{1})(\d{5})(\d{1})$/;
    let result = no.replace(pattern, "$1-$2-$3-$4");
    return result;
}


exports.refreshtoken = async function(req, res) {
    console.log('scb refreshtoken..');
    try {

        let sqlStr ="SELECT * FROM betlog_running WHERE Active=1 and TypeCron='scb' LIMIT 0,1 ";
        let ActiveBetLog = MainModel.query(sqlStr);
        if (ActiveBetLog.length<=0) 
        {
            res.status(202).json(
                { 
                    status: 'close', 
                    message: 'Key Failed',                    
                }
            );
            return;
        }
                
        console.log(timerHelper.getDateTimeNowStringNoT()+ " Refresh Token SCB");

        const scb_app_lib = new Scb_app_lib();
        const keycheck = req.params.key;          
        const resultKeyCheck = SCBModel.checkKey(keycheck);
        
        if (!resultKeyCheck) 
        {
            res.status(202).json(
                { 
                    status: 'error', 
                    message: 'Key Failed',                    
                }
            );
        }
        else
        {
            const parent = resultKeyCheck['parent']?resultKeyCheck['parent']:'';
            const checkIsRunning = SCBModel.checkBankIsRunning();
            if (checkIsRunning.length>0) 
            {
                res.status(202).json(
                    { 
                        status: 'success', 
                        message: 'Wait... Next Round Auto Bank is Working',
                    }
                );
                return;
            }
            else
            {
                SCBModel.updateBankRunning(1);
            }
    
            // console.log("bankList");
            const bankList = await AdminBankList.findByTypeAndID(" AND status = 1 and work_type in ('NODE','IBK') and bank_id = 5  ");
    
            let tmp_bank = [];
            let i = 0;
    
            await bankList.forEach(element => {
                tmp_bank.push({});
                tmp_bank[i] = element;
                const tmp_meta = JSON.parse(element.meta_data);
                tmp_bank[i]['meta_data'] = tmp_meta;

                // for (const [key, value] of Object.entries(tmp_meta)) 
                // {
                //     // console.log(key , value);                    
                //     tmp_bank[i]['meta_data'][key] = value;
                // }

                i++;
            });
    
            let returnResult = [];

            returnResult.push('Count Bank Active : ' + bankList.length);
    
            await tmp_bank.forEach(async tmp => 
                {
                    
                    if (tmp['bank_type']=="WITHDRAW"||tmp['bank_type']=="BREAK") 
                    {                    
                        const admin_info = tmp;
                        if (admin_info) 
                        {
                            if (admin_info['work_type'] == "NODE" ||admin_info['work_type'] == "IBK" )
                            {
                                let token = "";
    
                                if (admin_info['meta_data']['scb_app_token'] && admin_info['meta_data']['scb_app_token']!='') {
                                    token = Cryptof.decryption(admin_info['meta_data']['scb_app_token']);
                                }

                                console.log("token : "+token);
                                console.log(token.length);
                                
                                let resp = [];
                                if (token!="") {
                                    resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);    
                                }                                
                                let data = [];
                                let i = 0;

                                // console.log(resp.data);
                                if (token!="" && resp['status'] && resp['status']!='error') 
                                {
                                    if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                    {                  
                                        console.log("Still Login");
                                        //Still Login                  
                                        admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                        SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);
    
                                        if(admin_info['meta_data']['bank_break_enable'] == 1)
                                        {
                                            if(admin_info['meta_data']['balance'] >= admin_info['meta_data']['bank_break_credit_check'])
                                            {
                                                let bank_break_id = admin_info['meta_data']['bank_break_id'];
                                                let admin_bank_break = MainModel.query(`
                                                            select *
                                                            from admin_bank
                                                            where status = 1 and id = ${bank_break_id}
                                                `);
                                                let tmp_bank_break = [];
                                                await admin_bank_break.forEach(tmp => 
                                                    {
                                                        tmp_bank_break = tmp;
                                                        for (const [key, value] of Object.entries(JSON.parse(tmp['meta_data']))) 
                                                        {
                                                            tmp_bank_break[key] = value;                                                        
                                                        }
                                                        return;
                                                    }
                                                );
    
                                                if(tmp_bank_break.length>0)
                                                {
                                                    let amount 	= (admin_info['meta_data']['bank_break_credit']) && admin_info['meta_data']['bank_break_credit'] != '' ? admin_info['meta_data']['bank_break_credit'] : 0;
                                                    let acc 		= tmp_bank_break['bank_acc_number'];
                                                    let bank_id 	= await AdminBankList.getBankInfoByBankID(tmp_bank_break['bank_id'])['scb_id'];
    
                                                    let resp = await scb_app_lib.TransferAuto(token,admin_info['bank_acc_number'],acc,amount);
                                                    if (resp.status=="success") 
                                                    {                                                    
                                                        returnResult.push(admin_info['bank_acc_number'] + " : พักเงินเรียบร้อย");
                                                        NoticeManage.createAdmin([],"success","พักเงินเรียบร้อย"
                                                        ,'พักเงินเข้าบัญชี '+tmp_bank_break['bank_acc_number']+' - '+tmp_bank_break['bank_acc_name']+' จำนวน '+amount
                                                        ,'',1
                                                        )
    
                                                        LogList.create('พักเงินเข้าบัญชี '+tmp_bank_break['bank_acc_number']+' - '+tmp_bank_break['bank_acc_name']+' จำนวน '+amount
                                                        ,"SYSTEM",timerHelper.getDateTimeNowString() ,parent
                                                        )
                                                    }
                                                    else
                                                    {
                                                        returnResult.push(admin_info['bank_acc_number'] + " : พักเงินเรียบร้อยไม่สำเร็จ "+resp.message);
                                                    }
                                                }
                                                
                                            }
                                        }
    
                                        returnResult.push(admin_info['bank_acc_number'] + " : "+admin_info['meta_data']['balance']);                                        
                                        console.log(admin_info['bank_acc_number'] + " : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                    }
                                    else
                                    {
                                        console.log("New Login");                                        
                                        token = "";										

                                        let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                        let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';

                                        // console.log(api_refresh);
                                        // console.log(deviceid);
                                        // console.log(admin_info['meta_data']['password']);
                                        // return;
                                            
                                        token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);
                                        // console.log("SCB Token :")
                                        // console.log(token);
                                        if (token) 
                                        {                                            
                                            admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);  
                                            // console.log("token : "+token);                                            
                                            // console.log(admin_info['bank_acc_number']);
                                            resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                            console.log(resp.data);
                                            if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                            {
                                                admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                            }                                            
                                            SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);
                                            returnResult.push(admin_info['bank_acc_number'] + " : Relogin");
                                            console.log(admin_info['bank_acc_number'] + " : Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                        }
                                        else
                                        {
                                            returnResult.push('Login Failed '+ admin_info['bank_acc_number']);
                                            console.log('Login Failed '+ admin_info['bank_acc_number']);
                                        }
                                    }
                                }
                                else if(token=="")
                                {
                                    console.log("New Login2");                                        
                                    token = "";										

                                    let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                    let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';

                                    // console.log(api_refresh);
                                    // console.log(deviceid);
                                    // console.log(admin_info['meta_data']['password']);
                                    // return;
                                        
                                    token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);
                                    // console.log("SCB Token :")
                                    // console.log(token);
                                    if (token) 
                                    {                                            
                                        admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);  
                                        // console.log("token : "+token);                                            
                                        // console.log(admin_info['bank_acc_number']);
                                        resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                        console.log(resp.data);
                                        if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                        {
                                            admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                        }                                            
                                        SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);
                                        returnResult.push(admin_info['bank_acc_number'] + " : Relogin");
                                        console.log(admin_info['bank_acc_number'] + " : Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                    }
                                    else
                                    {
                                        returnResult.push('Login Failed '+ admin_info['bank_acc_number']);
                                        console.log('Login Failed '+ admin_info['bank_acc_number']);
                                    }
                                }
                                else
                                {

                                    returnResult.push('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
                                    console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
                                }
                            }
                        
                        }                     
                    }            
                });
    
            SCBModel.updateBankRunning(0);
    
            res.status(200).json(
                { 
                    status: 'success', 
                    message: JSON.stringify(returnResult),
                }
            );
            
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

exports.autoapp = async function(req, res) {

    try {

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        const scb_app_lib = new Scb_app_lib();
        console.log('scb auto bank');
            
        const keycheck = req.params.key;  
        const resultKeyCheck = SCBModel.checkKey(keycheck);
        
        let returnResult = [];
        
        if (!resultKeyCheck) 
        {
            res.status(202).json(
                { 
                    status: 'error', 
                    message: 'Key Failed',
                    
                }
            );
        }
        else
        {
            const parent = resultKeyCheck['parent']?resultKeyCheck['parent']:'';
    
            const checkIsRunning = SCBModel.checkBankIsRunning();
            if (checkIsRunning.length>0) 
            {
                res.status(202).json(
                    { 
                        status: 'success', 
                        message: 'Wait... Next Round Auto Bank is Working',
                    }
                );
            }
            else
            {
                SCBModel.updateBankRunning(1);
    
                console.log("query banklist");
                const bankList = await AdminBankList.findByTypeAndID(" AND status = 1 and work_type in ('NODE','IBK') and bank_id = 5 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') ");
    
                let tmp_bank = [];
                let i = 0;
                
                await bankList.forEach(element => {
                    tmp_bank.push({});
                    tmp_bank[i] = element;
                    const tmp_meta = JSON.parse(element.meta_data);
                    tmp_bank[i]['meta_data'] = tmp_meta;    
                    i++;
                });

                    
                let returnResult = [];
                await tmp_bank.forEach(async bankElement => {
    
                    let admin_info = bankElement;
                    if (admin_info) 
                    {
                        let token ="";
                        if (admin_info['meta_data']['scb_app_token'] && admin_info['meta_data']['scb_app_token']!='') {
                            token = Cryptof.decryption(admin_info['meta_data']['scb_app_token']);
                        }
                        
                        ///Login///
                        let resp = [];
                        if (token!="") 
                        {
                            resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);    
                        }
                        
                        let data = [];
                        let i = 0;

                        //console.log(resp.data);
                        if (resp['status'] && resp['status']!='error')  
                        {
                            if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                            {                  
                                console.log("Still Login");
                                //Still Login                  
                                admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);

                                if(admin_info['meta_data']['bank_break_enable'] == "true")
                                {
                                    if(admin_info['meta_data']['balance'] >= admin_info['meta_data']['bank_break_credit_check'])
                                    {
                                        let bank_break_id = admin_info['meta_data']['bank_break_id'];
                                        let admin_bank_break = MainModel.query(`
                                                    select *
                                                    from admin_bank
                                                    where status = 1 and id = ${bank_break_id}
                                        `);
                                        let tmp_bank_break = [];
                                        await admin_bank_break.forEach(tmp => 
                                            {
                                                tmp_bank_break = tmp;
                                                for (const [key, value] of Object.entries(JSON.parse(tmp['meta_data']))) 
                                                {
                                                    tmp_bank_break[key] = value;                                                        
                                                }
                                                return;
                                            }
                                        );

                                        if(tmp_bank_break)
                                        {
                                            let amount 	= (admin_info['meta_data']['bank_break_credit']) && admin_info['meta_data']['bank_break_credit'] != '' ? admin_info['meta_data']['bank_break_credit'] : 0;
                                            let acc 		= tmp_bank_break['bank_acc_number'];
                                            let bank_id 	= await AdminBankList.getBankInfoByBankID(tmp_bank_break['bank_id'])['scb_id'];

                                            let resp = await scb_app_lib.TransferAuto(token,admin_info['bank_acc_number'],acc,amount);
                                            if (resp.status=="success") 
                                            {                                                    
                                                returnResult.push(admin_info['bank_acc_number'] + " : พักเงินเรียบร้อย");
                                                NoticeManage.createAdmin([],"success","พักเงินเรียบร้อย"
                                                ,'พักเงินเข้าบัญชี '+tmp_bank_break['bank_acc_number']+' - '+tmp_bank_break['bank_acc_name']+' จำนวน '+amount
                                                ,'',1
                                                )

                                                LogList.create('พักเงินเข้าบัญชี '+tmp_bank_break['bank_acc_number']+' - '+tmp_bank_break['bank_acc_name']+' จำนวน '+amount
                                                ,"SYSTEM",timerHelper.getDateTimeNowString() ,parent
                                                )
                                            }
                                            else
                                            {
                                                returnResult.push(admin_info['bank_acc_number'] + " : พักเงินเรียบร้อยไม่สำเร็จ "+resp.message);
                                            }
                                        }
                                        
                                    }
                                }

                                returnResult.push(admin_info['bank_acc_number'] + " : "+admin_info['meta_data']['balance']);                                        
                                console.log(admin_info['bank_acc_number'] + " : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                            }
                            else
                            {
                                console.log("New Login");                                        
                                token = "";										

                                let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
                                                                   
                                token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);
                                
                                if (token) 
                                {                                            
                                    admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);  
                                    
                                    resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                    // console.log(resp.data);
                                    if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                    {
                                        admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                    }                                            
                                    SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);
                                    returnResult.push(admin_info['bank_acc_number'] + " : Relogin");
                                    console.log(admin_info['bank_acc_number'] + " : Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                }
                                else
                                {
                                    returnResult.push('Login Failed '+ admin_info['bank_acc_number']);
                                    console.log('Login Failed '+ admin_info['bank_acc_number']);
                                }
                            }
                        }
                        else
                        {
                            returnResult.push('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
                            console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
                        }

                        // console.log(token);

                        ///End Login///
                        if (admin_info['bank_type']!='WITHDRAW') 
                        {
                            let api_data = {
                                "accountNo"		: admin_info['bank_acc_number'],
                                "endDate"		: timerHelper.getSCBDateNowString(),
                                "pageNumber"	: "1",
                                "pageSize"		: 50,
                                "productType"	: "2",
                                "startDate"		: timerHelper.getSCBDateNowYesterdayString()                            
                            };
    
                            // console.log(api_data);
        
                            resp = await scb_app_lib.Transaction(token, api_data);
                            data = [];
                            i = 0;
    
                            // console.log(resp);
        
                            if (resp['status'] && resp['status']!='error')  
                            {
                                if (resp['status']['code'] == 1000) 
                                {
                                    
                                    await resp['data']['txnList'].forEach(tmp => 
                                        {
                                            if (tmp['txnCode']['code'] == 'X1' && tmp['txnRemark'].indexOf("SMS")==-1) 
                                            {
                                                // console.log(tmp['txnRemark']);
                                                // console.log(tmp['txnRemark'].indexOf("SCB"));
                                                if (tmp['txnRemark'].indexOf("SCB")!=-1 ) 
                                                {
                                                    let tmpData = [];
                                                    //SCB                                                
                                                    // data[i]['credit'] = parseFloat(tmp['txnAmount'].replace(",",""));
                                                    tmpData['credit'] = parseFloat(tmp['txnAmount']);
                                                    // console.log(tmp['txnRemark']);
                                                    const regex = /SCB\s+(\w+)/;
                                                    const matchs = tmp['txnRemark'].match(regex);
                                                    let acc_no = matchs ? matchs[1] : "";
                                                    acc_no = acc_no.replace("x", "");
                                                    acc_no = acc_no.replace("X", "");
                                                    acc_no = acc_no.replace("-", "");
                                                    acc_no = acc_no.replace("/", "");
        
                                                    tmpData['acc'] = acc_no;
        
                                                    tmpData['bankdesc'] = tmp['txnRemark'];
                                                        
                                                    tmpData['datetime'] = new Date(tmp['txnDateTime']);
        
                                                    tmpData['bank'] = "SCB";
                                                    tmpData['bank_name'] = "ไทยพานิชย์";
    
                                                    data.push(tmpData);
        
                                                    i++;
                                                }
                                                else
                                                {
                                                    //Other Bank
                                                    let tmpData = [];
    
                                                    tmpData['credit'] = parseFloat(tmp['txnAmount']);
        
                                                    let matchRemark =tmp['txnRemark'].split("X");                                                
                                                    const regex = /\(([^)]+)\)/;
                                                    const tmp_bank = matchRemark[0].match(regex);
                                                    
                                                    let acc_no = matchRemark[1] ? matchRemark[1] : "";
                                                    acc_no = acc_no.replace("x", "");
                                                    acc_no = acc_no.replace("X", "");
                                                    acc_no = acc_no.replace("-", "");
                                                    acc_no = acc_no.replace("/", "");
        
                                                    let bankname = "";
        
                                                    tmpData['acc'] = acc_no;
        
                                                    tmpData['bankdesc'] = tmp['txnRemark'];
                                                    
                                                    tmpData['datetime'] = new Date(tmp['txnDateTime']); 
                                                        
                                                    tmpData['bank'] = tmp_bank[1]?tmp_bank[1]:'';
                                                    tmpData['bank_name'] = matchRemark[0].split(" ")[0];
        
                                                    data.push(tmpData);
                                                    i++;
                                                }
                                            }
                                            else
                                            {
        
                                            }
                                        }
                                    );
                                }
                                else
                                {
                                    returnResult.push(resp + "\n");
                                }
                            }
        
                            
                            // console.log(data);

                            let dd_now = new Date();
                            dd_now.setHours(dd_now.getHours()+7);
    
                            await data.forEach(row_transfer => 
                            {
                                
                                
                                if (admin_info['meta_data']['update_time']==''||row_transfer['datetime'].getTime() > (new Date(admin_info['meta_data']['update_time'])).getTime() || admin_info['meta_data']['before_update_time'] == 1)
                                {                                
                                    if(row_transfer['datetime'].getTime() <= dd_now.getTime())
                                    {
                                        let c_now = new Date();
                                        c_now = new Date(c_now.getTime() + (offsetTime));
                                        c_now.setHours(c_now.getHours());

                                        let fromDate = c_now.setMinutes(c_now.getMinutes() - 30);
                                        let toDate = c_now.setMinutes(c_now.getMinutes() + 30);
                                        let row_tmpp = MainModel.query(`
                                            SELECT *
                                            FROM transfer_ref
                                            WHERE 
                                                (
                                                    (acc = '${row_transfer['acc']}' AND date = '${timerHelper.convertDatetimeToString(row_transfer['datetime'])}' AND credit = '${row_transfer['credit']}') 
                                                    OR 
                                                    (acc like '%${row_transfer['acc']}%' AND date >= '${timerHelper.convertDatetimeToString(fromDate)}' AND date<='${timerHelper.convertDatetimeToString(toDate)}' AND credit = '${row_transfer['credit']}' AND manual = 1 )
                                                )								
                                        `);
                                        
                                        // console.log(`
                                        // SELECT *
                                        // FROM transfer_ref
                                        // WHERE 
                                        //     (
                                        //         (acc = '${row_transfer['acc']}' AND date = '${timerHelper.convertDatetimeToString(row_transfer['datetime'])}' AND credit = '${row_transfer['credit']}') 
                                        //         OR 
                                        //         (acc like '%${row_transfer['acc']}%' AND date >= '${timerHelper.convertDatetimeToString(fromDate)}' AND date<='${timerHelper.convertDatetimeToString(toDate)}' AND credit = '${row_transfer['credit']}' AND manual = 1 )
                                        //     )								
                                        // `);
                                        // console.log(row_tmpp);
        
                                        if (row_tmpp.length<=0) 
                                        {
                                            let row_user = MainModel.query(`
                                                SELECT *
                                                FROM sl_users
                                                WHERE (bank_acc_no = '${row_transfer['acc']}' or bank_acc_no like '%${row_transfer['acc']}%') 
                                            `);
        
                                            let transactiontype= "DEPOSIT";
                                            if (row_user.length==1) 
                                            {
                                                if (row_user[0]['AutoBank']==0) 
                                                {
                                                    transactiontype= "DEPNL";
                                                }
                                            }
        
                                            let tmp_data = {
                                                "id" 			: null,
                                                "tr_bank"		: "SCB",
                                                "bank_app"		: row_transfer['bank_name'],
                                                "acc"			: row_transfer['acc'],
                                                "credit"		: row_transfer['credit'],
                                                "type"			: "DEPOSIT",
                                                "date"			: timerHelper.convertDatetimeToString(row_transfer['datetime']),
                                                "note"			: "",
                                                "status" 		: 0,
                                                "parent"		: parent
                                            };
        
                                            if(MainModel.insert("transfer_ref",tmp_data))
                                            {
                                                let last_day_deposit = cTime;        
                                                let new_sum_day_deposit = admin_info.sum_day_deposit + parseFloat(row_transfer['credit']);
                                                if (cTime.getDate()!= admin_info.last_day_deposit.getDate() ) 
                                                {
                                                    new_sum_day_deposit = credit;                                                    
                                                }
                                                
                                                MainModel.update("admin_bank",{sum_day_deposit:new_sum_day_deposit,last_day_deposit:last_day_deposit },{id : admin_info.id});

                                                if (transactiontype=="DEPNL") 
                                                {
                                                    returnResult.push("Auto Bank is off \n");
                                                    let credit = parseInt(row_transfer['credit']);
                                                    let response = CreditManage.depositError(credit, row_transfer, "SCBAPI", admin_info, "สถานะออโต้ฝากปิดใช้งาน");
        
                                                }
                                                else
                                                {
                                                    if(admin_info['meta_data']['deposit_decimal'] == 1)
                                                    {
                                                        //ฝากแบบทศนิยม
                                                        let checkDecimal = MainModel.queryFirstRow(`
                                                            select *
                                                            from generate_decimal
                                                            where status IS NULL and decimal_credit = '${row_transfer['credit']}'
                                                        `);
        
                                                        if(checkDecimal)
                                                        {
                                                            let row_user =  MainModel.queryFirstRow(`
                                                                SELECT *
                                                                FROM sl_users
                                                                WHERE id = '${checkDecimal['username']}' or mobile_no = '${checkDecimal['username']}'
                                                            `);
                                                            
                                                            // console.log(row_user.length);
                                                            if(row_user.length>0)
                                                            {
                                                                let splitCredit = row_transfer['credit'].toString().split('.');
                                                                let credit = parseInt(splitCredit[0]+1);
        
                                                                let tmpDepositSetting = AdminSetting.findByID("deposit_setting");
                                                                if (tmpDepositSetting.length>0) 
                                                                {
                                                                    let deposit_setting = JSON.parse(tmpDepositSetting['value']);
                                                                    let min_dep = 0;
                                                                    let min_enable = false;
        
                                                                    if (deposit_setting['enable']==1) 
                                                                    {
                                                                        try 
                                                                        {
                                                                            min_enable = true;
                                                                            min_dep = deposit_setting['MinDeposit'] ? parseInt(deposit_setting['MinDeposit']) : 100;
                                                                        } catch (error) {
                                                                            console.log(error);
                                                                        }                                                                    
                                                                    }
        
                                                                    if (min_enable) 
                                                                    {
                                                                        if(credit >= min_dep)
                                                                        {
                                                                            // console.log(credit,row_user,row_transfer,"SCB",admin_info,row_transfer.datetime);
                                                                            let response = CreditManage.deposit(credit,row_user,row_transfer,"SCB",admin_info,row_transfer.datetime);
                                                                            returnResult.push(response.message+ "\n");
                                                                        }
                                                                        else
                                                                        {   
                                                                            let response = CreditManage.depositMin(credit,row_user,row_transfer,"SCB",admin_info,"ฝากไม่ถึงขั้นต่ำ",row_transfer.datetime);    
                                                                            returnResult.push("ฝากไม่ถึงขั้นต่ำ \n");
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        let response = CreditManage.deposit(credit,row_user,row_transfer,"SCB",admin_info,row_transfer.datetime);
                                                                        returnResult.push(response.message+ "\n");
                                                                    }
        
                                                                }
                                                                else
                                                                {
                                                                    returnResult.push("Not Found deposit_setting \n");
                                                                }
                                                            }
                                                            else
                                                            {
        
                                                                let credit = parseInt(row_transfer['credit']);
                                                                let response = CreditManage.depositError(credit, row_transfer, "SCBAPI", admin_info, "หาสมาชิกไม่เจอ");
                                                                returnResult.push("Can not find user decimal \n");
        
                                                            }
                                                        }
                                                        else
                                                        {
                                                            let credit = parseInt(row_transfer['credit']);
                                                            let response = CreditManage.depositError(credit, row_transfer, "SCBAPI", admin_info, "ไม่มีรายการทศนิยมนี้");                                                        
                                                            returnResult.push("ไม่มีรายการทศนิยมนี้ \n");
                                                        }
                                                    }
                                                    else
                                                    {
                                                        //ฝากแบบปกติ ไม่ใช่ฝากทศนิยม                                                    
                                                        if(row_transfer['acc'] == "")
                                                        {
                                                            let credit = parseInt(row_transfer['credit']);
                                                            let response = CreditManage.depositError(credit, row_transfer, "SCBAPI", admin_info, "หาสมาชิกไม่เจอ");
                                                            returnResult.push("Can not find user \n");
                                                        }
                                                        else
                                                        {
                                                            //แยกแบงค์ 4 หมวด kbank , gsb , baac , แบงคอื่น เพราะเลข 4 หลักเราไปหาเลขบัญชีคนละแบบ ไปหาในตาราง sl_users
                                                            let row_user = [];
                                                            if(row_transfer['bank_name'] == "SCB"){                                                             
                                                                row_user = MemberList.getMemberByBankAccNo(` AND bank_id = 5 and bank_acc_no like '%${row_transfer['acc']}%' `);
                                                            }else if(row_transfer['bank_name'] == "GSB"){
                                                                row_user = MemberList.getMemberByBankAccNo(` AND bank_acc_no like '%${row_transfer['acc']}%' `);
                                                            }else if(row_transfer['bank_name'] == "BAAC"){                                                            
                                                                row_user = MemberList.getMemberByBankAccNo(` AND bank_acc_no like '%${row_transfer['acc']}' `);
                                                            }else{ 
                                                                row_user = MemberList.getMemberByBankAccNo(` AND bank_acc_no like '%${row_transfer['acc']}%' `);                                                            
                                                            }
        
                                                            let tmp_user = "";
                                                            let credit = parseInt(row_transfer['credit']);
        
                                                            if(row_user.length == 1){
                                                                tmp_user = "one";
                                                                row_user = row_user[0];
                                                                
                                                            }else if(row_user.length > 1){
                                                                tmp_user = "many";
                                                            }else{
                                                                tmp_user = null;
                                                            }
        
                                                            if(tmp_user == "one")
                                                            {
                                                                transactiontype= "DEPOSIT";
                                                                if (!row_user) 
                                                                {
                                                                    if (row_user['AutoBank']==0) 
                                                                    {
                                                                        transactiontype= "DEPNL";
                                                                    }
                                                                }
        
                                                                if (transactiontype == "DEPNL") {
                                                                    returnResult.push("Auto Bank is off \n");
                                                                    let credit = parseInt(row_transfer['credit']);
                                                                    let response = CreditManage.depositError(credit, row_transfer, "SCBAPI", admin_info, "สถานะออโต้ฝากปิดใช้งาน");
                                                                }
                                                                else
                                                                {
                                                                    let tmpDepositSetting = AdminSetting.findByID("deposit_setting");
                                                                    if (tmpDepositSetting) 
                                                                    {
                                                                        let deposit_setting = JSON.parse(tmpDepositSetting['value']);
                                                                        let min_dep = 0;
                                                                        let min_enable = false;
        
                                                                        if (deposit_setting['enable']==1) 
                                                                        {
                                                                            try 
                                                                            {
                                                                                min_enable = true;
                                                                                min_dep = deposit_setting['MinDeposit'] ? parseInt(deposit_setting['MinDeposit']) : 100;
                                                                            } catch (error) {
                                                                                console.log(error);
                                                                            }                                                                    
                                                                        }
        
                                                                        if (min_enable) 
                                                                        {
                                                                            if(credit >= min_dep)
                                                                            {
                                                                                
                                                                                let response = CreditManage.deposit(credit,row_user,row_transfer,"SCB",admin_info,row_transfer.datetime);
                                                                                returnResult.push(response.message+ "\n");
                                                                            }
                                                                            else
                                                                            {   
                                                                                let response = CreditManage.depositMin(credit,row_user,row_transfer,"SCB",admin_info,"ฝากไม่ถึงขั้นต่ำ",row_transfer.datetime);    
                                                                                returnResult.push("ฝากไม่ถึงขั้นต่ำ \n");
                                                                            }
                                                                        }
                                                                        else
                                                                        {
                                                                            let response = CreditManage.deposit(credit,row_user,row_transfer,"SCB",admin_info,row_transfer.datetime);
                                                                            returnResult.push(response.message+ "\n");
                                                                        }
        
                                                                    }
                                                                    else
                                                                    {
                                                                        returnResult.push("Not Found deposit_setting \n");
                                                                    }
                                                                }
        
                                                            }
                                                            else if(tmp_user == "many")
                                                            {
                                                                let response = CreditModel.depositMany(credit,row_transfer,"SCB",admin_info,"พบสมาชิกหลายคน",row_user,row_transfer.datetime);
                                                                returnResult.push("Multiple user \n");
                                                            }
                                                            else
                                                            {
                                                                
                                                                let response = CreditManage.depositError(credit, row_transfer, "SCBAPI", admin_info, "หาสมาชิกไม่เจอ");
                                                                returnResult.push("Can not find user \n");
                                                            }
        
                                                        }
                                                    }
        
                                                }
                                            }
                                            else
                                            {
                                                returnResult.push("Cannot insert transfer_ref \n");
                                            }
        
                                        }
                                        else
                                        {
                                            returnResult.push("Repeat List :"+row_transfer['datetime']+" "+ row_transfer['acc'] +" "+row_transfer['credit'] +"."+'\n');
                                        }
                                    }
        
        
                                }
                            }
                            );
                        }

                       
                        
                    }
    
                });
    
                let tmpDepositSetting2 = AdminSetting.findByID("change_deposit_bank");
                if (tmpDepositSetting2.length>0) 
                {
                    let change_deposit_bank_setting = JSON.parse(tmpDepositSetting2['value']);
                    if (change_deposit_bank_setting.enable==1 && change_deposit_bank_setting.limit>0) 
                    {
                        const bankList2 = await AdminBankList.findByTypeAndID(` AND status = 1 and work_type in ('NODE','IBK') and bank_id = 5 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') AND (sum_day_deposit >= ${change_deposit_bank_setting.limit}) AND date(last_day_deposit)=${timerHelper.getDateNowString(cTime)} `);
                        if (bankList2.length>0) {
                            const idString = bankList2.map(item => item.id).join(',');    
                            //Inactive 
                            MainModel.update("admin_bank",{status:0},{status:1},` id in (${idString})`);
                            const bankList3 = await AdminBankList.findByTypeAndID(` AND status = 0 and work_type in ('NODE','IBK') and bank_id = 5 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') AND (sum_day_deposit < ${change_deposit_bank_setting.limit}) `);
                            if (bankList3.length>0) 
                            {
                                for (let index = 0; index < bankList3.length; index++) {
                                    const element = bankList3[index];
                                    MainModel.update("admin_bank",{status:1},{id:element.id});
                                    break;
                                }
                            }
                        }
                        
                    }
                }
                
            }
    
            SCBModel.updateBankRunning(0);
    
            res.status(200).json(
                { 
                    status: 'success', 
                    message: JSON.stringify(returnResult),
                }
            );
    
        }
    } catch (error) {
        SCBModel.updateBankRunning(0);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,                
            }
        );
    }

   
    
}

exports.getTransactionByBankID = async function(req, res) {

    try {

        const scb_app_lib = new Scb_app_lib();
        console.log('scb getTransactionByBankID');
            
        let returnResult = "";
        
        const inputBankAccNo = req.body.bank_acc_no;  
        const inputBankId = req.body.bank_id;  
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const pageSelected = req.body.pageSelected;
        
        
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);

        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {            
            res.status(202).json(
                { 
                    status: 'error', 
                    message: 'Unauthorize ip. ('+ipAddress+')',                    
                }
            );
            return;
        }
        else
        {
            const headers = req.headers;

            const userid = headers.userid;
            const token = headers.token;
    
            let IsAuth = AdminList.isAuthenicated(userid,token);
            
            if (!IsAuth) 
            {
                res.status(202).json(
                    { 
                        status: 'error', 
                        message: 'Unauthorize ip. ('+ipAddress+')',                    
                    }
                );
                return;
            }

            let resultData = [];
            const checkIsRunning = SCBModel.checkBankIsRunning();
            if (checkIsRunning.length>0) 
            {
                res.status(202).json(
                    { 
                        status: 'success', 
                        message: 'Wait... Next Round Auto Bank is Working',
                    }
                );
                return;
            }
            else
            {
                SCBModel.updateBankRunning(1);
    
                console.log("query banklist");
                const bankList = await AdminBankList.findByTypeAndID(" AND work_type in ('NODE','IBK') AND bank_id = "+inputBankId +" and bank_acc_number='"+inputBankAccNo+"' ");
    
                let tmp_bank = [];
                let i = 0;
                
                await bankList.forEach(element => {
                    tmp_bank.push({});
                    tmp_bank[i] = element;
                    const tmp_meta = JSON.parse(element.meta_data);
                    tmp_bank[i]['meta_data'] = tmp_meta;    
                    i++;
                });
    
                

                if (tmp_bank.length>0) 
                {
                    let admin_info = tmp_bank[0];    

                    let token ="";                   
                    if (admin_info['meta_data']['scb_app_token'] && admin_info['meta_data']['scb_app_token']!='') {
                        token = Cryptof.decryption(admin_info['meta_data']['scb_app_token']);
                    }
                    
                    ///Login///
                    let resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                    let data = [];
                    let i = 0;

                    // console.log(resp.data);
                    if (resp['status'] && resp['status']!='error')  
                    {
                        if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                        {                  
                            console.log("Still Login");
                            //Still Login                  
                            admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                            SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);

                            
                            console.log(admin_info['bank_acc_number'] + " : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                        }
                        else
                        {
                            console.log("New Login");                                        
                            token = "";										

                            let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                            let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
                                                                
                            token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);
                            
                            if (token) 
                            {                                            
                                admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);  
                                
                                resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                // console.log(resp.data);
                                if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                {
                                    admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                }                                            
                                SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);
                                returnResult = admin_info['bank_acc_number'] + " : Relogin";
                                console.log(admin_info['bank_acc_number'] + " : Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");
                            }
                            else
                            {
                                returnResult = 'Login Failed '+ admin_info['bank_acc_number'];
                                console.log('Login Failed '+ admin_info['bank_acc_number']);
                            }
                        }
                    }
                    else
                    {
                        returnResult = 'Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message;
                        console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
                    }

                    // console.log(token);

                    ///End Login///

                    let api_data = {
                        "accountNo"		: admin_info['bank_acc_number'],
                        "endDate"		: timerHelper.convertDateToString(endDate),
                        "pageNumber"	: pageSelected.toString(),
                        "pageSize"		: 50,
                        "productType"	: "2",
                        "startDate"		: timerHelper.convertDateToString(startDate)
                    };
                        
                    resp = await scb_app_lib.Transaction(token, api_data);
                    data = [];
                    i = 0;

                    if (resp['status'] && resp['status']!='error')  
                    {
                        if (resp['status']['code'] == 1000) 
                        {
                            data = resp['data']['txnList'];
                            
                            // await resp['data']['txnList'].forEach(tmp => 
                            //     {
                            //         if (tmp['txnCode']['code'] == 'X1' && tmp['txnRemark'].indexOf("SMS")==-1) 
                            //         {
                            //             // console.log(tmp['txnRemark']);
                            //             // console.log(tmp['txnRemark'].indexOf("SCB"));
                            //             if (tmp['txnRemark'].indexOf("SCB")!=-1 ) 
                            //             {
                            //                 let tmpData = [];
                            //                 //SCB                                                
                            //                 // data[i]['credit'] = parseFloat(tmp['txnAmount'].replace(",",""));
                            //                 tmpData['credit'] = parseFloat(tmp['txnAmount']);
                            //                 // console.log(tmp['txnRemark']);
                            //                 const regex = /SCB\s+(\w+)/;
                            //                 const matchs = tmp['txnRemark'].match(regex);
                            //                 let acc_no = matchs ? matchs[1] : "";
                            //                 acc_no = acc_no.replace("x", "");
                            //                 acc_no = acc_no.replace("X", "");
                            //                 acc_no = acc_no.replace("-", "");
                            //                 acc_no = acc_no.replace("/", "");

                            //                 tmpData['acc'] = acc_no;

                            //                 tmpData['bankdesc'] = tmp['txnRemark'];
                                                
                            //                 tmpData['datetime'] = new Date(tmp['txnDateTime']);

                            //                 tmpData['bank'] = "SCB";
                            //                 tmpData['bank_name'] = "ไทยพานิชย์";

                            //                 data.push(tmpData);

                            //                 i++;
                            //             }
                            //             else
                            //             {
                            //                 //Other Bank
                            //                 let tmpData = [];

                            //                 tmpData['credit'] = parseFloat(tmp['txnAmount']);

                            //                 let matchRemark =tmp['txnRemark'].split("X");                                                
                            //                 const regex = /\(([^)]+)\)/;
                            //                 const tmp_bank = matchRemark[0].match(regex);
                                            
                            //                 let acc_no = matchRemark[1] ? matchRemark[1] : "";
                            //                 acc_no = acc_no.replace("x", "");
                            //                 acc_no = acc_no.replace("X", "");
                            //                 acc_no = acc_no.replace("-", "");
                            //                 acc_no = acc_no.replace("/", "");

                            //                 let bankname = "";

                            //                 tmpData['acc'] = acc_no;

                            //                 tmpData['bankdesc'] = tmp['txnRemark'];
                                            
                            //                 tmpData['datetime'] = new Date(tmp['txnDateTime']); 
                                                
                            //                 tmpData['bank'] = tmp_bank[1]?tmp_bank[1]:'';
                            //                 tmpData['bank_name'] = matchRemark[0].split(" ")[0];

                            //                 data.push(tmpData);
                            //                 i++;
                            //             }
                            //         }
                            //         else
                            //         {

                            //         }
                            //     }
                            // );
                        }
                        else
                        {
                            
                        }
                    }        
                
                    resultData = data;
                }
    
            }
    
            SCBModel.updateBankRunning(0);
    
            res.status(200).json(
                { 
                    status: 'success',                     
                    message: returnResult,
                    data : resultData,
                }
            );
            return;    
        }

    } catch (error) {
        SCBModel.updateBankRunning(0);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,                
            }
        );
    }

   
    
}

exports.testLogin = async function(req,res)
{
    try {
        console.log("test Login");
        const url = req.url;
        const query = url.split('?')[1];
        const queryObject = querystring.parse(query);        

        const deviceid = queryObject.deviceid;          
        const pin = queryObject.pin;          

        console.log(deviceid);
        console.log(pin);

        const scb_app_lib = new Scb_app_lib();
        let token = await scb_app_lib.Login2(deviceid,pin);
        if (token) 
        {
            res.status(202).json(
                { 
                    status: 'success', 
                    message: "Ok",       
                    token : token,         
                }
            );
        }
        else
        {
            res.status(202).json(
                { 
                    status: 'error', 
                    message: 'Not get token',                
                }
            );
        }
    } catch (error) {
        console.log(error.message);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,                
            }
        );
    }
}

exports.testProfile = async function(req,res)
{
    try {
        console.log("testProfile");
        const url = req.url;
        const query = url.split('?')[1];
        const queryObject = querystring.parse(query);        

        const token = queryObject.token;          
        const bank_acc_number = queryObject.bank_acc_number;          

        console.log(token);
        console.log(bank_acc_number);

        const scb_app_lib = new Scb_app_lib();
        let resp = [];
        if (token!="") {
            resp = await scb_app_lib.Profile(token, bank_acc_number);    
        }              

        res.status(202).json(
            { 
                status: 'success', 
                message: resp,                           
            }
        );
    } catch (error) {
        console.log(error.message);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,                
            }
        );
    }
}

exports.testTransaction = async function(req,res)
{
    try {
        console.log("testTransaction");
        const url = req.url;
        const query = url.split('?')[1];
        const queryObject = querystring.parse(query);        

        const token = queryObject.token;          
        const bank_acc_number = queryObject.bank_acc_number;          

        console.log(token);
        console.log(bank_acc_number);

        let api_data = {
            "accountNo"		: bank_acc_number,
            "endDate"		: timerHelper.getSCBDateNowString(),
            "pageNumber"	: "1",
            "pageSize"		: 50,
            "productType"	: "2",
            "startDate"		: timerHelper.getSCBDateNowYesterdayString()                            
        };

        const scb_app_lib = new Scb_app_lib();
        let resp = [];
        if (token!="") {
            resp = await scb_app_lib.Transaction(token, api_data);
        }              

        res.status(202).json(
            { 
                status: 'success', 
                message: resp,                           
            }
        );
    } catch (error) {
        console.log(error.message);
        res.status(202).json(
            { 
                status: 'error', 
                message: error.message,                
            }
        );
    }
}