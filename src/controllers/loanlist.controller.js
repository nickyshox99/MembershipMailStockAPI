'use strict';
const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const LoanList = require('../models/loanlist.model');
const IpAllowList = require('../models/ipallowlist.model');

const MainModel = require('../models/main.model');

const StaffGroupSetting = require('../models/staffgroupsetting.model');

const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var session = require('express-session');
const { count } = require('console');

exports.relate = async function(req, res) {
    
    try {


        let allData = await LoanList.findAll();

        allData = allData.filter(x=>x.id!=19);

        const sharePersonList = ['superwin4','superwin2'];
        const sharePersonList2 = ['Share001','Share002','Share003'];

        let indexShare1 = 0;
        let indexShare2 = 0;

        for (let index = 0; index < allData.length; index++) {
            const element = allData[index];
            let checkData = await MainModel.query(`SELECT * FROM loan_share WHERE id=${element.id}`);
            if (checkData.length==0) 
            {
                const selected1 = sharePersonList[indexShare1];
                const selected2 = sharePersonList2[indexShare2];
                await MainModel.insert('loan_share',{loan_id:element.id ,owner_id: selected1 ,share_percent : 70, } );
                await MainModel.insert('loan_share',{loan_id:element.id ,owner_id: selected2 ,share_percent : 30, } );
                indexShare1++;
                indexShare2++;
                if (indexShare1>=sharePersonList.length) {
                    indexShare1=0;
                }
                if (indexShare2>=sharePersonList2.length) {
                    indexShare2=0;
                }
            }
        }
        
        res.status(202).json(
            { 
                status: 'success', 
                message: '',
                auth : false,
                data : [],
            }
        );
        
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
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let tmpData = await LoanList.create(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.updateById = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);        
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("updatePromotionById")
             //handles null error
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
                    // console.log('updateadminbankbyid');
                    // console.log(req.body);            
                    let tmpData = await LoanList.updateById(req.body);
    
                    if (tmpData.errorMessage==null) 
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
                            message: tmpData.errorMessage,
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

exports.calculateLoanInterest = async function(req, res) {

    try {
        console.log('calculateLoanInterest');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let loan_amount = parseFloat(req.body.loan_amount);
                    let interest = parseFloat(req.body.interest);
                    let interestpernumber = req.body.interestpernumber?req.body.interestpernumber:1;
                    let loan_longtime_number = parseInt(req.body.loan_longtime_number);
                    let effective_rate = parseFloat(req.body.effective_rate);
                    let period_id = parseInt(req.body.period_id);
                    let cal_every_number = parseInt(req.body.cal_every_number);
                    let loan_start_at = new Date(req.body.loan_start_at);

                    let tmpData = await LoanList.calculateInterest(loan_amount,interest,interestpernumber,loan_longtime_number,effective_rate,period_id,cal_every_number,loan_start_at);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
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
                                data : tmpData,
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

exports.requestLoan = async function(req, res) {

    try {
        console.log('requestLoan');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let member_id = req.body.member_id;
                    let owner_admin_id = req.body.owner_admin_id;
                    let interest_name = req.body.interest_name;

                    let loan_amount = parseFloat(req.body.loan_amount);
                    let interest = parseFloat(req.body.interest);
                    let interestper = req.body.interestper;
                    let interestpernumber = req.body.interestpernumber?req.body.interestpernumber:1;
                    let loan_longtime_number = parseInt(req.body.loan_longtime_number);
                    let effective_rate = parseFloat(req.body.effective_rate);
                    let period_id = parseInt(req.body.period_id);
                    let cal_every_number = parseInt(req.body.cal_every_number);
                    let loan_start_at = new Date(req.body.loan_start_at);
                    let collateral_type_id = parseInt(req.body.collateral_type_id);

                    let collateral_img1 = req.body.collateral_img1??'';
                    let collateral_img2 = req.body.collateral_img2??'';
                    let collateral_img3 = req.body.collateral_img3??'';
                    let collateral_img4 = req.body.collateral_img4??'';
        
                    let tmpPaymentListData = await LoanList.calculateInterest(loan_amount,interest,interestpernumber,loan_longtime_number,effective_rate,period_id,cal_every_number,loan_start_at);
                    if (tmpPaymentListData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpPaymentListData.errorMessage,
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                    }
                    else
                    {
                        let tmpDataRequest = await LoanList.requestLoan(member_id,userid,owner_admin_id, interest_name,loan_amount,collateral_type_id,interest,interestper,loan_longtime_number,effective_rate,period_id,cal_every_number,loan_start_at,collateral_img1,collateral_img2,collateral_img3,collateral_img4,tmpPaymentListData)
                        if (tmpDataRequest.errorMessage) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: tmpDataRequest.errorMessage,
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
                                    data : [],
                                }
                            );
                            return;
                        }
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

exports.getRequestLoan = async function(req, res) {

    try {
        console.log('getRequestLoan');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let member_id = req.body.member_id;
                    
                    let tmpData = await LoanList.getRequestLoan(member_id);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
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
                                data : tmpData,
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

exports.getRejectLoan = async function(req, res) {

    try {
        console.log('getRejectLoan');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let member_id = req.body.member_id;
                    
                    let tmpData = await LoanList.getRejectLoan(member_id);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
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
                                data : tmpData,
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

exports.getApproveLoan = async function(req, res) {

    try {
        console.log('getApproveLoan');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let member_id = req.body.member_id;
                    
                    let tmpData = await LoanList.getApproveLoan(member_id);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
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
                                data : tmpData,
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

exports.getLoanPaymentByLoanId = async function(req, res) {

    try {
        console.log('getLoanPaymentByLoanId');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let loanId = req.body.loanId;
                    
                    let tmpData = await LoanList.getLoanPaymentByLoanId(loanId);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
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
                                data : tmpData,
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

exports.getShareLoanByLoanId = async function(req, res) {

    try {
        console.log('getShareLoanByLoanId');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let loanId = req.body.loanId;
                    
                    let tmpData = await LoanList.getShareLoanByLoanId(loanId);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
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
                                data : tmpData,
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

exports.getLoanPaymentByPaymentId = async function(req, res) {

    try {
        console.log('getLoanPaymentByPaymentId');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let paymentId = req.body.paymentId;
                    
                    let tmpData = await LoanList.getLoanPaymentByPaymentId(paymentId);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                    }
                    else
                    {
                        //console.log(tmpData);
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

exports.approveLoanById = async function(req, res) {
    
    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);        
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("updatePromotionById")
             //handles null error
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
                    let sharePersonList = JSON.parse(req.body.sharePersonList);
                    if (sharePersonList==null || sharePersonList.length==0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Invalid share person',
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }

                    console.log(sharePersonList);

                    const sumPercent = sharePersonList.reduce((accumulator, currentValue) => accumulator + currentValue.percent, 0);
                    if (sumPercent!=100) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'sum of share percent must be 100',
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }


                    let tmpData = await LoanList.approveLoanById(req.body);
    
                    if (tmpData.errorMessage==null) 
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

exports.rejectLoanById = async function(req, res) {
    

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);        
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            console.log("updatePromotionById")
             //handles null error
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
                               
                    let tmpData = await LoanList.rejectLoanById(req.body);
    
                    if (tmpData.errorMessage==null) 
                    {
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                pagePermission
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

exports.getLoanOnDueDate = async function(req, res) {

    

    try {
        console.log('getLoanOnDueDate');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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

                    let cTime = new Date();
                    cTime = new Date(cTime.getTime() + (offsetTime));

                    let startDateStr = req.body.startDate??null;
                    let endDateStr = req.body.endDate??null;

                    if (startDateStr==null || endDateStr==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "startDate or endDate is invalid",
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                        
                    }

                    let startDate = new Date(startDateStr);
                    startDate.setDate(startDate.getDate() - 7 );
                    startDate = new Date(startDate.getTime() + (offsetTime));    

                    let endDate = new Date(endDateStr);
                    endDate.setDate(endDate.getDate() + 3 );
                    endDate = new Date(endDate.getTime() + (offsetTime));

                    let admin_id = req.body.admin_id??"";
                    let page_name = req.body.page_name??"";

                    if (admin_id=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "staff_id  is invalid",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return;                        
                    }

                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],
                                
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
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    

                    let tmpData=[];
                    let havePermissionInPage = false;
                    let foundPageId = 0;
                    if (adminData.am_rank==4) 
                    {
                        tmpData = await LoanList.getLoanNotPaidAll(startDate,endDate);                       
                        
                        
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
                                    data : [],
                                }
                                );
                            return;
                        }
                        
                        //check customer permission
                        let customPagePermission = await StaffGroupSetting.getCustomPermissionByAmGroupId(adminData.am_group,foundPageId);                        
                        if (customPagePermission!=null) 
                        {                            
                            if (customPagePermission.can_viewall1 ) {
                                tmpData = await LoanList.getLoanNotPaidAll(startDate,endDate);

                            }    
                            else if (customPagePermission.can_view1 )
                            {
                                tmpData = await LoanList.getLoanNotPaidForStaff(startDate,endDate,admin_id);                                 
                                
                            }
                            else
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: "Not permission for view",
                                        auth : true,
                                        data : [],
                                        
                                    }
                                    );
                                return;
                            }
                        }
                        else
                        {
                            tmpData = await LoanList.getLoanNotPaidAll(startDate,endDate);                           
                                                        
                        }
                        
                    }
                    
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    else
                    {
                        for (let index = 0; index < tmpData.length; index++) {
                            const dueTime = tmpData[index]['due_date'];
                            if (cTime.getTime() > dueTime.getTime()) {
                                tmpData[index]['overdue'] = 1;
                            }
                            else
                            {
                                tmpData[index]['overdue'] = 0;
                            }
                            delete tmpData[index]['password'];
                            delete tmpData[index]['salt'];
                        }

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

exports.getLoanOverDueDate = async function(req, res) {


    try {
        console.log('getLoanOverDueDate');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let cTime = new Date();
                    cTime = new Date(cTime.getTime() + (offsetTime));

                    let startDateStr = req.body.startDate??null;
                    let endDateStr = req.body.endDate??null;

                    if (startDateStr==null || endDateStr==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "startDate or endDate is invalid",
                                auth : true,
                                data : [],
                                
                            }
                            );
                        return;
                        
                    }
                    
                    let startDate = new Date(startDateStr);
                    startDate.setDate(startDate.getDate() - 180 );
                    startDate = new Date(startDate.getTime() + (offsetTime));    

                    let endDate = new Date(endDateStr);
                    endDate.setDate(endDate.getDate()+1);
                    endDate = new Date(endDate.getTime() + (offsetTime));

                    let admin_id = req.body.admin_id??"";
                    let page_name = req.body.page_name??"";

                    if (admin_id=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "staff_id is invalid",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return;                        
                    }

                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],
                                
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
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    

                    let tmpData=[];
                    let havePermissionInPage = false;
                    let foundPageId = 0;
                    if (adminData.am_rank==4) 
                    {
                        tmpData = await LoanList.getLoanNotPaidAll(startDate,endDate);
                                                
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
                                    data : [],
                                    
                                }
                                );
                            return;
                        }
                        
                        //check customer permission
                        let customPagePermission = await StaffGroupSetting.getCustomPermissionByAmGroupId(adminData.am_group,foundPageId);
                        if (customPagePermission!=null) 
                        {
                            if (customPagePermission.can_viewall1 ) {
                                tmpData = await LoanList.getLoanNotPaidAll(startDate,endDate);
             
                                
                            }    
                            else if (customPagePermission.can_view1 )
                            {
                                tmpData = await LoanList.getLoanNotPaidForStaff(startDate,endDate,admin_id);
                     
                                
                            }
                            else
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: "Not permission for view",
                                        auth : true,
                                        data : [],
                                        
                                    }
                                    );
                                return;
                            }
                        }
                        else
                        {
                            tmpData = await LoanList.getLoanNotPaidAll(startDate,endDate);

                        }
                        
                    }
                    
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    else
                    {
                        for (let index = 0; index < tmpData.length; index++) {
                            const dueTime = tmpData[index]['due_date'];
                            if (cTime.getTime() > dueTime.getTime()) {
                                tmpData[index]['overdue'] = 1;
                            }
                            else
                            {
                                tmpData[index]['overdue'] = 0;
                            }
                            delete tmpData[index]['password'];
                            delete tmpData[index]['salt'];
                        }

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

exports.getLoanPaidOrClosed = async function(req, res) {


    try {
        console.log('getLoanPaidOrClosed');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                let cTime = new Date();
                    cTime = new Date(cTime.getTime() + (offsetTime));
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;
    
                if (IsAuth) 
                {
                    let startDateStr = req.body.startDate??null;
                    let endDateStr = req.body.endDate??null;

                    if (startDateStr==null || endDateStr==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "startDate or endDate is invalid",
                                auth : true,
                                data : [],
                                
                            }
                            );
                        return;
                        
                    }
                    
                    let startDate = new Date(startDateStr);
                    startDate.setDate(startDate.getDate() - 720 );
                    startDate = new Date(startDate.getTime() + (offsetTime));    

                    let endDate = new Date(endDateStr);
                    endDate.setDate(endDate.getDate() +1 );
                    endDate = new Date(endDate.getTime() + (offsetTime));

                    let admin_id = req.body.admin_id??"";
                    let page_name = req.body.page_name??"";

                    if (admin_id=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "staff_id is invalid",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return;                        
                    }

                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],
                                
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
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    

                    let tmpData=[];
                    let havePermissionInPage = false;
                    let foundPageId = 0;
                    if (adminData.am_rank==4) 
                    {
                        tmpData = await LoanList.getLoanPaidOrClosedAll(startDate,endDate);                        
          
                        
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
                                    data : [],
                                    
                                }
                                );
                            return;
                        }
                        
                        //check customer permission
                        let customPagePermission = await StaffGroupSetting.getCustomPermissionByAmGroupId(adminData.am_group,foundPageId);
                        if (customPagePermission!=null) 
                        {
                            if (customPagePermission.can_viewall1 ) {
                                tmpData = await LoanList.getLoanPaidOrClosedAll(startDate,endDate);
                               
                                  
                            }    
                            else if (customPagePermission.can_view1 )
                            {
                                tmpData = await LoanList.getLoanPaidOrClosedForStaff(startDate,endDate,admin_id);                                
                        
                                
                            }
                            else
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: "Not permission for view",
                                        auth : true,
                                        data : [],
                                        
                                    }
                                    );
                                return;
                            }
                        }
                        else
                        {
                            tmpData = await LoanList.getLoanPaidOrClosedAll(startDate,endDate);
      
                        }
                        
                    }
                    
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    else
                    {
                        for (let index = 0; index < tmpData.length; index++) {
                            const dueTime = tmpData[index]['due_date'];
                            if (cTime.getTime() > dueTime.getTime()) {
                                tmpData[index]['overdue'] = 1;
                            }
                            else
                            {
                                tmpData[index]['overdue'] = 0;
                            }
                            delete tmpData[index]['password'];
                            delete tmpData[index]['salt'];
                        }

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

exports.getLoanAll = async function(req, res) {


    try {
        console.log('getLoanAll');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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
                    let cTime = new Date();
                    cTime = new Date(cTime.getTime() + (offsetTime));

                    let startDateStr = req.body.startDate??null;
                    let endDateStr = req.body.endDate??null;

                    if (startDateStr==null || endDateStr==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "startDate or endDate is invalid",
                                auth : true,
                                data : [],
                                
                            }
                            );
                        return;
                        
                    }
                    
                    let startDate = new Date(startDateStr);
                    // startDate.setDate(startDate.getDate() - 720 );
                    // startDate = new Date(startDate.getTime() + (offsetTime));    

                    let endDate = new Date(endDateStr);
                    // endDate.setDate(endDate.getDate() +1 );
                    // endDate = new Date(endDate.getTime() + (offsetTime));

                    let admin_id = req.body.admin_id??"";
                    let page_name = req.body.page_name??"";

                    if (admin_id=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "staff_id is invalid",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return;                        
                    }

                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],
                                
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
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    

                    let tmpData=[];
                    let havePermissionInPage = false;
                    let foundPageId = 0;
                    if (adminData.am_rank==4) 
                    {
                        tmpData = await LoanList.getPaymentAll(startDate,endDate);                        
          
                        
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
                                    data : [],
                                    
                                }
                                );
                            return;
                        }
                        
                        //check customer permission
                        let customPagePermission = await StaffGroupSetting.getCustomPermissionByAmGroupId(adminData.am_group,foundPageId);
                        if (customPagePermission!=null) 
                        {
                            if (customPagePermission.can_viewall1 ) {
                                tmpData = await LoanList.getPaymentAll(startDate,endDate);
                               
                                  
                            }    
                            else if (customPagePermission.can_view1 )
                            {
                                tmpData = await LoanList.getLoanAllForStaff(startDate,endDate,admin_id);                                
                        
                                
                            }
                            else
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: "Not permission for view",
                                        auth : true,
                                        data : [],
                                        
                                    }
                                    );
                                return;
                            }
                        }
                        else
                        {
                            tmpData = await LoanList.getPaymentAll(startDate,endDate);
      
                        }
                        
                    }
                    
                    if (tmpData.errorMessage) 
                    {
                        
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                                
                            }
                            );
                        return;
                    }
                    else
                    {
                        for (let index = 0; index < tmpData.length; index++) {
                            const dueTime = tmpData[index]['due_date'];
                            if (cTime.getTime() > dueTime.getTime()) {
                                tmpData[index]['overdue'] = 1;
                            }
                            else
                            {
                                tmpData[index]['overdue'] = 0;
                            }
                            delete tmpData[index]['password'];
                            delete tmpData[index]['salt'];
                        }

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

exports.assignPaymentById = async function(req, res) {

    try {
        console.log('assignPaymentById');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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

                    let admin_id = userid;
                    let page_name = req.body.page_name;
                    let paymentId = req.body.paymentId;
                    let assign_to = req.body.assign_to;
                    
                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return;                        
                    }

                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);    
                    
                    if (adminPagePermission.canApprove==0) {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not have permission to assign",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return;   
                    }
                    
                    let tmpData = await LoanList.assignPaymentById(paymentId,assign_to);
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
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

exports.updateLoanPaymentByPaymentId = async function(req, res) {

    try {
        console.log('updateLoanPaymentByPaymentId');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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

                    let admin_id = userid;
                    let page_name = req.body.page_name;
                    let paymentId = req.body.paymentId;

                    let total_received_amount = parseFloat(req.body.total_received_amount);
                    let received_by = userid;
                    let paid = req.body.paid=="true"?1:0;             
                    let paid_at = new Date(req.body.paid_at);       
                    
                    let note1 = req.body.note1;
                    let note1_at = new Date(req.body.note1_at);
                    let note1_by = req.body.note1_by;
                    let ref_img1 = req.body.ref_img1;

                    let note2 = req.body.note2;
                    let note2_at = new Date(req.body.note2_at);
                    let note2_by = req.body.note2_by;
                    let ref_img2 = req.body.ref_img2;

                    let note3 = req.body.note3;
                    let note3_at = new Date(req.body.note3_at);
                    let note3_by = req.body.note3_by;
                    let ref_img3 = req.body.ref_img3;

                    let note4 = req.body.note4;
                    let note4_at = new Date(req.body.note4_at);
                    let note4_by = req.body.note4_by;
                    let ref_img4 = req.body.ref_img4;
                    
                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],                                
                            }
                        );
                        return;                        
                    }

                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);                    
                    let loanPayment = await LoanList.getLoanPaymentByPaymentId(paymentId);
                    if (!loanPayment) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not found payment",
                                auth : true,
                                data : [],
                            }
                        );
                        return; 
                    }

                    if (loanPayment['staff_id']!=userid) 
                    {
                        if (adminPagePermission.canApprove==0) {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: "Not have permission",
                                    auth : true,
                                    data : [],
                                    
                                }
                            );
                            return;   
                        }
                    }

                    if (loanPayment['paid']==1 || loanPayment['rejected']==1 || loanPayment['closed']==1) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "This payment already paid.",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    let loanData = await LoanList.findById(loanPayment['loan_id']);
                    if (loanData==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found Loan data',
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                    }
                    
                    let tmpData = await LoanList.updatePaymentById(
                            paymentId,total_received_amount,received_by,paid,paid_at
                            ,note1,note1_at,note1_by,ref_img1
                            ,note2,note2_at,note2_by,ref_img2
                            ,note3,note3_at,note3_by,ref_img3
                            ,note4,note4_at,note4_by,ref_img4
                            ,loanData,loanPayment
                        );
                        
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                    }
                    else
                    {

                        // Calculate new principle

                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
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

exports.updateFinePaymentByPaymentId = async function(req, res) {

    try {
        console.log('updateFinePaymentByPaymentId');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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

                    let admin_id = userid;
                    let page_name = req.body.page_name;
                    let paymentId = req.body.paymentId;

                    let fine_amount = req.body.fine_amount?parseFloat(req.body.fine_amount):0;
                    let notefine_by = userid;                            
                    let notefine_at = cTime;      
                    let notefine = req.body.notefine?req.body.notefine:'';
                    let total_amount = req.body.total_amount;

                    if (total_amount==null) {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "total_amount is invalid",
                                auth : true,
                                data : [],                                
                            }
                        );
                        return;
                    }
                    
                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],                                
                            }
                        );
                        return;                        
                    }

                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);                    
                    let loanPayment = await LoanList.getLoanPaymentByPaymentId(paymentId);
                    if (!loanPayment) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not found payment",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    if (loanPayment['paid']==1 || loanPayment['rejected']==1 || loanPayment['closed']==1) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "This payment already paid.",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    if (adminPagePermission.canApprove==0) {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not have permission.",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    let loanData = await LoanList.findById(loanPayment['loan_id']);
                    if (loanData==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found Loan data',
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                    }
                    
                    let tmpData = await LoanList.updateFinePaymentById(
                            paymentId,fine_amount,notefine,notefine_by,notefine_at,total_amount,loanData,loanPayment
                        );
                        
                    if (tmpData.errorMessage) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                    }
                    else
                    {

                        // Calculate new principle

                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
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

exports.updateForwardPaymentByPaymentId = async function(req, res) {

    try {
        console.log('updateForwardPaymentByPaymentId');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
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

                    let admin_id = userid;
                    let page_name = req.body.page_name;
                    let paymentId = req.body.paymentId;
                    
                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],                                
                            }
                        );
                        return;                        
                    }

                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name);                    
                    let loanPayment = await LoanList.getLoanPaymentByPaymentId(paymentId);
                    if (!loanPayment) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not found payment",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    let nextLoanPayment = await LoanList.getNextLoanPaymentByPaymentId(paymentId);
                    if (!nextLoanPayment) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not found next due payment",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    if (loanPayment['paid']==1 || loanPayment['rejected']==1 || loanPayment['closed']==1) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "This payment already paid or closed.",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    if (adminPagePermission.canApprove==0) {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "Not have permission.",
                                auth : true,
                                data : [],
                                
                            }
                        );
                        return; 
                    }

                    
                    let tmpData = await LoanList.updateNextPaymentById(
                            nextLoanPayment, loanPayment,admin_id
                        );
                        
                    if (tmpData.errorMessage) 
                    {
                        
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: tmpData.errorMessage,
                                auth : true,
                                data : [],
                            }
                            );
                        return;
                    }
                    else
                    {
                        // Calculate new principle
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
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

exports.getApproveLoanByOwner = async function(req, res) {

    try {
        console.log('getApproveLoanByOwner');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
            //if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                //let IsAuth = true;
    
                if (IsAuth) 
                {
                    let admin_id = userid;
                    let page_name = req.body.page_name;
                    let owner_id = userid;

                    // let admin_id = 'superwin2';
                    // let page_name ='apps-report-loanall';

                    let startDateStr = req.body.startDate??null;
                    let endDateStr = req.body.endDate??null;

                    if (startDateStr==null || endDateStr==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "startDate or endDate is invalid",
                                auth : true,
                                data : [],
                                profitData:[],
                                summaryProfit:0,
                            }
                            );
                        return;
                        
                    }

                    let startDate = new Date(startDateStr);
                    let endDate = new Date(endDateStr);
                    
                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],
                                profitData:[],
                                summaryProfit:0,
                            }
                        );
                        return;                        
                    }

                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name); 
                    if (adminPagePermission.canViewAll==1) {

                        let tmpData = await LoanList.getAllApproveLoan(startDate,endDate);
                        if (tmpData.errorMessage) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: tmpData.errorMessage,
                                    auth : true,
                                    data : [],
                                    profitData:[],
                                    summaryProfit:0,
                                }
                                );
                            return;
                        }
                        else
                        {
                            let shareProfit = {};
                            let summaryProfit = 0;
                            for (let index = 0; index < tmpData.length; index++) {
                                const element = tmpData[index];
                                summaryProfit+=element['profitAmount'];
                                const sharePerson = element['shareData'];
                                for (let indexSharePerson = 0; indexSharePerson < sharePerson.length; indexSharePerson++) {
                                    const elementPerson = sharePerson[indexSharePerson];
                                    if (shareProfit[elementPerson.owner_id]) 
                                    {
                                        shareProfit[elementPerson.owner_id]['profitAmount'] += elementPerson['profitAmount'];
                                    }
                                    else
                                    {
                                        //New
                                        shareProfit[elementPerson.owner_id] = 
                                        {
                                            profitAmount : elementPerson['profitAmount'],
                                            fullName : elementPerson['fullName']
                                        };
                                        
                                    }
                                }
                            }

                            let profitData = [];
                            Object.keys(shareProfit).forEach(_id => {
                                let tmpData = {
                                    _id,
                                    profitAmount : shareProfit[_id]['profitAmount'],                                    
                                    fullName : shareProfit[_id]['fullName'], 
                                };
                                profitData.push(tmpData);
                            });
                            
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: '',
                                    auth : true,                                
                                    data : tmpData,
                                    profitData : profitData,
                                    summaryProfit:summaryProfit,
                                }
                            );
                            return;
                        }
                    }
                    else
                    {

                        let tmpData = await LoanList.getApproveLoanByOwnerId(owner_id,startDate,endDate);
                        if (tmpData.errorMessage) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: tmpData.errorMessage,
                                    auth : true,
                                    data : [],
                                    profitData:[],
                                    summaryProfit:0,
                                }
                                );
                            return;
                        }
                        else
                        {
                            let shareProfit = {};
                            let summaryProfit=0;
                            
                            for (let index = 0; index < tmpData.length; index++) {
                                const element = tmpData[index];
                                summaryProfit+=element['profitAmount'];
                                const sharePerson = element['shareData'];
                                for (let indexSharePerson = 0; indexSharePerson < sharePerson.length; indexSharePerson++) {
                                    const elementPerson = sharePerson[indexSharePerson];
                                    if (shareProfit[elementPerson.owner_id]) 
                                    {
                                        shareProfit[elementPerson.owner_id]['profitAmount'] += elementPerson['profitAmount'];
                                    }
                                    else
                                    {
                                        shareProfit[elementPerson.owner_id] = 
                                        {
                                            profitAmount : elementPerson['profitAmount'],
                                            fullName : elementPerson['fullName']
                                        };
                                    }
                                }
                            }

                            let profitData = [];
                            Object.keys(shareProfit).forEach(_id => {
                                let tmpData = {
                                    _id,
                                    profitAmount : shareProfit[_id]['profitAmount'],                                    
                                    fullName : shareProfit[_id]['fullName'], 
                                };
                                profitData.push(tmpData);
                            });

                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: '',
                                    auth : true,                                
                                    data : tmpData,
                                    profitData:profitData,
                                    summaryProfit:summaryProfit,
                                }
                            );
                            return;
                        }
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
                            profitData:[],
                            summaryProfit:0,
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
                profitData:[],
                summaryProfit:0,
            }
        );
        return;
    }

   

    
};

