'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const AdminBankList = require('../models/adminbanklist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('../models/main.model');

const productList = require('../models/productlist.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


var session = require('express-session');
const { count } = require('console');
const timerHelper = require('../modules/timehelper');
const TransactionManage = require('../models/transactionmanage.model');
const TransactionList = require('../models/transactionlist.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

exports.default = async function(req, res) {
    const ipAddress = await IpAllowList.getIPv4Address(req);
    // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
    const ipAllowList = await IpAllowList.findById(ipAddress);    
    
    if (ipAllowList.length==0)
    {
        res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        return;
    }
    else
    {
        res.send('admin bank api');
        return;
    }
    
};

exports.addProduct = async function(req, res) {
    
    console.log('addProduct');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    const result = await productList.create(req.body);
                    if (result) {

                        res.status(202).json(
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
                                message: 'Error Create Product',
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

exports.editProduct = async function(req, res) {
    
    console.log('editProduct');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    const result = await productList.updateByID(req.body);
                    if (result) {

                        res.status(202).json(
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
                                message: 'Error Create Product',
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

exports.deleteProduct = async function(req, res) {
    
    console.log('deleteProduct');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    const result = await productList.deleteByID(req.body);
                    if (result) {

                        res.status(202).json(
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
                                message: 'Error Create Product',
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

exports.inActiveProduct = async function(req, res) {
    
    console.log('inActiveProduct');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    const result = await productList.inActiveProduct(req.body);
                    if (result) {

                        res.status(202).json(
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
                                message: 'Error Create Product',
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

exports.GetActiveProduct = async function(req, res) {
    console.log('GetActiveproduct');

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

            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid?headers.userid:'';
                const token = headers.token?headers.token:'';

                let IsAuth = await MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (true) 
                {
                    
                    let tmpData = await productList.findAllActive();
                    
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

exports.OrderProduct = async function(req, res) {
    console.log('Orderproduct');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let username = req.body.username;
                    let productId = req.body.productId;
                    let addressproduct = req.body.address;

                    let row_user = await MemberList.findById(username);
                    let row_product = await productList.findById(productId);  
                    
                    let chkproduct = row_product['id']?true:false;
                    if (chkproduct)
                    {
                        if (row_product['type']!="credit" && addressproduct=="") 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Please Enter Address for receive product',
                                    auth : false,
                                    data : [],
                                }
                            );
                            return;
                        }

                        let currentcredit = parseFloat(row_user['credit']);
                        let currentpoint = parseFloat(row_user['Point']);
                        let usepoint = parseFloat(row_product['use_point']);

                        if (currentpoint < usepoint )
                        {
                            
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Point not enough to get product',
                                    auth : false,
                                    data : [],
                                }
                            );
                            return;
                        }

                        let data = {                            
                            "username" : row_user["id"] ,
                            "mobile_no" : row_user["mobile_no"] ,
                            "type" : row_product["type"] ,
                            "product_id" : row_product["id"] ,
                            "date" : timerHelper.getDateTimeNowString() ,
                            "status" : 1 ,
                            "product_name" : row_product["product_name"] ,
                            "address" : addressproduct ,
                            "credit" : row_product['credit']  ,
                        };

                        
                        if (row_product['type']=="credit")
                        {
                            let id = TransactionList.generateRequestID();
                            let response = AgentMain.depositCredit("",username,row_product['credit']);
                            if (response.msgerror) 
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Agent Problem : ' + response.msgerror,
                                        auth : true,
                                        data : [],
                                    }
                                );
                                return;
                            }
                            else
                            {
                                let aff = {
                                    aff_user:null,
                                    aff_user_credit:0,
                                };

                                TransactionManage.create(id, row_user, "SYSTEM",
                                parseFloat(row_product['credit']), 0, currentcredit, currentcredit + parseFloat(row_product['credit']), "product"
                                    , row_user['bank_acc_no'], row_user['bank_name']
                                    , timerHelper.convertDatetimeToString(new Date()), ''
                                    , null
                                    , null
                                    , null,'SYSTEM', 1
                                    , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                                    , 'เติมเครดิตจากการแลกรางวัล'
                                    ,null,null,null
                                    , aff['aff_user'], null, aff['aff_user_credit']
                                )

                                await MainModel.update("sl_users",{credit: currentcredit + parseFloat(row_product['credit'])},{id:username});                                
                                await MainModel.insert("get_product_history",data);							
                                await MainModel.update("sl_users",{Point: currentpoint - usepoint},{id:username});           
                                
                                res.status(200).json(
                                    { 
                                        status: 'success', 
                                        message: 'Received credit :'+row_product['credit'],
                                        auth : true,                        
                                        data : [],
                                    }
                                );
                                return;
                            }

                            
                        }
                        else
                        {
                            MainModel.insert("get_product_history",data);
                            MainModel.update("sl_users",{Point: currentpoint - usepoint},{id:username});

                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: 'Staff will send product to your address.',
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
                                message: 'Not found product please contact support team.',
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
        return;
    }
    
    

    
};

exports.SendProductByID = async function(req, res) {
    
    console.log('SendProductByID');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let username = req.body.username;
                    let sendToUserId = req.body.sendToUserId;                    
                    let productId = req.body.productId;
                    let quantity = req.body.quantity;

                    const [
                        row_user,
                        sent_to_user,
                        row_product
                    ] = await Promise.all([
                
                        MemberList.findById(username),
                        MemberList.findById(sendToUserId),
                        productList.findById(productId),
                    ]);
                    
                    let chkproduct = row_product['id']?true:false;
                    if (chkproduct)
                    {
                        if (quantity<=0) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Please Enter Quantity',
                                    auth : false,
                                    data : [],
                                }
                            );
                            return;
                        }

                        let currentcredit = parseFloat(row_user['credit']);
                        let useTotalCredit = parseFloat(row_product['use_credit']) * parseFloat(quantity);
                        
                        if (currentcredit < useTotalCredit )
                        {
                            
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: 'Not enough Point',
                                    auth : false,
                                    data : [],
                                }
                            );
                            return;
                        }

                        let data = {                            
                            "gift_to" : sent_to_user["id"] ,
                            "gift_to_name" : sent_to_user["fullname"] ,
                            "order_by" : row_user["id"] ,                            
                            "order_by_name" : row_user["fullname"] ,
                            "product_id" : row_product["id"] ,
                            "product_name" : row_product["product_name"] ,
                            "product_buy_price" : row_product["use_credit"] ,
                            "product_sell_price" : row_product["give_credit"] ,
                            "date" : timerHelper.convertDatetimeToString(cTime) ,
                            "exchanged" : false,
                            "quantity" : quantity
                        };
                        
                        let id = await TransactionList.generateRequestID();
                       
                        let aff = {
                            aff_user:null,
                            aff_user_credit:0,
                        };

                        await TransactionManage.create(id, row_user, "SYSTEM",
                        parseFloat(row_product['use_credit']), 0, currentcredit, currentcredit - parseFloat(useTotalCredit), "product"
                            , row_user['bank_acc_no'], row_user['bank_name']
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null,'SYSTEM', 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , 'ลดเครดิตจากการซื้อสินค้า Id: '+row_product["id"]+", Name: "+row_product["product_name"]+", Buy Price: "+row_product["use_credit"]+", Sell Price: "+row_product["give_credit"]+", Quantity: "+quantity
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        )

                        await MainModel.update("sl_users",{credit: currentcredit - parseFloat(useTotalCredit)},{id:username});                                
                        await MainModel.insert("product_order_history",data);							
                                                
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: 'Use total point :'+useTotalCredit,
                                auth : true,                        
                                data : [],
                            }
                        );
                        return;
                        

                    }
                    else
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found product please contact support team.',
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
        return;
    }
    
    

    
};

exports.ExchangeProductByID = async function(req, res) {
    
    console.log('ExchangeProductByID');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let username = req.body.username;                                     
                    let productOrderId = req.body.productOrderId;
                    
                    const [
                        row_user,                        
                        row_product
                    ] = await Promise.all([
                
                        MemberList.findById(username),                        
                        productList.findById(productId),
                    ]);
                    
                    let chkproduct = row_product['id']?true:false;
                    if (chkproduct)
                    {
                        let currentcredit = parseFloat(row_user['credit']);
                        let useTotalCredit = parseFloat(row_product['product_sell_price']) * parseFloat(row_product['quantity']);
                        
                        let data = {                            
                            "gift_to" : sent_to_user["id"] ,
                            "gift_to_name" : sent_to_user["fullname"] ,
                            "order_by" : row_user["id"] ,                            
                            "order_by_name" : row_user["fullname"] ,
                            "product_id" : row_product["id"] ,
                            "product_name" : row_product["product_name"] ,
                            "product_buy_price" : row_product["use_credit"] ,
                            "product_sell_price" : row_product["give_credit"] ,
                            "date" : timerHelper.convertDatetimeToString(cTime) ,
                            "exchanged" : false,
                            "quantity" : quantity
                        };
                        
                        let id = await TransactionList.generateRequestID();
                       
                        let aff = {
                            aff_user:null,
                            aff_user_credit:0,
                        };

                        await TransactionManage.create(id, row_user, "SYSTEM",
                        parseFloat(row_product['use_credit']), 0, currentcredit, currentcredit - parseFloat(useTotalCredit), "product"
                            , row_user['bank_acc_no'], row_user['bank_name']
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null,'SYSTEM', 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , 'ลดเครดิตจากการซื้อสินค้า Id: '+row_product["id"]+", Name: "+row_product["product_name"]+", Buy Price: "+row_product["use_credit"]+", Sell Price: "+row_product["give_credit"]+", Quantity: "+quantity
                            ,null,null,null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        )

                        await MainModel.update("sl_users",{credit: currentcredit - parseFloat(useTotalCredit)},{id:username});                                
                        await MainModel.insert("product_order_history",data);							
                                                
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: 'Use total point :'+useTotalCredit,
                                auth : true,                        
                                data : [],
                            }
                        );
                        return;
                        

                    }
                    else
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found product please contact support team.',
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
        return;
    }
    
    

    
};

exports.GetHistoryOrderByMemberID = async function(req, res) {
    console.log('GetHistoryOrderByMemberID');

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

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await MemberList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let startTime = req.body.start;
                    let endTime = req.body.end;
                    let tmpData = await productList.getHistoryOrderByMemberID(userid,timerHelper.convertDatetimeToString(startTime),timerHelper.convertDatetimeToString(endTime));
                    
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
