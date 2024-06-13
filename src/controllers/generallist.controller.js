'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const AdminBankList = require('../models/adminbanklist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('../models/main.model');

const AddressList = require('../models/addresslist.model');

const Secret = require('../../config/secret');


var session = require('express-session');
const { count } = require('console');
const AdminSetting = require('../models/adminsetting.model');

exports.default = async function(req, res) {
    const ipAddress = await IpAllowList.getIPv4Address(req);
    // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
    const ipAllowList = await IpAllowList.findById(ipAddress);    
    
    if (ipAllowList.length==0)
    {
        res.status(202).send('Unauthorize ip. ('+ipAddress+')');
    }
    else
    {
        res.send('admin bank api');
    }
    
};

function searchForId(id, array) {
    
    // console.log("searchForId");
        
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        for (const [key, value] of Object.entries(element)) 
        {   
            if (key=='show_type') 
            {                
                console.log(key,value,id);
                if (value==id) 
                {                    
                    return index;
                }        
            }            
        }
    }
        
    return null;
 }

exports.GetDepositInfo = async function(req, res) {
    console.log('GetDepositInfo');

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
                    
                    let user_info = await MemberList.findById(userid);
                    

                    let admin_banks =  await MainModel.query(`
                        select *
                        from admin_bank
                        where status = 1 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') 
                    `);

                    let tmp_bank=[];
                    for (let index = 0; index < admin_banks.length; index++) {                    
                        const element = admin_banks[index];
                        tmp_bank[index] = element;
                        for (const [key,value] of Object.entries(JSON.parse(element.meta_data)))
                        {
                            tmp_bank[index][key]=value;
                        }

                        delete tmp_bank[index]['meta_data'];
                        delete tmp_bank[index]['deviceid'];
                        delete tmp_bank[index]['api_refresh'];
                        delete tmp_bank[index]['url'];
                        delete tmp_bank[index]['ktb_api_refresh'];
                        delete tmp_bank[index]['ktb_device_id'];
                        delete tmp_bank[index]['ktb_bearer'];
                    }

                    
                    let admin_bank = [];
                    let bid = null;
                    if (tmp_bank.length>0) 
                    {
                        if (user_info['bank_id'] == 5) 
                        {
                            bid = searchForId("ONLY_SCB", tmp_bank);
                            
                            if(bid == null){
                                bid = searchForId("ALL", tmp_bank);
                            }

                            if(bid !== null){
                                admin_bank[0] = tmp_bank[bid];
                                
                                let tmp_info = await MainModel.queryFirstRow("SELECT * FROM bank_info WHERE bank_id="+admin_bank[0]['bank_id']);
                                admin_bank[0]['bank_ico'] 	= tmp_info['bank_ico'];
                                admin_bank[0]['bank_color'] 	= tmp_info['bank_color'];
                                admin_bank[0]['bank_ico_ex'] = tmp_info['bank_ico'].split('.')[0];
                            }
                        }
                        else if(user_info['bank_id'] == 1) 
                        {
                            bid = searchForId("ONLY_KBANK", tmp_bank);
                            
                            if(bid == null){
                                bid = searchForId("ALL", tmp_bank);
                            }

                            if(bid !== null){
                                admin_bank[0] = tmp_bank[bid];
                                
                                let tmp_info = await MainModel.queryFirstRow("SELECT * FROM bank_info WHERE bank_id="+admin_bank[0]['bank_id']);
                                admin_bank[0]['bank_ico'] 	= tmp_info['bank_ico'];
                                admin_bank[0]['bank_color'] 	= tmp_info['bank_color'];
                                admin_bank[0]['bank_ico_ex'] = tmp_info['bank_ico'].split('.')[0];
                            }
                        }
                        else
                        {
                            if(bid == null)
                            {
                                bid = searchForId("ALL", tmp_bank);
                            }

                            if(bid !== null){
                                admin_bank[0] = tmp_bank[bid];
                                
                                let tmp_info = await MainModel.queryFirstRow("SELECT * FROM bank_info WHERE bank_id="+admin_bank[0]['bank_id']);
                                admin_bank[0]['bank_ico'] 	= tmp_info['bank_ico'];
                                admin_bank[0]['bank_color'] 	= tmp_info['bank_color'];
                                admin_bank[0]['bank_ico_ex'] = tmp_info['bank_ico'].split('.')[0];
                            }
                        }
                    }

                    let decimal = false;                
                    
                    // console.log(admin_bank[0]);
                    if(admin_bank[0])
                    {
                        // console.log(admin_bank[0]);
                        if(admin_bank[0]['change_acc'] == "true"){
                            // page = "deposit";
                        }
                        
                        if(admin_bank[0]['deposit_decimal'] == 1)
                        {
                            decimal = true;
                        }
                    }

                    let data = {

                    };

                    data['decimal'] = decimal;

                    let check = await MainModel.queryFirstRow(`
                        select * 
                        from generate_decimal 
                        where status IS NULL and username = '${user_info['id']}' 
                    `);

                    data['decimal_credit'] = check;
                    data['bank_list'] = admin_bank;

                    let admin_tws = await MainModel.query(`
                        select *
                        from admin_truewallet
                        where status = 1 
                        `);

                    let tmp_tw = [];
                    for (let index = 0; index < admin_tws.length; index++) {                    
                        const element = admin_tws[index];
                        tmp_tw[index] = element;
                        for (const [key,value] of Object.entries(JSON.parse(element.meta_data)))
                        {
                            tmp_tw[index][key]=value;
                        }
                        delete tmp_tw[index]['meta_data'];
                        delete tmp_tw[index]['tw_username:'];
                        delete tmp_tw[index]['tw_password'];
                        delete tmp_tw[index]['tw_pin'];
                        delete tmp_tw[index]['tw_key'];
                    }

                    let tw_list = [];
                    let tw_list_gift = [];

                    for (let index = 0; index < tmp_tw.length; index++) 
                    {
                        const element = tmp_tw[index];
                        if (element['tw_type_wallet']=="DEPOSIT") 
                        {
                            tw_list.push(element);
                        }    
                        else if(element['tw_type_wallet']=="DEPOSIT_SMS")
                        {
                            tw_list.push(element);
                        }
                        else if(element['tw_type_wallet']=="DEPOSIT_GIFT")
                        {
                            tw_list_gift.push(element);
                        }
                    }

                    data['tw_list'] = tw_list;
                    data['tw_list_gift'] = tw_list_gift;

                    // console.log(data);
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : data,
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
        console.log(error);
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

exports.GetCardSetting = async function(req, res) {
    console.log('GetCardSetting');

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

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {                    
                    let user_info = MemberList.findById(userid);


                    let tmpSetting = AdminSetting.findById("card_setting");
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpSetting,
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
        console.log(error);
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

exports.GetWheelSetting = async function(req, res) {
    console.log('GetWheelSetting');

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

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {                    
                    let user_info = MemberList.findById(userid);
                    

                    let tmpSetting = AdminSetting.findById("wheel_setting");
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpSetting,
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
        console.log(error);
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

exports.GetWheelData = async function(req, res) {
    console.log('GetWheelData');

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

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {                    
                    let user_info = MemberList.findById(userid);
                    

                    let tmpSetting = AdminSetting.findById("wheel");
                    
                    res.status(200).json(
                        { 
                            status: 'success', 
                            message: '',
                            auth : true,                        
                            data : tmpSetting,
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
        console.log(error);
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

exports.TransferUser = async function(req, res) {
    console.log('TransferUser');

    try {
        
        if(req.query.token!="sum0h")
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

        if(req.query.start && req.query.end)
        {
            let response;

            await axios.get(`https://member.getbet78.com/test_api/getslusers?token=81dc9bdb52d04dc20036dbd8313ed055&from=${req.query.start}&to=${req.query.end}`,
            {
                
            }).then(
                resp => 
                {
                    response = resp;
                }
            );

            if (response.data) {
                if (response.data) 
                {
                    const tmpData = response.data;
                    for (let index = 0; index < tmpData.length; index++) 
                    {
                        const element = tmpData[index];
                        console.log("Insert sl_users : " + element.id);
                        MainModel.insert("sl_users",element);
                    }
                }
                else
                {
                    console.log(response.data);
                }
            }

        }
        else
        {
            res.status(200).json(
                { 
                    status: 'error', 
                    message: 'Not have start and end',
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
                auth : true,                        
                data : tmpSetting,
            }
        );
        
               
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
    }

    
};

exports.GetAllProvince = async function(req, res) {
    console.log('GetAllProvince');

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
                    
                    let tmpData = await AddressList.getAllProvince();
                    
                    if (tmpData.errorMessage==null) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : tmpData
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
        console.log(error);
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

exports.GetAllDistrict = async function(req, res) {
    console.log('GetAllDistrict');

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
                    
                    let tmpData = await AddressList.getAllDistrict();
                    
                    if (tmpData.errorMessage==null) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : tmpData
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
        console.log(error);
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

exports.GetAllSubDistrict = async function(req, res) {
    console.log('GetAllSubDistrict');

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
                    
                    let tmpData = await AddressList.getAllSubDistrict();
                    
                    if (tmpData.errorMessage==null) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : tmpData
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
        console.log(error);
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