exports.getPaidPayment = async function(req, res) {

    try {
        console.log('getPaidPayment');
    
        const ipAddress = await IpAllowList.getIPv4Address(req.headers['x-forwarded-for']);
        // const ipAddress = req.socket.remoteAddress;
        // const ipAllowList = IpAllowList.findById(ipAddress).map((row) => row.ip_address);
        // const ipAllowList = IpAllowList.findById(ipAddress);    
        const ipBlockList = IpAllowList.findBlockedById(ipAddress);
            
        if (ipBlockList.length>0)
        {
            res.status(202).send('Unauthorize ip. ('+ipAddress+')');
        }
        else
        {
            const headers = req.headers;
    
            //handles null error
            if (headers.userid.length === 0 || headers.token.length === 0) {
            //if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
            } else {
    
                // console.log(req.body.userid);
                // console.log(req.body.token);
    
                const userid = headers.userid;
                const token = headers.token;
    
                let IsAuth = AdminList.isAuthenicated(userid,token);
                //let IsAuth = true;
    
                if (IsAuth) 
                {
                    let admin_id = userid;
                    let page_name = req.body.page_name;
                    let owner_id = userid;

                    // let admin_id = 'superwin2';
                    // let page_name ='apps-report-loanall';

                    let startDateStr = req.body.startDate??null;
                    let endDateStr = req.body.endDate??null;

                    if (startDateStr==null || endDateStr==null) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "startDate or endDate is invalid",
                                auth : true,
                                data : [],
                                receiveData:[],
                                summaryReceive:0,
                            }
                            );
                        return;
                        
                    }

                    let startDate = new Date(startDateStr);
                    let endDate = new Date(endDateStr);
                    
                    if (page_name=="" ) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: "page_name is invalid",
                                auth : true,
                                data : [],
                                receiveData:[],
                                summaryReceive:0,
                            }
                        );
                        return;                        
                    }

                    let adminPagePermission = await AdminList.getCustomPagePermission2(admin_id,page_name); 
                    if (adminPagePermission.canViewAll==1) {

                        let tmpData = await LoanList.getAllPaidPayment(startDate,endDate);
                        if (tmpData.errorMessage) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: tmpData.errorMessage,
                                    auth : true,
                                    data : [],
                                    receiveData:[],
                                    summaryReceive:0,
                                }
                                );
                            return;
                        }
                        else
                        {
                            let shareReceive = {};
                            let summaryReceive=0;
                            
                            for (let index = 0; index < tmpData.length; index++) {
                                const element = tmpData[index];
                                summaryReceive+=element['total_received_amount'];
                                const sharePerson = element['shareData'];
                                for (let indexSharePerson = 0; indexSharePerson < sharePerson.length; indexSharePerson++) {
                                    const elementPerson = sharePerson[indexSharePerson];
                                    if (shareReceive[elementPerson.owner_id]) 
                                    {
                                        shareReceive[elementPerson.owner_id]['totalReceiveAmount'] += parseFloat(elementPerson['totalReceiveAmount']);
                                    }
                                    else
                                    {
                                        shareReceive[elementPerson.owner_id] = 
                                        {
                                            totalReceiveAmount : parseFloat(elementPerson['totalReceiveAmount']),
                                            fullName : elementPerson['fullName']
                                        };
                                    }
                                }
                            }

                            let receiveData = [];
                            Object.keys(shareReceive).forEach(_id => {
                                let tmpData = {
                                    _id,
                                    totalReceiveAmount : shareReceive[_id]['totalReceiveAmount'],                                    
                                    fullName : shareReceive[_id]['fullName'], 
                                };
                                receiveData.push(tmpData);
                            });
                            
                            
                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: '',
                                    auth : true,                                
                                    data : tmpData,
                                    receiveData:receiveData,
                                    summaryReceive:summaryReceive,
                                    
                                }
                            );
                            return;
                        }
                    }
                    else
                    {

                        let tmpData = await LoanList.getPaidPaymentByOwnerId(owner_id,startDate,endDate);
                        if (tmpData.errorMessage) 
                        {
                            res.status(202).json(
                                { 
                                    status: 'error', 
                                    message: tmpData.errorMessage,
                                    auth : true,
                                    data : [],
                                    receiveData:[],
                                    summaryReceive:0,
                                }
                                );
                            return;
                        }
                        else
                        {
                            let shareReceive = {};
                            let summaryReceive=0;
                            
                            for (let index = 0; index < tmpData.length; index++) {
                                const element = tmpData[index];
                                summaryReceive+=parseFloat(element['total_received_amount']);
                                const sharePerson = element['shareData'];
                                for (let indexSharePerson = 0; indexSharePerson < sharePerson.length; indexSharePerson++) {
                                    const elementPerson = sharePerson[indexSharePerson];
                                    if (shareReceive[elementPerson.owner_id]) 
                                    {
                                        shareReceive[elementPerson.owner_id]['totalReceiveAmount'] += parseFloat(elementPerson['totalReceiveAmount']);
                                    }
                                    else
                                    {
                                        shareReceive[elementPerson.owner_id] = 
                                        {
                                            totalReceiveAmount : parseFloat(elementPerson['totalReceiveAmount']),
                                            fullName : elementPerson['fullName']
                                        };
                                    }
                                }
                            }

                            let receiveData = [];
                            Object.keys(shareReceive).forEach(_id => {
                                let tmpData = {
                                    _id,
                                    totalReceiveAmount : shareReceive[_id]['totalReceiveAmount'],                                    
                                    fullName : shareReceive[_id]['fullName'], 
                                };
                                receiveData.push(tmpData);
                            });

                            res.status(200).json(
                                { 
                                    status: 'success', 
                                    message: '',
                                    auth : true,                                
                                    data : tmpData,     
                                    receiveData:receiveData,    
                                    summaryReceive:summaryReceive,                           
                                }
                            );
                            return;
                        }
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
                            receiveData:[],
                            summaryReceive:0,
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
                receiveData:[],
                summaryReceive:0,
            }
        );
        return;
    }

   

    
};