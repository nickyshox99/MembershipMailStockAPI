'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const AdminBankList = require('../models/adminbanklist.model');
const IpAllowList = require('../models/ipallowlist.model');
const MainModel = require('../models/main.model');
const productList = require('../models/productlist.model');
const lineChatSetting = require('../models/linechatsetting.model');
const LineChatAPI = require('./../modules/lineChatAPI');
const EmailStock = require('../models/emailStock.model');
const oSecretkey = require('../../config/secret');

const UsersEmail = require('../models/usersemail.model');
const Personal_Email = require('../models/personal_email.model');


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

exports.default = async function (req, res) {
    const ipAddress = await IpAllowList.getIPv4Address(req);
    // const ipAddress = req.socket.remoteAddress;
    // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
    const ipAllowList = await IpAllowList.findById(ipAddress);

    if (ipAllowList.length == 0) {
        res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
        return;
    }
    else {
        res.send('admin bank api');
        return;
    }

};

exports.addProduct = async function (req, res) {

    console.log('addProduct');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
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

                let IsAuth = AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                const objData = req.body;

                if (IsAuth) {
                    const result = await productList.create(objData);
                    if (result) {

                        res.status(202).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                            }
                        );
                        return;
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Error Create Product',
                                auth: true,
                                data: [],
                            }
                        );
                        return;
                    }

                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.updatebyId = async function (req, res) {

    console.log('updatebyId');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
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

                let IsAuth = AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                const objData = req.body;

                if (objData.id == undefined || objData.id == null || objData.id == "") {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Product ID not found',
                            auth: false,
                            data: [],
                        }
                    );
                    return;

                }

                if (IsAuth) {
                    const result = await productList.updateByID(objData);
                    if (result) {

                        res.status(202).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                            }
                        );
                        return;
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Error Create Product',
                                auth: true,
                                data: [],
                            }
                        );
                        return;
                    }

                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.updateEndDateById = async function (req, res) {

    console.log('updateEndDateById');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
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

                let IsAuth = AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                const objData = req.body;

                if (objData.id == undefined || objData.id == null || objData.id == "") {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Product ID not found',
                            auth: false,
                            data: [],
                        }
                    );
                    return;

                }

                if (IsAuth) {
                    const result = await productList.updateEndDateById(objData);
                    if (result) {

                        res.status(202).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                            }
                        );
                        return;
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Error Update Enddate Product',
                                auth: true,
                                data: [],
                            }
                        );
                        return;
                    }

                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};


exports.deleteProduct = async function (req, res) {

    console.log('deleteProduct');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
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

                let IsAuth = AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    const result = await productList.deleteByID(req.body);
                    if (result) {

                        res.status(202).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                            }
                        );
                        return;
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Error Create Product',
                                auth: true,
                                data: [],
                            }
                        );
                        return;
                    }

                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.inActiveProduct = async function (req, res) {

    console.log('inActiveProduct');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
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

                let IsAuth = AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    const result = await productList.inActiveProduct(req.body);
                    if (result) {

                        res.status(202).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                            }
                        );
                        return;
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Error Create Product',
                                auth: true,
                                data: [],
                            }
                        );
                        return;
                    }

                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetProductById = async function (req, res) {

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid ? headers.userid : '';
                const token = headers.token ? headers.token : '';

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;


                let tmpData = await productList.findById(req.body.id);
                if (tmpData) {
                    res.status(200).json(tmpData);
                }
                else {
                    res.status(202).json({ status: 'error', message: 'Product not found' });
                }
                return;


            }
        }

    } catch (error) {
        console.log(error);
        res.status(202).json(
            {
                status: 'error',
                message: error.message,
                auth: false,
                data: [],
            }
        );
        return;
    }

}

exports.GetActiveProduct = async function (req, res) {
    console.log('GetActiveproduct');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid ? headers.userid : '';
                const token = headers.token ? headers.token : '';

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (true) {

                    let tmpData = await productList.findAllActive();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetProductSetting = async function (req, res) {
    console.log('GetProductSetting');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid ? headers.userid : '';
                const token = headers.token ? headers.token : '';

                let IsAuth = await MemberList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (true) {

                    let tmpData = await productList.findAll();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.OrderProduct = async function (req, res) {
    console.log('Orderproduct');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await MemberList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let username = req.body.username;
                    let productId = req.body.productId;
                    let addressproduct = req.body.address;

                    let row_user = await MemberList.findById(username);
                    let row_product = await productList.findById(productId);

                    let chkproduct = row_product['id'] ? true : false;
                    if (chkproduct) {
                        if (row_product['type'] != "credit" && addressproduct == "") {
                            res.status(202).json(
                                {
                                    status: 'error',
                                    message: 'Please Enter Address for receive product',
                                    auth: false,
                                    data: [],
                                }
                            );
                            return;
                        }

                        let currentcredit = parseFloat(row_user['credit']);
                        let currentpoint = parseFloat(row_user['Point']);
                        let usepoint = parseFloat(row_product['use_point']);

                        if (currentpoint < usepoint) {

                            res.status(202).json(
                                {
                                    status: 'error',
                                    message: 'Point not enough to get product',
                                    auth: false,
                                    data: [],
                                }
                            );
                            return;
                        }

                        let data = {
                            "username": row_user["id"],
                            "mobile_no": row_user["mobile_no"],
                            "type": row_product["type"],
                            "product_id": row_product["id"],
                            "date": timerHelper.getDateTimeNowString(),
                            "status": 1,
                            "product_name": row_product["product_name"],
                            "address": addressproduct,
                            "credit": row_product['credit'],
                        };


                        if (row_product['type'] == "credit") {
                            let id = TransactionList.generateRequestID();
                            let response = AgentMain.depositCredit("", username, row_product['credit']);
                            if (response.msgerror) {
                                res.status(202).json(
                                    {
                                        status: 'error',
                                        message: 'Agent Problem : ' + response.msgerror,
                                        auth: true,
                                        data: [],
                                    }
                                );
                                return;
                            }
                            else {
                                let aff = {
                                    aff_user: null,
                                    aff_user_credit: 0,
                                };

                                TransactionManage.create(id, row_user, "SYSTEM",
                                    parseFloat(row_product['credit']), 0, currentcredit, currentcredit + parseFloat(row_product['credit']), "product"
                                    , row_user['bank_acc_no'], row_user['bank_name']
                                    , timerHelper.convertDatetimeToString(new Date()), ''
                                    , null
                                    , null
                                    , null, 'SYSTEM', 1
                                    , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                                    , 'เติมเครดิตจากการแลกรางวัล'
                                    , null, null, null
                                    , aff['aff_user'], null, aff['aff_user_credit']
                                )

                                await MainModel.update("sl_users", { credit: currentcredit + parseFloat(row_product['credit']) }, { id: username });
                                await MainModel.insert("get_product_history", data);
                                await MainModel.update("sl_users", { Point: currentpoint - usepoint }, { id: username });

                                res.status(200).json(
                                    {
                                        status: 'success',
                                        message: 'Received credit :' + row_product['credit'],
                                        auth: true,
                                        data: [],
                                    }
                                );
                                return;
                            }


                        }
                        else {
                            MainModel.insert("get_product_history", data);
                            MainModel.update("sl_users", { Point: currentpoint - usepoint }, { id: username });

                            res.status(200).json(
                                {
                                    status: 'success',
                                    message: 'Staff will send product to your address.',
                                    auth: true,
                                    data: [],
                                }
                            );

                            return;
                        }



                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found product please contact support team.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.SendProductByID = async function (req, res) {

    console.log('SendProductByID');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
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

                let IsAuth = MemberList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
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

                    let chkproduct = row_product['id'] ? true : false;
                    if (chkproduct) {
                        if (quantity <= 0) {
                            res.status(202).json(
                                {
                                    status: 'error',
                                    message: 'Please Enter Quantity',
                                    auth: false,
                                    data: [],
                                }
                            );
                            return;
                        }

                        let currentcredit = parseFloat(row_user['credit']);
                        let useTotalCredit = parseFloat(row_product['use_credit']) * parseFloat(quantity);

                        if (currentcredit < useTotalCredit) {

                            res.status(202).json(
                                {
                                    status: 'error',
                                    message: 'Not enough Point',
                                    auth: false,
                                    data: [],
                                }
                            );
                            return;
                        }

                        let data = {
                            "gift_to": sent_to_user["id"],
                            "gift_to_name": sent_to_user["fullname"],
                            "order_by": row_user["id"],
                            "order_by_name": row_user["fullname"],
                            "product_id": row_product["id"],
                            "product_name": row_product["product_name"],
                            "product_buy_price": row_product["use_credit"],
                            "product_sell_price": row_product["give_credit"],
                            "date": timerHelper.convertDatetimeToString(cTime),
                            "exchanged": false,
                            "quantity": quantity
                        };

                        let id = await TransactionList.generateRequestID();

                        let aff = {
                            aff_user: null,
                            aff_user_credit: 0,
                        };

                        await TransactionManage.create(id, row_user, "SYSTEM",
                            parseFloat(row_product['use_credit']), 0, currentcredit, currentcredit - parseFloat(useTotalCredit), "product"
                            , row_user['bank_acc_no'], row_user['bank_name']
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null, 'SYSTEM', 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , 'ลดเครดิตจากการซื้อสินค้า Id: ' + row_product["id"] + ", Name: " + row_product["product_name"] + ", Buy Price: " + row_product["use_credit"] + ", Sell Price: " + row_product["give_credit"] + ", Quantity: " + quantity
                            , null, null, null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        )

                        await MainModel.update("sl_users", { credit: currentcredit - parseFloat(useTotalCredit) }, { id: username });
                        await MainModel.insert("product_order_history", data);

                        res.status(200).json(
                            {
                                status: 'success',
                                message: 'Use total point :' + useTotalCredit,
                                auth: true,
                                data: [],
                            }
                        );
                        return;


                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found product please contact support team.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.DeleteOrderByID = async function (req, res) {

    console.log('DeleteOrderByID');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                let cTime = new Date();
                cTime = new Date(cTime.getTime() + (offsetTime));

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = MemberList.isAuthenicated(userid, token);
                let IsAuth = true;

                if (IsAuth) {
                    const result = await productList.deleteOrderByID(req.body);
                    if (result) {

                        res.status(202).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                            }
                        );
                        return;
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Error Create Product',
                                auth: true,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.ExchangeProductByID = async function (req, res) {

    console.log('ExchangeProductByID');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
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

                let IsAuth = MemberList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let username = req.body.username;
                    let productOrderId = req.body.productOrderId;

                    const [
                        row_user,
                        row_product
                    ] = await Promise.all([

                        MemberList.findById(username),
                        productList.findById(productId),
                    ]);

                    let chkproduct = row_product['id'] ? true : false;
                    if (chkproduct) {
                        let currentcredit = parseFloat(row_user['credit']);
                        let useTotalCredit = parseFloat(row_product['product_sell_price']) * parseFloat(row_product['quantity']);

                        let data = {
                            "gift_to": sent_to_user["id"],
                            "gift_to_name": sent_to_user["fullname"],
                            "order_by": row_user["id"],
                            "order_by_name": row_user["fullname"],
                            "product_id": row_product["id"],
                            "product_name": row_product["product_name"],
                            "product_buy_price": row_product["use_credit"],
                            "product_sell_price": row_product["give_credit"],
                            "date": timerHelper.convertDatetimeToString(cTime),
                            "exchanged": false,
                            "quantity": quantity
                        };

                        let id = await TransactionList.generateRequestID();

                        let aff = {
                            aff_user: null,
                            aff_user_credit: 0,
                        };

                        await TransactionManage.create(id, row_user, "SYSTEM",
                            parseFloat(row_product['use_credit']), 0, currentcredit, currentcredit - parseFloat(useTotalCredit), "product"
                            , row_user['bank_acc_no'], row_user['bank_name']
                            , timerHelper.convertDatetimeToString(new Date()), ''
                            , null
                            , null
                            , null, 'SYSTEM', 1
                            , timerHelper.convertDatetimeToString(new Date()), 0, timerHelper.convertDatetimeToString(new Date())
                            , 'ลดเครดิตจากการซื้อสินค้า Id: ' + row_product["id"] + ", Name: " + row_product["product_name"] + ", Buy Price: " + row_product["use_credit"] + ", Sell Price: " + row_product["give_credit"] + ", Quantity: " + quantity
                            , null, null, null
                            , aff['aff_user'], null, aff['aff_user_credit']
                        )

                        await MainModel.update("sl_users", { credit: currentcredit - parseFloat(useTotalCredit) }, { id: username });
                        await MainModel.insert("product_order_history", data);

                        res.status(200).json(
                            {
                                status: 'success',
                                message: 'Use total point :' + useTotalCredit,
                                auth: true,
                                data: [],
                            }
                        );
                        return;


                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found product please contact support team.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetHistorySubScribeOrderByMemberID = async function (req, res) {
    console.log('GetHistorySubScribeOrderByMemberID');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let memberId = req.body.member_id;

                    let tmpData = await productList.GetHistorySubScribeOrderByMemberID(memberId);

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetHistorySubScribeOrderNotApprove = async function (req, res) {
    console.log('GetHistorySubScribeOrderNotApprove');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let tmpData = await productList.GetHistorySubScribeOrderNotApprove();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetHistorySubScribeOrderWaitInvitation = async function (req, res) {
    console.log('GetHistorySubScribeOrderWaitInvitation');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let tmpData = await productList.GetHistorySubScribeOrderWaitInvitation();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetHistorySubScribeOrderWaitCheckPayment = async function (req, res) {
    console.log('GetHistorySubScribeOrderWaitCheckPayment');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let tmpData = await productList.GetHistorySubScribeOrderWaitCheckPayment();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetHistorySubScribeOrderCheckedPayment = async function (req, res) {
    console.log('GetHistorySubScribeOrderCheckedPayment');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let tmpData = await productList.GetHistorySubScribeOrderCheckedPayment();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetHistorySubScribeOrderAll = async function (req, res) {
    console.log('GetHistorySubScribeOrderAll');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let tmpData = await productList.GetHistorySubScribeOrderAll();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetOrderNearExpire = async function (req, res) {
    console.log('GetOrderNearExpire');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let tmpData = await productList.GetOrderNearExpire();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                // message: error.message,
                message: 'Internal error: cannot load near-expire orders.',
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetOrderExpired = async function (req, res) {
    console.log('GetOrderExpired');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let tmpData = await productList.GetOrderExpired();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                // message: error.message,
                message: 'Internal error: cannot load expired orders.',
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetSubScribeOrderById = async function (req, res) {
    console.log('GetSubScribeOrderById');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                const { id, user_id } = req.body;
                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;


                if (IsAuth) {
                    let tmpData = await productList.GetSubScribeOrderById(id, user_id);
                    let bankData = await AdminBankList.findAllActive();

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',

                            auth: true,
                            data: tmpData,
                            bank_data: bankData.length > 0 ? bankData[0] : {},
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.GetHistoryOrderByMemberID = async function (req, res) {
    console.log('GetHistoryOrderByMemberID');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await MemberList.isAuthenicated(userid, token);
                // let IsAuth = true;

                if (IsAuth) {
                    let startTime = req.body.start;
                    let endTime = req.body.end;
                    let tmpData = await productList.getHistoryOrderByMemberID(userid, timerHelper.convertDatetimeToString(startTime), timerHelper.convertDatetimeToString(endTime));

                    res.status(200).json(
                        {
                            status: 'success',
                            message: '',
                            auth: true,
                            data: tmpData,
                        }
                    );
                    return;
                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.CreateSubScribeOrder = async function (req, res) {
    console.log('CreateSubScribeOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) {
                    let admin = req.body.username ? req.body.username : "System";
                    let user_id = req.body.user_id;
                    let line_id = req.body.line_id || "";
                    let product_id = req.body.product_id;
                    let email = req.body.email || "";
                    let note = req.body.note;

                    let row_product = await productList.findById(product_id);


                    let chkproduct = row_product['id'] ? true : false;
                    if (chkproduct) {

                        let data = {
                            "user_id": line_id,
                            "email": email,
                            "product_id": row_product["id"],
                            "subscription_type_id": row_product["subscription_type_id"],
                            "product_name": row_product["product_name"],
                            "create_by": admin,
                            "create_date": timerHelper.getDateTimeNowString(),
                            "buy_date": timerHelper.getDateTimeNowString(),
                            "note": note,
                        };

                        let tmpData = await productList.createSubScribeOrder(data);
                        if (tmpData) {
                            res.status(200).json(
                                {
                                    status: 'success',
                                    message: 'Order created successfully.',
                                    auth: true,
                                    data: [],
                                }
                            );
                        }
                        else {
                            res.status(202).json(
                                {
                                    status: 'error',
                                    message: 'Create order failed.',
                                    auth: false,
                                    data: [],
                                }
                            );
                            return;
                        }

                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found product please contact support team.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }




};

exports.CreateAndApproveSubScribeOrder = async function (req, res) {
    console.log('CreateAndApproveSubScribeOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) {
                    let admin = req.body.username ? req.body.username : "System";
                    let user_id = req.body.user_id;
                    let line_id = req.body.line_id || "";
                    let product_id = req.body.product_id;
                    let email = req.body.email || "";
                    let note = req.body.note;
                    let purchase_type = req.body.purchase_type || "";                    
                    let row_product = await productList.findById(product_id);

                    //Check Stock
                    // if (purchase_type=="shop_personal") {
                    //     let stock = await EmailStock.getEmailStockPersonal()
                    //     if (!stock || !(stock.length>0)) {
                    //         res.status(202).json(
                    //             {
                    //                 status: 'error',
                    //                 message: 'สินค้าหมด กรุณาติดต่อแอดมิน',
                    //                 auth: false,
                    //                 data: [],
                    //             }
                    //         );
                    //         return;
                    //     }
                    // }else if (purchase_type=="shop_family") {
                    //     let stock = await EmailStock.getEmailStockFamily()
                    //     if (!stock || !(stock.length>0)) {
                    //         res.status(202).json(
                    //             {
                    //                 status: 'error',
                    //                 message: 'สินค้าหมด กรุณาติดต่อแอดมิน',
                    //                 auth: false,
                    //                 data: [],
                    //             }
                    //         );
                    //         return;
                    //     }
                    // }else if (purchase_type=="email") {
                    //     let stock = await EmailStock.getRemainInviteStock()
                    //     if (!stock || !(stock.length>0)) {
                    //         res.status(202).json(
                    //             {
                    //                 status: 'error',
                    //                 message: 'สินค้าหมด กรุณาติดต่อแอดมิน',
                    //                 auth: false,
                    //                 data: [],
                    //             }
                    //         );
                    //         return;
                    //     }
                    // }


                    let chkproduct = row_product['id'] ? true : false;
                    if (chkproduct) {
                        let start_date = new Date();
                        let end_date = new Date(start_date.getTime() + (row_product["subscription_day"] * 86400000));

                        //calculate start_date,end_date
                        let lastHistData = await productList.getLastSubscriptionOrderByMemberID(line_id, row_product["subscription_type_id"], purchase_type);

                        if (lastHistData.length > 0) {
                            start_date = new Date(lastHistData[0]["end_date"].getTime() + (86400000));
                            end_date = new Date(start_date.getTime() + (row_product["subscription_day"] * 86400000));
                        }

                        let data = {
                            "user_id": line_id,
                            "email": email,
                            "product_id": row_product["id"],
                            "subscription_type_id": row_product["subscription_type_id"],
                            "product_name": row_product["product_name"],
                            "create_by": admin,
                            "create_date": timerHelper.getDateTimeNowString(),
                            "approve_by": admin,
                            "approve_date": timerHelper.getDateTimeNowString(),
                            "buy_date": timerHelper.getDateTimeNowString(),
                            "start_date": timerHelper.convertDatetimeToString(start_date),
                            "end_date": timerHelper.convertDatetimeToString(end_date),
                            "note": note,
                            "sent_email_by": "system",
                            "sent_email_at": timerHelper.getDateTimeNowString(),
                            "wait_check_payment": 1,
                            "purchase_type": purchase_type,
                        };

                        let tmpData = await productList.createAndApproveSubScribeOrder(data);
                        // console.log('data:', tmpData.data.id);
                        console.log('data:', tmpData.id);
                        // console.log('create result:', tmpData);
                        if (tmpData) {
                            res.status(200).json(
                                {
                                    status: 'success',
                                    message: '',
                                    auth: true,
                                    // data:[],
                                    data: tmpData,
                                    order_id: tmpData.id,
                                }
                            );
                        }
                        else {
                            res.status(202).json(
                                {
                                    status: 'error',
                                    message: 'Create order failed.',
                                    auth: false,
                                    data: [],
                                }
                            );
                            return;
                        }

                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found product please contact support team.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.ApproveSubScribeOrder = async function (req, res) {
    console.log('ApproveSubScribeOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                //let IsAuth = true;

                if (IsAuth) {
                    let admin = req.body.username ? req.body.username : "System";
                    let order_id = req.body.order_id;
                    let note = req.body.note;

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                    let row_product = await productList.findById(row_order['product_id']);
                    let row_user = await MemberList.findById(row_order['user_id']);

                    if (row_user.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found user.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let chkproduct = row_product['id'] ? true : false;
                    if (chkproduct) {
                        let start_date = new Date();
                        let end_date = new Date(start_date.getTime() + (row_product["subscription_day"] * 86400000));

                        //calculate start_date,end_date
                        let lastHistData = await productList.getLastSubscriptionOrderByMemberID(row_user["id"], row_product["subscription_type_id"], row_order["email"]);
                        if (lastHistData.length > 0) {
                            start_date = new Date(lastHistData[0]["end_date"].getTime() + (86400000));
                            end_date = new Date(start_date.getTime() + (row_product["subscription_day"] * 86400000));
                        }

                        let objData = {
                            "id": order_id,
                            "approve_by": admin,
                            "approve_date": timerHelper.getDateTimeNowString(),
                            "start_date": timerHelper.convertDatetimeToString(start_date),
                            "end_date": timerHelper.convertDatetimeToString(end_date),
                            "note": note,
                        };

                        let tmpData = await productList.approveOrderById(objData);
                        if (tmpData) {
                            res.status(200).json(
                                {
                                    status: 'success',
                                    message: '',
                                    auth: true,
                                    data: [],
                                }
                            );
                        }
                        else {
                            res.status(202).json(
                                {
                                    status: 'error',
                                    message: 'Approve order failed.',
                                    auth: false,
                                    data: [],
                                }
                            );
                            return;
                        }

                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found product please contact support team.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.SentFamliyInviteOrder = async function (req, res) {
    console.log('SentFamliyInviteOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                //let IsAuth = true;

                if (IsAuth) {
                    let admin = req.body.username ? req.body.username : "System";
                    let order_id = req.body.order_id;
                    let note = req.body.note;

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_user = await MemberList.findById(row_order['user_id']);
                    if (row_user.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found user.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let objData = {
                        "id": order_id,
                        "sent_email_by": admin,
                        "sent_email_at": timerHelper.getDateTimeNowString(),
                        "note": note,
                    };

                    let tmpData = await productList.SentFamliyInviteOrder(objData);
                    if (tmpData) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Approve order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.SkipFamliyInviteOrder = async function (req, res) {
    console.log('SkipFamliyInviteOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                //let IsAuth = true;

                if (IsAuth) {
                    let admin = req.body.username ? req.body.username : "System";
                    let order_id = req.body.order_id;
                    let note = req.body.note;

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_user = await MemberList.findById(row_order['user_id']);
                    if (row_user.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found user.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let objData = {
                        "id": order_id,
                        "sent_email_by": admin,
                        "sent_email_at": timerHelper.getDateTimeNowString(),
                        "note": note,
                    };

                    let tmpData = await productList.SkipFamliyInviteOrder(objData);
                    if (tmpData) {

                        //Sent Message for payment
                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );

                        let sourceUserId = row_user["line_userid"];
                        let contact = await lineChatSetting.getContactByUserId(sourceUserId);
                        let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

                        if (tmpChatSetting['status'] != 1) {
                            return;
                        }

                        let channelToken = "";
                        channelToken = tmpChatSetting['channel_token'];

                        const lineChatAPI = new LineChatAPI();
                        lineChatAPI.setToken(channelToken);

                        let msg = "";
                        msg = "ขณะนี้แพ็คเก็จ " + row_order['product_name'] + " ของ " + row_order['email'] + " รอการชำระเงิน\n";
                        msg += "ท่านสามารถชำระเงินได้ตามลิงค์นี้ \n";
                        msg += oSecretkey.webDomain + "confirmpayment?id=" + row_order['id'] + "&email=" + row_order['email'];



                        const tmpSend = await lineChatAPI.pushMessage(sourceUserId, msg);
                        if (tmpSend['error']) {
                            res.status(200).json(
                                {
                                    status: 'success',
                                    message: tmpSend['error'],
                                    auth: true,
                                    data: tmpReturnData,
                                }
                            );
                            return;
                        }


                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Approve order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};


exports.PaymentOrderWithSlip = async function (req, res) {
    console.log('PaymentOrderWithSlip');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) {
                    let order_id = req.body.order_id ?? 0;
                    let slip_file_url = req.body.slip_file_url ?? '';

                    if (order_id == 0 || slip_file_url == "") {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found slip or order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                    let objData = {
                        "id": order_id,
                        "slip_file_url": slip_file_url,
                        "slip_file_at": timerHelper.getDateTimeNowString(),
                    
                    };

                    let tmpData = await productList.PaymentOrderWithSlip(objData);
                    if (tmpData) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Payment order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                message: "PaymentOrderWithSlip: " + error.message,
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.SentPaymentMessageOrder = async function (req, res) {
    console.log('SentPaymentMessageOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                //let IsAuth = true;

                if (IsAuth) {
                    let order_id = req.body.order_id ?? 0;
                    let days_left = req.body.days_left ?? 0;

                    if (order_id == 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found slip or order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_user = await MemberList.findById(row_order['user_id']);
                    if (row_user.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found user.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let sourceUserId = row_user["line_userid"];
                    let contact = await lineChatSetting.getContactByUserId(sourceUserId);
                    let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

                    if (tmpChatSetting['status'] != 1) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'This line is not active',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let channelToken = "";
                    channelToken = tmpChatSetting['channel_token'];

                    const lineChatAPI = new LineChatAPI();
                    lineChatAPI.setToken(channelToken);

                    let msg = "";



                    msg = "ขณะนี้แพ็คเก็จ " + row_order['product_name'] + " ของ " + row_order['email'] + " รอการชำระเงิน\n";
                    msg += "ท่านสามารถชำระเงินได้ตามลิงค์นี้ \n";
                    msg += oSecretkey.webDomain + "confirmpayment?id=" + row_order['id'] + "&email=" + row_order['email'];

                    const tmpSend = await lineChatAPI.pushMessage(sourceUserId, msg);
                    if (tmpSend['error']) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: tmpSend['error'],
                                auth: true,
                                // data : tmpReturnData,
                                data: [],
                            }
                        );
                        return;
                    }

                    let objData = {
                        "offer_at": timerHelper.getDateTimeNowString(),
                        "to_email": row_order.email,
                        "to_userid": row_order.user_id,
                        "subscription_type_id": row_order.subscription_type_id,
                        "offer_by": userid,
                    };

                    let tmpData = await productList.SentPaymentMessageOrder(objData);
                    if (tmpData) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Payment order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.VerifySlipOrder = async function (req, res) {
    console.log('VerifySlipOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                //let IsAuth = true;

                if (IsAuth) {
                    let order_id = req.body.order_id ?? 0;
                    let slip_correct = req.body.slip_correct;
                    let invite_link = req.body.invite_link ?? "";

                    if (!slip_correct || order_id == 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found slip or order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [user_id],
                            }
                        );
                        return;
                    }


                    let objData = {
                        "id": order_id,
                        "slip_correct": slip_correct,
                        "check_slip_by": userid,
                        "check_slip_at": timerHelper.getDateTimeNowString(),                        
                    };

                    // ถ้า slip ไม่ถูกต้อง (slip_correct = 0) ให้ update เฉพาะข้อมูล order และส่งข้อความแจ้ง user
                    if (slip_correct == 0) {
                        console.log('=== Slip Incorrect - Update Order Status and Send Notification ===');

                        // ดึงข้อมูล order และ user
                        let tmpData2 = await productList.getOrderById(order_id);
                        let user_id = tmpData2['user_id'];

                        // ดึงการตั้งค่า LINE
                        let tmpChatSetting = await MainModel.queryFirstRow(`SELECT * FROM line_setting`);

                        if (tmpChatSetting && tmpChatSetting['status'] == 1) {
                            let channelToken = tmpChatSetting['channel_token'];
                            const lineChatAPI = new LineChatAPI();
                            lineChatAPI.setToken(channelToken);

                            // ส่งข้อความแจ้ง user ว่า slip ไม่ถูกต้อง
                            let msg = "ขออภัยค่ะ สลิปโอนเงินของคุณไม่ถูกต้อง \nกรุณาตรวจสอบและส่งสลิปใหม่อีกครั้งค่ะ\nหรือติดต่อแอดมินหากมีข้อสงสัย";

                            const tmpSend = await lineChatAPI.pushMessage(user_id, msg);
                            if (tmpSend['error']) {
                                console.log('Failed to send LINE notification:', tmpSend['error']);
                            } else {
                                console.log('LINE notification sent successfully for incorrect slip');
                            }
                        }

                        // Update order status
                        let tmpData = await productList.VerifySlipOrder(objData);

                        if (tmpData) {
                            res.status(200).json({
                                status: 'success',
                                message: 'Slip marked as incorrect.',
                                auth: true,
                                data: [],
                            });
                        } else {
                            res.status(202).json({
                                status: 'error',
                                message: 'Failed to update order.',
                                auth: false,
                                data: [],
                            });
                        }
                        return;
                    }

                    // ถ้า slip ถูกต้อง (slip_correct = 1) ให้ดำเนินการส่ง email/password
                    console.log('=== Slip Correct - Processing Email/Password ===');

                    //get email from stock
                    let tmpData2 = await productList.getOrderById(order_id);

                    let user_id = tmpData2['user_id'];
                    let purchase_type = tmpData2['purchase_type']; // default to 'shop'

                    console.log('=== VerifySlipOrder - Check Purchase Type ===');
                    console.log('order_id:', order_id);
                    console.log('purchase_type:', purchase_type);

                    let email = '';
                    let password = '';
                    let emailStock = null;

                    // ตรวจสอบ purchase_type เพื่อเลือกแหล่งข้อมูล email/password
                    if (purchase_type === 'personal') {
                        // กรณี personal: ใช้ email/password จาก users_email
                        console.log('Using email from users_email (personal)');
                        const UsersEmail = require('../models/usersemail.model');
                        const usersEmailData = await UsersEmail.findByOrderId(order_id);

                        if (usersEmailData && usersEmailData.id) {
                            email = usersEmailData.email;
                            password = usersEmailData.password;
                            console.log('Found email in users_email:', email);
                        } else {
                            console.error('No email found in users_email for order_id:', order_id);
                            res.status(202).json({
                                status: 'error',
                                message: 'ไม่พบข้อมูล email ของลูกค้า',
                                auth: false,
                                data: [],
                            });
                            return;
                        }
                    } else if (purchase_type === 'email') {
                        // กรณี email: ใช้เฉพาะ email จาก personal_email (ไม่มี password)
                        console.log('Using email from personal_email (email only)');
                        const Personal_Email = require('../models/personal_email.model');
                        const personalEmailData = await Personal_Email.findByOrderId(order_id);

                        if (personalEmailData && personalEmailData.length > 0 && personalEmailData[0].id) {
                            email = personalEmailData[0].email;
                            password = null; // ไม่ส่ง password
                            console.log('Found email in personal_email:', email);
                        } else {
                            console.error('No email found in personal_email for order_id:', order_id);
                            res.status(202).json({
                                status: 'error',
                                message: 'ไม่พบข้อมูล email ของลูกค้า',
                                auth: false,
                                data: [],
                            });
                            return;
                        }
                    } else if (purchase_type === 'shop_personal') {
                        // กรณี shop_personal: ใช้ email/password จาก subscription_group_user (subscription_group_id = 0)
                        console.log('Using email from subscription_group_user (shop_personal - group_id = 0)');
                        emailStock = await EmailStock.getEmailStockPersonal(user_id);

                        if (emailStock == null) {
                            res.status(202).json({
                                status: 'error',
                                message: 'email personal ที่ว่างหมดแล้ว กรุณาเพิ่ม email ใหม่',
                                auth: false,
                                data: [],
                            });
                            return;
                        }

                        email = emailStock['email'];
                        password = emailStock['password'];
                        console.log('Found email in shop_personal:', email);
                    } else if (purchase_type === 'shop_family') {
                        // กรณี shop_family: ใช้ email/password จาก subscription_group_user (subscription_group_id != 0)
                        console.log('Using email from subscription_group_user (shop_family - group_id != 0)');
                        emailStock = await EmailStock.getEmailStockFamily(user_id);

                        if (emailStock == null) {
                            res.status(202).json({
                                status: 'error',
                                message: 'email family ที่ว่างหมดแล้ว กรุณาเพิ่ม email ใหม่',
                                auth: false,
                                data: [],
                            });
                            return;
                        }

                        email = emailStock['email'];
                        password = emailStock['password'];
                        console.log('Found email in shop_family:', email);
                    } else {
                        // กรณี shop หรือไม่ระบุ: ใช้ email/password จาก email_stock (แบบเดิม)
                        console.log('Using email from email_stock (shop)');
                        emailStock = await EmailStock.getEmailStockByUserId(user_id);

                        if (emailStock == null) {
                            res.status(202).json({
                                status: 'error',
                                message: 'email ที่ว่างหมดแล้ว กรุณาเพิ่ม email ใหม่',
                                auth: false,
                                data: [],
                            });
                            return;
                        }

                        email = emailStock['email'];
                        password = emailStock['password'];
                        console.log('Found email in email_stock:', email);
                    }


                    let tmpChatSetting = [];
                    tmpChatSetting = await MainModel.queryFirstRow(`SELECT * FROM line_setting`);

                    if (tmpChatSetting.length == 0) {

                        res.status(202).json({
                            status: "error",
                            message: 'Not found line setting',
                        });
                        return;
                    }

                    if (tmpChatSetting['status'] != 1) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'This line is not active',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    // Reserve email stock เฉพาะกรณี shop, shop_personal, shop_family เท่านั้น
                    if ((purchase_type === 'shop_personal' || purchase_type === 'shop_family' || (purchase_type !== 'personal' && purchase_type !== 'email')) && emailStock) {
                        let tmpData3 = await EmailStock.reserveEmailStock(emailStock.id, user_id);
                        if (!tmpData3) {
                            res.status(202).json({
                                status: 'error',
                                message: 'reserve email stock failed.',
                                auth: false,
                                data: [],
                            });
                            return;
                        }
                        console.log('Email stock reserved successfully for purchase_type:', purchase_type);
                    }


                    let channelToken = "";
                    channelToken = tmpChatSetting['channel_token'];

                    const lineChatAPI = new LineChatAPI();
                    lineChatAPI.setToken(channelToken);

                    let msg = "";                    

                    if (purchase_type === 'personal') {
                        let paymentHistory = await MainModel.query("SELECT * FROM payment_history WHERE order_id="+order_id)
                        email = paymentHistory[0]['email'] || ''
                        let resultUpdate = MainModel.update("membership_order_history",{email:email},{id:order_id})
            
                        msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลลูกค้ารายบุคคล) "
                        msg += "\n"
                        msg += "\n⚠️กรุณารอแอดมินเข้าเมล เพื่อทำการสมัครสักครู่ จะมีการขอยืนยันเพื่อเข้าเมลค่ะ"
                        msg += "\n"
                        msg += "\n⏰แอดมินทำตามคิวนะคะ อาจมีช้าบ้างหากคิวเยอะค่ะ โปรดรอสักครู่น้า"
                        msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
                    }
                    else if (purchase_type === 'email') {
                        let paymentHistory = await MainModel.query("SELECT * FROM personal_email WHERE order_id="+order_id)
                        email = paymentHistory[0]['email'] || ''
                        userid = paymentHistory[0]['user_id'] || ''
                        let resultUpdate = MainModel.update("membership_order_history",{email:email},{id:order_id})
                        let inviteUrl =  EmailStock.getInviteStockFamily(userid,email);
            
                        msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลลูกค้าแบบครอบครัว) "
                        msg += "\nลิ้งค์เข้าครอบครัว : "+ inviteUrl
                        msg += "\nเมลลูกค้า : "+email
                        msg += `\nเช็ควันหมด พิมพ์คำว่า "เช็ควัน" :`
                        
                        msg += "\nวิธีการเข้าใช้งาน"
                        msg += "\nกดลิ้งค์ที่ร้านส่งไป > กดเข้าร่วมได้เลยค่ะ(อย่าลืมเช็คเมลว่าตรงกับที่แจ้งมา)"
                        msg += "\n"
                        msg += "\n⚠️หากติดร้านเก่ามาก่อน อย่าลืมกดออกก่อนน้า พิมพ์คำว่า วิธีออก ส่งมาในแชทนี้ (ไม่ต้องพิมพ์อะไรต่อท้าย)"
                    }
                    else if (purchase_type === 'shop_personal') {
                        
                        msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลร้านรายบุคคล) "
                        msg += "\n"
                        msg += " \n Email : " + email + "\n password : " + password + " \n เช็ควันหมด พิมพ์คำว่า เช็ควัน \n";                    
                        msg += "\n⚠️กรุณารอแอดมินเข้าเมล เพื่อทำการสมัครสักครู่ (อาจยังไม่สามารถเข้าได้ทันทีในครั้งแรก เนื่องจากต้องให้แอดมินตั้งค่าความปลอดภัย 2 ชั้นให้ก่อนค่ะ)"
                        msg += "\n"
                        msg += "\n⏰แอดมินทำตามคิวนะคะ อาจมีช้าบ้างหากคิวเยอะค่ะ โปรดรอสักครู่น้า"
                        msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
                    }
                    else if (purchase_type === 'shop_family') {
                        
                        msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลร้านแบบครอบครัว)"
                        msg += "\n"
                        msg += " \n Email : " + email + "\n password : " + password + " \n เช็ควันหมด พิมพ์คำว่า เช็ควัน \n";                                
                        msg += "\n⚠️กรุณารอแอดมินเข้าเมล เพื่อทำการสมัครสักครู่ (อาจยังไม่สามารถเข้าได้ทันทีในครั้งแรก เนื่องจากต้องให้แอดมินตั้งค่าความปลอดภัย 2 ชั้นให้ก่อนค่ะ)"            
                        msg += "\n"
                        msg += "\n⏰แอดมินทำตามคิวนะคะ อาจมีช้าบ้างหากคิวเยอะค่ะ โปรดรอสักครู่น้า"
                        msg += "\n📝การต่ออายุรอบถัดไป สามารถใช้งานได้เลย ไม่ต้องรอแอดมินเข้าเมลค่ะ"
                        msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
                    }
                    else
                    {            
                        msg += " \n Email : " + email + "\n password : " + password + " \n เพื่อเข้าสู่ระบบ \n";        
                    }
                    

                    const tmpSend = await lineChatAPI.pushMessage(user_id, msg);
                    if (tmpSend['error']) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: 'send line message failed.' + tmpSend['error'],
                                auth: true,
                                // data : tmpReturnData,
                                data: [],
                            }
                        );
                        return;
                    }

                    let tmpData = await productList.VerifySlipOrder(objData);

                    if (tmpData) {
                        // Update status_regis เป็น 1 สำหรับกรณี personal
                        if (purchase_type === 'personal') {
                            const UsersEmail = require('../models/usersemail.model');
                            const updateStatus = await UsersEmail.updateStatusRegisByOrderId(order_id, 1);
                            console.log('Updated status_regis to 1 for order_id:', order_id, 'result:', updateStatus);
                        }

                        // Update status_regis เป็น 1 สำหรับกรณี email
                        if (purchase_type === 'email') {
                            const PersonalEmail = require('../models/personalemail.model');
                            const updateStatus = await PersonalEmail.updateStatusByOrderId(order_id, 1);
                            console.log('Updated status_regis to 1 for email purchase order_id:', order_id, 'result:', updateStatus);
                        }

                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Payment order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }



                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.CancelSubScribeOrder = async function (req, res) {
    console.log('CancelSubScribeOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) {
                    let admin = req.body.username ? req.body.username : "System";
                    let order_id = req.body.order_id;
                    let note = req.body.note;

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                    let objData = {
                        "id": order_id,
                        "note": note,
                    };

                    let tmpData = await productList.cancelOrderById(objData);
                    if (tmpData) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'canceled order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.SentPaymentMessageNearOrder = async function (req, res) {
    console.log('SentPaymentMessageNearOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                //let IsAuth = true;

                if (IsAuth) {
                    let order_id = req.body.order_id ?? 0;
                    let days_left = req.body.days_left ?? 0;

                    if (order_id == 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found slip or order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_user = await MemberList.findById(row_order['user_id']);
                    if (row_user.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found user.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let sourceUserId = row_user["line_userid"];
                    let contact = await lineChatSetting.getContactByUserId(sourceUserId);
                    let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

                    if (tmpChatSetting['status'] != 1) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'This line is not active',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let channelToken = "";
                    channelToken = tmpChatSetting['channel_token'];

                    const lineChatAPI = new LineChatAPI();
                    lineChatAPI.setToken(channelToken);

                    let msg = "";



                    msg = "ขณะนี้แพ็คเก็จ " + row_order['product_name'] + " ของ " + row_order['email'] + " ใกล้หมดอายุ\n";
                    msg += "ท่านสามารถชำระเงินเพื่อต่ออายุได้ตามลิงค์นี้ \n";
                    msg += oSecretkey.webDomain + "confirmpayment?id=" + row_order['id'] + "&email=" + row_order['email'];

                    const tmpSend = await lineChatAPI.pushMessage(sourceUserId, msg);
                    if (tmpSend['error']) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: tmpSend['error'],
                                auth: true,
                                // data : tmpReturnData,
                                data: [],
                            }
                        );
                        return;
                    }

                    let objData = {
                        "offer_at": timerHelper.getDateTimeNowString(),
                        "to_email": row_order.email,
                        "to_userid": row_order.user_id,
                        "subscription_type_id": row_order.subscription_type_id,
                        "offer_by": userid,
                    };

                    let tmpData = await productList.SentPaymentMessageOrder(objData);
                    if (tmpData) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Payment order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};

exports.SentNearExpireMessageOrder = async function (req, res) {
    console.log('SentNearExpireMessageOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }

        const userid = req.headers.userid;
        const token = req.headers.token;
        let IsAuth = await AdminList.isAuthenicated(userid, token);

        if (!IsAuth) {
            res.status(202).json({ status: 'error', message: 'Authenication Failed', auth: false, data: [] });
            return;
        }

        let order_id = req.body.order_id ?? 0;
        let days_left = req.body.days_left ?? 0;

        if (order_id == 0) {
            res.status(202).json({ status: 'error', message: 'Not found order id.', auth: false, data: [] });
            return;
        }

        let row_order = await productList.getOrderById(order_id);
        if (row_order.length <= 0) {
            res.status(202).json({ status: 'error', message: 'Not found order.', auth: false, data: [] });
            return;
        }

        let row_user = await MemberList.findById(row_order['user_id']);
        if (row_user.length <= 0) {
            res.status(202).json({ status: 'error', message: 'Not found user.', auth: false, data: [] });
            return;
        }

        let sourceUserId = row_user["line_userid"];
        let contact = await lineChatSetting.getContactByUserId(sourceUserId);
        let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

        if (tmpChatSetting['status'] != 1) {
            res.status(202).json({ status: 'error', message: 'This line is not active', auth: false, data: [] });
            return;
        }

        let channelToken = tmpChatSetting['channel_token'];
        const lineChatAPI = new LineChatAPI();
        lineChatAPI.setToken(channelToken);

        // 🔹 เปลี่ยนข้อความสำหรับ near expire
        let msg = "แพ็คเก็จ " + row_order['product_name'] + " ของ " + row_order['email']
            + " กำลังจะหมดอายุในอีก " + days_left + " วัน\n";
        msg += "ท่านสามารถต่ออายุได้ตามลิงค์นี้ \n";
        msg += oSecretkey.webDomain + "buyproduct?sourceUserId=" + sourceUserId + "&email=" + row_order['email'];

        const tmpSend = await lineChatAPI.pushMessage(sourceUserId, msg);
        if (tmpSend['error']) {
            res.status(200).json({ status: 'error', message: tmpSend['error'], auth: true, data: [] });
            return;
        }

        let objData = {
            "offer_at": timerHelper.getDateTimeNowString(),
            "to_email": row_order.email,
            "to_userid": row_order.user_id,
            "subscription_type_id": row_order.subscription_type_id,
            "offer_by": userid,
        };

        let tmpData = await productList.SentPaymentMessageOrder(objData);
        if (tmpData) {
            res.status(200).json({ status: 'success', message: '', auth: true, data: [] });
        } else {
            res.status(202).json({ status: 'error', message: 'Near expire message failed.', auth: false, data: [] });
        }

    } catch (error) {
        console.log(error);
        res.status(202).json({ status: 'error', message: error.message, auth: false, data: [] });
    }
};

exports.SentPaymentMessageExpired = async function (req, res) {
    console.log('SentPaymentMessageNearOrder');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {

            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                let IsAuth = await AdminList.isAuthenicated(userid, token);
                //let IsAuth = true;

                if (IsAuth) {
                    let order_id = req.body.order_id ?? 0;
                    let days_left = req.body.days_left ?? 0;

                    if (order_id == 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found slip or order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_order = await productList.getOrderById(order_id);
                    if (row_order.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found order.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let row_user = await MemberList.findById(row_order['user_id']);
                    if (row_user.length <= 0) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Not found user.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let sourceUserId = row_user["line_userid"];
                    let contact = await lineChatSetting.getContactByUserId(sourceUserId);
                    let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

                    if (tmpChatSetting['status'] != 1) {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'This line is not active',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }

                    let channelToken = "";
                    channelToken = tmpChatSetting['channel_token'];

                    const lineChatAPI = new LineChatAPI();
                    lineChatAPI.setToken(channelToken);

                    let msg = "";



                    msg = "ขณะนี้แพ็คเก็จ " + row_order['product_name'] + " ของ " + row_order['email'] + " หมดอายุแล้ว\n";
                    msg += "ท่านสามารถชำระเงินเพื่อต่ออายุได้ตามลิงค์นี้ \n";
                    msg += oSecretkey.webDomain + "confirmpayment?id=" + row_order['id'] + "&email=" + row_order['email'];

                    const tmpSend = await lineChatAPI.pushMessage(sourceUserId, msg);
                    if (tmpSend['error']) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: tmpSend['error'],
                                auth: true,
                                // data : tmpReturnData,
                                data: [],
                            }
                        );
                        return;
                    }

                    let objData = {
                        "offer_at": timerHelper.getDateTimeNowString(),
                        "to_email": row_order.email,
                        "to_userid": row_order.user_id,
                        "subscription_type_id": row_order.subscription_type_id,
                        "offer_by": userid,
                    };

                    let tmpData = await productList.SentPaymentMessageOrder(objData);
                    if (tmpData) {
                        res.status(200).json(
                            {
                                status: 'success',
                                message: '',
                                auth: true,
                                data: [],
                            }
                        );
                    }
                    else {
                        res.status(202).json(
                            {
                                status: 'error',
                                message: 'Payment order failed.',
                                auth: false,
                                data: [],
                            }
                        );
                        return;
                    }


                }
                else {
                    res.status(202).json(
                        {
                            status: 'error',
                            message: 'Authenication Failed',
                            auth: false,
                            data: [],
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
                auth: false,
                data: [],
            }
        );
        return;
    }

};


// Helper function สำหรับส่ง email/password เข้าไลน์ (สำหรับ shop_family และ shop_personal)
exports.sendEmailPasswordToLineForStripe = async function (order_id, user_id, purchase_type) {

    try {
        // ดึงข้อมูล order
        let orderData = await productList.getOrderById(order_id);
        if (!orderData || orderData.length <= 0) {
            console.error('Order not found:', order_id);
            return { success: false, message: 'Order not found' };
        }
        

        let email = '';
        let password = '';
        let emailStock = null;
        let inviteStock='';
        // ดึง email/password ตาม purchase_type
        if (purchase_type === 'shop_personal') {
            console.log('Getting email from shop_personal');
            emailStock = await EmailStock.getEmailStockPersonal(user_id);

            if (emailStock == null) {
                console.error('No email stock available for shop_personal');
                return { success: false, message: 'email personal ที่ว่างหมดแล้ว กรุณาติดต่อแอดมิน' };
            }

            email = emailStock['email'];
            password = emailStock['password'];

            let resultUpdate = MainModel.update("membership_order_history",{email:email},{id:order_id})


        } else if (purchase_type === 'shop_family') {            
            emailStock = await EmailStock.getEmailStockFamily(user_id);

            if (emailStock == null) {
                console.error('No email stock available for shop_family');
                return { success: false, message: 'email family ที่ว่างหมดแล้ว กรุณาติดต่อแอดมิน' };
            }

            email = emailStock['email'];
            password = emailStock['password'];
            let resultUpdate = MainModel.update("membership_order_history",{email:email},{id:order_id})            

        }  else if (purchase_type === 'email') {                   
            inviteStock = await EmailStock.getInviteStockFamily(user_id,orderData['email']);
        }  else if (purchase_type === 'personal') {
            
        }
            else {
            console.error('Invalid purchase_type for this function:', purchase_type);
            return { success: false, message: 'Invalid purchase_type. Only shop_family and shop_personal are supported.' };
        }

        // Reserve email stock
        let reserveResult;

        if (purchase_type === 'email') {
            
        }
        else if (purchase_type === 'personal') {
            
        }
        else
        {
            console.log('Reserving email stock, id:', emailStock.id);
            reserveResult = await EmailStock.reserveEmailStock(emailStock.id, user_id);
            if (!reserveResult) {
                console.error('Failed to reserve email stock');
                return { success: false, message: 'Failed to reserve email stock กรุณาติดต่อแอดมิน' };
            }
            console.log('Email stock reserved successfully');
        }
        
        // ดึงการตั้งค่า LINE
        let tmpChatSetting = await MainModel.queryFirstRow(`SELECT * FROM line_setting`);

        if (!tmpChatSetting || tmpChatSetting.length == 0) {
            console.error('LINE setting not found');
            return { success: false, message: 'LINE setting not found' };
        }

        if (tmpChatSetting['status'] != 1) {
            console.error('LINE is not active');
            return { success: false, message: 'LINE is not active' };
        }

        // ส่งข้อความเข้าไลน์
        let channelToken = tmpChatSetting['channel_token'];
        const lineChatAPI = new LineChatAPI();
        lineChatAPI.setToken(channelToken);

        let msg=''
        if(inviteStock!='')
        {
            
            email = orderData['email'] || ''            

            msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลลูกค้าแบบครอบครัว) "
            msg += "\n"
            msg += "\nลิ้งค์เข้าครอบครัว : "+ inviteStock                
            msg += `\nเมลลูกค้า : ${email}`
            msg += `\nเช็ควันหมด พิมพ์คำว่า "เช็ควัน" `
            msg += "\n"
            msg += "\nวิธีการเข้าใช้งาน"
            msg += "\nกดลิ้งค์ที่ร้านส่งไป > กดเข้าร่วมได้เลยค่ะ(อย่าลืมเช็คเมลว่าตรงกับที่แจ้งมา)"
            msg += "\n"
            msg += "\n⚠️หากติดร้านเก่ามาก่อน อย่าลืมกดออกก่อนน้า พิมพ์คำว่า วิธีออก ส่งมาในแชทนี้ (ไม่ต้องพิมพ์อะไรต่อท้าย)"
            msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
        }
        else if (purchase_type === 'personal') {
            let paymentHistory = await MainModel.query("SELECT * FROM payment_history WHERE order_id="+order_id)
            email = paymentHistory[0]['email'] || ''
            let resultUpdate = MainModel.update("membership_order_history",{email:email},{id:order_id})

            msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลลูกค้ารายบุคคล) "
            msg += "\n"
            msg += "\n⚠️กรุณารอแอดมินเข้าเมล เพื่อทำการสมัครสักครู่ จะมีการขอยืนยันเพื่อเข้าเมลค่ะ"
            msg += "\n"
            msg += "\n⏰แอดมินทำตามคิวนะคะ อาจมีช้าบ้างหากคิวเยอะค่ะ โปรดรอสักครู่น้า"
            msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
        }
        else if (purchase_type === 'shop_personal') {
            
            msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลร้านรายบุคคล) "
            msg += "\n"
            msg += " \n Email : " + email + "\n password : " + password + " \n เช็ควันหมด พิมพ์คำว่า เช็ควัน \n";                    
            msg += "\n⚠️กรุณารอแอดมินเข้าเมล เพื่อทำการสมัครสักครู่ (อาจยังไม่สามารถเข้าได้ทันทีในครั้งแรก เนื่องจากต้องให้แอดมินตั้งค่าความปลอดภัย 2 ชั้นให้ก่อนค่ะ)"
            msg += "\n"
            msg += "\n⏰แอดมินทำตามคิวนะคะ อาจมีช้าบ้างหากคิวเยอะค่ะ โปรดรอสักครู่น้า"
            msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
        }
        else if (purchase_type === 'shop_family') {
            
            msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลร้านแบบครอบครัว)"
            msg += "\n"
            msg += " \n Email : " + email + "\n password : " + password + " \n เช็ควันหมด พิมพ์คำว่า เช็ควัน \n";                                
            msg += "\n⚠️กรุณารอแอดมินเข้าเมล เพื่อทำการสมัครสักครู่ (อาจยังไม่สามารถเข้าได้ทันทีในครั้งแรก เนื่องจากต้องให้แอดมินตั้งค่าความปลอดภัย 2 ชั้นให้ก่อนค่ะ)"            
            msg += "\n"
            msg += "\n⏰แอดมินทำตามคิวนะคะ อาจมีช้าบ้างหากคิวเยอะค่ะ โปรดรอสักครู่น้า"
            msg += "\n📝การต่ออายุรอบถัดไป สามารถใช้งานได้เลย ไม่ต้องรอแอดมินเข้าเมลค่ะ"
            msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
        }
        else
        {            
            msg += " \n Email : " + email + "\n password : " + password + " \n เพื่อเข้าสู่ระบบ \n";        
        }
        

        console.log('Sending LINE message to user:', user_id);
        const tmpSend = await lineChatAPI.pushMessage(user_id, msg);

        if (tmpSend['error']) {
            console.error('Failed to send LINE message:', tmpSend['error']);
            return { success: false, message: 'Failed to send LINE message: ' + tmpSend['error'], email, password };
        }

        console.log(' Successfully sent email/password to LINE');
        return { success: true, message: 'Success', email, password };

    } catch (error) {
        console.error('Error in sendEmailPasswordToLineForStripe:', error);
        return { success: false, message: error.message };
    }
};

// API Endpoint สำหรับ Stripe Webhook เรียกเพื่อส่ง credentials
exports.SendStripeCredentials = async function (req, res) {
    console.log('SendStripeCredentials');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }

        // รับ parameter จาก request body
        const { order_id, user_id, purchase_type } = req.body;

        console.log('Received request:', { order_id, user_id, purchase_type });

        // Validate required fields
        if (!order_id || !user_id || !purchase_type) {
            res.status(400).json({
                status: 'error',
                message: 'Missing required fields: order_id, user_id, purchase_type',
                auth: false,
                data: [],
            });
            return;
        }

        // เรียก helper function
        const result = await exports.sendEmailPasswordToLineForStripe(order_id, user_id, purchase_type);

        if (result.success) {
            res.status(200).json({
                status: 'success',
                message: result.message,
                auth: true,
                email: result.email,
                data: [],
            });
        } else {
            res.status(202).json({
                status: 'error',
                message: result.message,
                auth: false,
                data: [],
            });
        }

    } catch (error) {
        console.log(error);
        res.status(202).json({
            status: 'error',
            message: error.message,
            auth: false,
            data: [],
        });
    }
};

// API สำหรับส่ง Email/Password แบบ Manual (สำหรับ email และ personal)
exports.SendEmailPasswordManual = async function (req, res) {
    console.log('SendEmailPasswordManual');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }

        const headers = req.headers;
        const userid = headers.userid;
        const token = headers.token;

        let IsAuth = await AdminList.isAuthenicated(userid, token);

        if (IsAuth) {
            const { order_id } = req.body;

            if (!order_id) {
                res.status(400).json({
                    status: 'error',
                    message: 'Missing order_id',
                    auth: false,
                });
                return;
            }

            // ดึงข้อมูล order
            let orderData = await productList.getOrderById(order_id);
            if (!orderData || orderData.length <= 0) {
                res.status(202).json({
                    status: 'error',
                    message: 'Order not found',
                    auth: false,
                });
                return;
            }

            const user_id = orderData['user_id'];
            const purchase_type = orderData['purchase_type'];

            console.log('order_id:', order_id, 'user_id:', user_id, 'purchase_type:', purchase_type);

            // เช็คว่าเป็น type ที่รองรับ
            if (purchase_type !== 'personal' && purchase_type !== 'email') {
                res.status(202).json({
                    status: 'error',
                    message: 'Invalid purchase_type. Only email and personal are supported.',
                    auth: false,
                });
                return;
            }

            let email = '';
            let password = '';
            let inviteStock='';
            // ดึง email/password ตาม purchase_type
            if (purchase_type === 'personal') {
                
                const usersEmailData = await UsersEmail.findByOrderId(order_id);

                if (usersEmailData && usersEmailData.id) {
                    email = usersEmailData.email;
                    password = usersEmailData.password;
                } else {
                    res.status(202).json({
                        status: 'error',
                        message: 'ไม่พบข้อมูล email ของลูกค้า',
                        auth: false,
                    });
                    return;
                }
            } else if (purchase_type === 'email') {
                inviteStock = await EmailStock.getInviteStockFamily(user_id,orderData['email']);                
            }

            // ดึงการตั้งค่า LINE
            let tmpChatSetting = await MainModel.queryFirstRow(`SELECT * FROM line_setting`);

            if (!tmpChatSetting || tmpChatSetting.length == 0) {
                res.status(202).json({
                    status: 'error',
                    message: 'LINE setting not found',
                    auth: false,
                });
                return;
            }

            if (tmpChatSetting['status'] != 1) {
                res.status(202).json({
                    status: 'error',
                    message: 'LINE is not active',
                    auth: false,
                });
                return;
            }

            // ส่งข้อความเข้าไลน์
            let channelToken = tmpChatSetting['channel_token'];
            const lineChatAPI = new LineChatAPI();
            lineChatAPI.setToken(channelToken);

            let msg = "";
            if(inviteStock!='')
            {                
                email = orderData['email'] || ''  
                msg += "✅ขอบคุณสำหรับการสั่งซื้อ (เมลลูกค้าแบบครอบครัว) "
                msg += "\n"
                msg += "\nลิ้งค์เข้าครอบครัว : "+ inviteStock                
                msg += `\nเมลลูกค้า : ${email}`
                msg += `\nเช็ควันหมด พิมพ์คำว่า "เช็ควัน" `
                msg += "\n"
                msg += "\nวิธีการเข้าใช้งาน"
                msg += "\nกดลิ้งค์ที่ร้านส่งไป > กดเข้าร่วมได้เลยค่ะ(อย่าลืมเช็คเมลว่าตรงกับที่แจ้งมา)"
                msg += "\n"
                msg += "\n⚠️หากติดร้านเก่ามาก่อน อย่าลืมกดออกก่อนน้า พิมพ์คำว่า วิธีออก ส่งมาในแชทนี้ (ไม่ต้องพิมพ์อะไรต่อท้าย)"
                msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
            }            
            else if (password) {
                msg += "✅ดำเนินการเสร็จสิ้น สามารถเช็คในแอพเข้าใช้งานได้เลยค่ะ"                
                msg += "\nEmail : " + email + "\n password : " + password + " \n เช็ควันหมดอายุ พิมพ์คำว่า เช็ควัน \n";
                msg += "\n"
                msg += "\n⚠️พรีเมี่ยมจะตัดเมื่อครบรอบหมดอายุ เนื่องจากเป็นการสมัครบิลต่อบิล"
                msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
            }
            else {
                msg += "✅ดำเนินการเสร็จสิ้น สามารถเช็คในแอพเข้าใช้งานได้เลยค่ะ"                
                msg += "\nEmail : " + email + "\n เช็ควันหมดอายุ พิมพ์คำว่า เช็ควัน \n";
                msg += "\n"
                msg += "\n⚠️พรีเมี่ยมจะตัดเมื่อครบรอบหมดอายุ เนื่องจากเป็นการสมัครบิลต่อบิล"
                msg += "\n💌ทางร้านมีแจ้งต่ออายุก่อนหมดอายุค่ะ"
            }

            const tmpSend = await lineChatAPI.pushMessage(user_id, msg);

            if (tmpSend['error']) {
                res.status(202).json({
                    status: 'error',
                    message: 'Failed to send LINE message: ' + tmpSend['error'],
                    auth: false,
                });
                return;
            }

            // Update status_regis = 1
            if (purchase_type === 'personal') {
                const UsersEmail = require('../models/usersemail.model');
                await UsersEmail.updateStatusRegisByOrderId(order_id, 1);
            } else if (purchase_type === 'email') {
                const PersonalEmail = require('../models/personalemail.model');
                await Personal_Email.updateStatusByOrderId(order_id, 1);
            }

            console.log(' Successfully sent email/password to LINE');
            res.status(200).json({
                status: 'success',
                message: 'ส่งข้อมูลเข้าไลน์สำเร็จ',
                auth: true,
                email: email,
            });

        } else {
            res.status(202).json({
                status: 'error',
                message: 'Authentication Failed',
                auth: false,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(202).json({
            status: 'error',
            message: error.message,
            auth: false,
        });
    }
};

exports.GetRemainInviteInStock = async function (req, res) {

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }
        else {
            const headers = req.headers;

            //handles null error
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid ? headers.userid : '';
                const token = headers.token ? headers.token : '';

                //let IsAuth = await AdminList.isAuthenicated(userid,token);
                let IsAuth = true;


                let tmpData = await EmailStock.getRemainInviteStock();
                if (tmpData) {
                    res.status(200).json(tmpData);
                }
                else {
                    res.status(202).json({ status: 'error', message: 'Product not found' });
                }
                return;


            }
        }

    } catch (error) {
        console.log(error);
        res.status(202).json(
            {
                status: 'error',
                message: error.message,
                auth: false,
                data: [],
            }
        );
        return;
    }

}