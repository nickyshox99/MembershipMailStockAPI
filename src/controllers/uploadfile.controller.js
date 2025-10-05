'use strict';
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const Secret = require('../../config/secret');
const Cryptof = require('../models/cryptof.model');

const AdminList = require('../models/adminlist.model');
const IpAllowList = require('../models/ipallowlist.model');
const ScanIdCard = require('../models/scanidcard.model');
const MainModel = require('../models/main.model');
const productList = require('../models/productlist.model');

const timerHelper = require('../modules/timehelper');
const fs = require('fs');
const path = require('path');

const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');

const Scb_app_lib = require('./../modules/scbapplib');
const SCBModel = require('../models/scb.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

async function readQRCode(filePath) {
    try {
      // Load the JPEG image
      console.log(filePath);
      const image = await loadImage(filePath);
  
      // Create a canvas with the same dimensions as the image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
  
      // Get the image data
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
  
      // Decode the QR code
      const qrCode = await jsQR(imageData.data, image.width, image.height);
  
      if (qrCode) {
        // If a QR code is found, log the result
        // console.log('QR Code Data:', qrCode.data);
        return qrCode.data;
      } else {
        console.log('No QR Code found in the image.');
        return "";      
      }
    } catch (error) {
      console.error('Error reading QR code:', error.message);
      return "";      
    }
}

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

                // Skip authentication for customer uploads (when userid and token are "-")
                let IsAuth = (userid === "-" && token === "-") ? true : AdminList.isAuthenicated(userid,token);
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

                    // Use the provided tofilename directly (already includes extension)
                    const destFileName = userid + (new Date().getTime()).toString() + req.body.tofilename;
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','assets','00tmpfile', uploadedFile.filename);
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
                                file_url: Secret.apiDomain+'getfile/'+ destFileName,
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
            if (!headers.userid || !headers.token || headers.userid.length === 0 || headers.token.length === 0) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                const userid = headers.userid;
                const token = headers.token;

                // Skip authentication for customer uploads (when userid and token are "-")
                let IsAuth = (userid === "-" && token === "-") ? true : AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    const uploadedFile = req.file;       
                    console.log('Uploaded file:', uploadedFile);

                    if (!req.file ) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'No file uploaded or invalid file data',
                        });
                        return;
                    }

                    let oldFilePath = req.body.oldFilePath??'';

                    // Use the provided tofilename directly (already includes extension)
                    const destFileName = userid + (new Date().getTime()).toString() + req.body.tofilename;
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','assets','00tmpfile', uploadedFile.filename);
                    const destinationPath = path.join(__dirname, '..', '..','assets', destFileName );

                    console.log('Source file path:', sourceFilePath);
                    console.log('Destination path:', destinationPath);
                    console.log('File exists check:', fs.existsSync(sourceFilePath));

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

exports.customerUploadFileAndDeleteOldFile =  async (req, res) => {
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
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                //let IsAuth = AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (true) 
                {
                    const order_id = req.body.order_id;
                    const email = req.body.email;

                    let row_order = await productList.getOrderById(order_id);  
                    if (row_order.length<=0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found order.',
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        if (row_order.email!=email) {
                             res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found order.',
                                auth : false,
                                data : [],
                            }
                            );
                            return;
                        }
                    }


                    const uploadedFile = req.file;    


                    if (!req.file ) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'No file uploaded or invalid file data',
                        });
                        return;
                    }

                    let oldFilePath = req.body.oldFilePath??'';

                    // Use the provided tofilename directly (already includes extension)
                    const destFileName = req.body.tofilename;
                    
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','assets','00tmpfile', uploadedFile.filename);
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

exports.uploadFileSlipAndCheck =  async (req, res) => {
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
            if (false) {                
                return;
            } else {

                let IsAuth = true;
                // let IsAuth = true;

                if (IsAuth) 
                {
                    let userid = "freesystem";
                    const uploadedFile = req.file;       

                    if (!req.file ) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'No file uploaded or invalid file data',
                        });
                        return;
                    }

                    const splitExtensionName =uploadedFile.filename.split('.')[1];
                    
                    let datetimeNow = new Date();
                    datetimeNow = new Date(datetimeNow.getTime() + (offsetTime));

                    const rndInt = Math.floor(Math.random() * 1000) + 100;
                    const dateStr = datetimeNow.getFullYear().toString() +datetimeNow.getMonth().toString()
                        + datetimeNow.getDay().toString()+datetimeNow.getHours().toString()
                        + datetimeNow.getMinutes().toString()+datetimeNow.getSeconds().toString()
                        + rndInt.toString();
                    const rndFileName = dateStr+'.'+splitExtensionName;
                            
                    // Example: Save the uploaded file to a specific location
                    const sourceFilePath = path.join(__dirname, '..', '..','assets','00tmpfile', uploadedFile.filename);
                    const destinationPath = path.join(__dirname, '..', '..','slipfile', rndFileName);

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
                        fs.writeFile(destinationPath, data, async (err) => {
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

                            console.log(Secret.apiDomain+'getslipfile/'+ rndFileName);

                            
                            //Scanslip
                            const barCode = await readQRCode(destinationPath);
                            // console.log("BarCode");
                            // console.log(barCode.data);

                            if (barCode!='') {
                                const checkExistQR  = await MainModel.query("SELECT * FROM scan_slip WHERE barcode='"+barCode.data+"'");                                
                                if (checkExistQR.length>0) 
                                {
                                    if (checkExistQR[0]['deposited_credit']==1) 
                                    {
                                        res.status(202).json(
                                            { 
                                                status: 'error', 
                                                message: 'This slip has been used before.',
                                                auth : false,
                                                data : [],
                                            }
                                        );
                                        return;
                                    }                         
                                    userid = checkExistQR[0]['userid'];
                                }
                                else
                                {
                                   
                                    
                                    await MainModel.insert("scan_slip",
                                        {
                                            userid : headers.userid,
                                            filename : rndFileName,
                                            upload_time : timerHelper.convertDatetimeToString(datetimeNow),
                                            barcode : barCode.data,
                                            canceled : 0,
                                        }
                                    );                                    
                                }

                                let admin_banks_data = await MainModel.query(`
                                select *
                                from admin_bank
                                where status = 1 and bank_id in (5) and (bank_type = 'WITHDRAW' or bank_type = 'BOTH' ) and (work_type = 'NODE' or work_type = 'IBK')
                                    `);


                                if (admin_banks_data.length>0) 
                                {
                                    let admin_banks = admin_banks_data[0];
                                    let tmpMeta = JSON.parse(admin_banks['meta_data']);
                                    admin_banks['meta_data']= tmpMeta;
                                    for (const [key,value] of Object.entries(tmpMeta))
                                    {
                                        admin_banks[key] = value;
                                    }

                                    let admin_info = admin_banks;
                                                                            
                                    //Bank Account                                                                        
                                    if (admin_info) 
                                    {                                            
                                        if(admin_info['bank_id']==5)
                                        {                                            
                                            const scb_app_lib = new Scb_app_lib();
                                            let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                            let token = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
                                                                                                                                    
                                            let resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                            let data = [];
                                            let i = 0;

                                            console.log(resp);

                                            let loginPass = false;
                                            
                                            if (resp['status'] && resp['status']!='error') 
                                            {
                                                if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                                {          
                                                    admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                                    SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);        
                                                    console.log(admin_info['bank_acc_number'] + "Read Slip Login : (Balance : $"+ admin_info['meta_data']['balance']  +")");
                                                    loginPass = true;
                                                }
                                                else
                                                {
                                                    console.log("Read Slip New Login");                                        
                                                    token = "";										

                                                    let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
                                                    let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
                                                        
                                                    token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);

                                                    scbtoken = token;
                                                    
                                                    if (token) 
                                                    {                                            
                                                        admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);                                            
                                                        resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
                                                        console.log(resp.data);
                                                        if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
                                                        {
                                                            admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
                                                        }                                            
                                                        SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);                                            
                                                        console.log(admin_info['bank_acc_number'] + " : Auto Transfer Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");    
                                                        
                                                        loginPass = true;
                                                    }
                                                    else
                                                    {                                            
                                                        console.log('Login Failed '+ admin_info['bank_acc_number']);                                                        
                                                    }
                                                }
                                            }
                                            else
                                            {                                    
                                                console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);                                               
                                            }

                                            console.log("Login Pass : ",loginPass);

                                            if (loginPass) 
                                            {
                                                let response = await scb_app_lib.CheckSlip(scbtoken,barCode.data);    
                                                //console.log(response);
                                                if(response['status']['code'] == 1000)
                                                {  
                                                    let credit = response['data']['amount'];
                                                    let slipTime = response['data']['pullSlip']['dateTime']?new Date(response['data']['pullSlip']['dateTime']):new Date();                                                    
                                                    let transRef = response['data']['pullSlip']['transRef']?response['data']['pullSlip']['transRef']:"";
                                                    let sender = response['data']['pullSlip']['sender'];
                                                    let receiver = response['data']['pullSlip']['receiver'];                                                    

                                                    if (typeof credit=='number') 
                                                    {
                                                        await MainModel.update("scan_slip",
                                                            {
                                                                credit : credit,
                                                                sliptime : timerHelper.convertDatetimeToString(slipTime),
                                                                deposited_credit: 1, 
                                                                transRef : transRef,
                                                                from_acc : sender['accountNumber'],
                                                                from_name : sender['name'],
                                                                to_acc : receiver['accountNumber'],
                                                                to_name : receiver['name'],                                                                
                                                            }
                                                            ,
                                                            {
                                                                barcode : barCode.data
                                                            }
                                                        );

                                                        let slip_from_acc = '';
                                                        const match = sender['accountNumber'].slice(-6).replaceAll("-","").replaceAll("x","");
                                                        // Check if a match is found
                                                        if (match) {
                                                            slip_from_acc = match;                                                        
                                                        } 

                                                        let slip_to_acc = '';
                                                        const match2 = receiver['accountNumber'].slice(-6).replaceAll("-","").replaceAll("x","");
                                                        // Check if a match is found
                                                        if (match2) {
                                                            slip_to_acc = match2;                                                        
                                                        } 

                                                        let row_transfer = {
                                                            credit : credit,
                                                            datetime : slipTime,
                                                            bankdesc : 'slip',
                                                            acc : slip_from_acc,
                                                            bank_name : '',
                                                        };

                                                        if (slip_from_acc=="") 
                                                        {
                                                            await MainModel.update("scan_slip",
                                                            {
                                                                canceled : 1,                                                                                     
                                                                remark : "ไม่สามารถอ่านผู้โอนจากสลิปได้"
                                                            }
                                                            ,
                                                            {
                                                                barcode : barCode.data
                                                                
                                                            }
                                                        );

                                                            res.status(202).json(
                                                                { 
                                                                    status: 'error', 
                                                                    message: 'ไม่สามารถอ่านผู้โอนจากสลิปได้',
                                                                    auth : false,
                                                                    data : [],
                                                                }
                                                            );
                                                            return;                                                            
                                                        }

                                                        let c_now = new Date();
                                                        c_now = new Date(c_now.getTime() + (offsetTime));
                                                        c_now.setHours(c_now.getHours());

                                                        let fromDate = c_now.setMinutes(c_now.getMinutes() - 30);
                                                        let toDate = c_now.setMinutes(c_now.getMinutes() + 30);
                                                        let row_tmpp = await MainModel.query(`
                                                            SELECT *
                                                            FROM transfer_ref
                                                            WHERE 
                                                                (
                                                                    (acc = '${row_transfer['acc']}' AND date = '${timerHelper.convertDatetimeToString(row_transfer['datetime'])}' AND credit = '${row_transfer['credit']}') 
                                                                    OR 
                                                                    (acc like '%${row_transfer['acc']}%' AND date >= '${timerHelper.convertDatetimeToString(fromDate)}' AND date<='${timerHelper.convertDatetimeToString(toDate)}' AND credit = '${row_transfer['credit']}' AND manual = 1 )
                                                                )								
                                                        `);

                                                        if (row_tmpp.length>0) 
                                                        {
                                                            await MainModel.update("scan_slip",
                                                            {
                                                                canceled : 1,              
                                                                remark : "สลิปนี้เคยอัพโหลดแล้ว"                                                                       
                                                            }
                                                            ,
                                                            {
                                                                barcode : barCode.data
                                                            }
                                                            );
                                                        
                                                            res.status(202).json(
                                                                { 
                                                                    status: 'error', 
                                                                    message: 'สลิปนี้เคยอัพโหลดแล้ว',
                                                                    auth : false,
                                                                    data : [],
                                                                }
                                                            );
                                                            return;
                                                        }
                                                        else
                                                        {
                                                            let tmp_data = {
                                                                "id" 			: null,
                                                                "tr_bank"		: "SLIP",
                                                                "bank_app"		: row_transfer['bank_name'],
                                                                "acc"			: row_transfer['acc'],
                                                                "credit"		: row_transfer['credit'],
                                                                "type"			: "DEPOSIT",
                                                                "date"			: timerHelper.convertDatetimeToString(row_transfer['datetime']),
                                                                "note"			: "",
                                                                "status" 		: 0,
                                                                "parent"		: "",
                                                            };
    
                                                            await MainModel.insert("transfer_ref",tmp_data);
                                                        }

                                                        let row_user =  await MainModel.query(`
                                                            SELECT *
                                                            FROM sl_users
                                                            WHERE bank_acc_no like '%${slip_from_acc}%' 
                                                        `);

                                                        if (row_user && row_user.length > 0)
                                                        {   

                                                            let row_user_id = row_user[0]['id'];
                                                            console.log(`
                                                                SELECT loan_payment.*, sl_users.id as userid
                                                                FROM loan_list 
                                                                INNER JOIN loan_payment ON loan_payment.loan_id=loan_list.id 
                                                                INNER JOIN sl_users ON sl_users.id=loan_list.member_id  
                                                                WHERE loan_list.member_id = '${row_user_id}' 
                                                                AND date(due_date)='${timerHelper.convertDateToString(slipTime)}'
                                                                AND (loan_list.remain_loan>0  AND loan_list.remain_interest>0 AND loan_list.remain_find>0 )
                                                            `);

                                                            let loan_data =  await MainModel.query(`
                                                                SELECT loan_payment.*, sl_users.id as userid , sl_users.fullname
                                                                FROM loan_list 
                                                                INNER JOIN loan_payment ON loan_payment.loan_id=loan_list.id 
                                                                INNER JOIN sl_users ON sl_users.id=loan_list.member_id  
                                                                WHERE loan_list.member_id = '${row_user_id}' 
                                                                AND date(due_date)='${timerHelper.convertDateToString(slipTime)}' 
                                                                AND (loan_list.remain_loan>0  AND loan_list.remain_interest>0 AND loan_list.remain_find>0 )
                                                            `);

                                                            if (loan_data && loan_data.length>0) 
                                                            {
                                                                res.status(200).json(
                                                                    { 
                                                                        status: 'success', 
                                                                        message: '',
                                                                        auth : true,
                                                                        loan_data : loan_data,
                                                                        slip_data : row_transfer,
                                                                        file_path : Secret.apiDomain+'getslipfile/'+ rndFileName,                                                                        
                                                                    }
                                                                );
                                                                return;
                                                            }
                                                            else
                                                            {
                                                                res.status(202).json(
                                                                    { 
                                                                        status: 'error', 
                                                                        message: 'พบผู้ใช้ที่ตรงกับบัญชี แต่ไม่พบรายการค้างจ่ายที่ตรงวันที่ในสลิป',
                                                                        auth : true,
                                                                        data : [],
                                                                    }
                                                                );
                                                                return;
                                                            }

                                                                                                                                
                                                           
                                                        }
                                                        else
                                                        {
    
                                                            MainModel.update("scan_slip",
                                                                    {
                                                                        canceled : 1,
                                                                        remark : "Account Number "+ slip_from_acc + " not match UserId : "+userid,
                                                                    }
                                                                    ,
                                                                    {
                                                                        barcode : barCode.data
                                                                    }
                                                                ); 

                                                            res.status(202).json(
                                                                { 
                                                                    status: 'error', 
                                                                    message: 'ไม่พบบัญชีผู้ใช้ที่ตรงกับสลิป',
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
                                                                message: 'Slip cannot read amount.',
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
                                                            message: 'Slip is some problem.',
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
                                                        message: 'Slip is some problem.',
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
                                                    message: 'Not found bank for service',
                                                    auth : false,
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
                                        {   status : 'error' ,
                                            message: 'No Bank Service Available',
                                            // url: Secret.apiDomain+'slipfile/'+ rndFileName+'.'+splitExtensionName,
                                        });  
                                        return;
                                }


                               

                            }
                            else
                            {
                                res.status(202).json(
                                    { 
                                        status: 'error', 
                                        message: 'Cannot read slip',
                                        auth : false,
                                        data : [],
                                    }
                                );
                                return;
                            }

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

                // Skip authentication for customer uploads (when userid and token are "-")
                let IsAuth = (userid === "-" && token === "-") ? true : AdminList.isAuthenicated(userid,token);
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

exports.customerDeleteFile =  async (req, res) => {
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
            if (false) {
                res.status(400).send({ status: 'error', message: 'Please provide all required headers' });
                return;
            } else {

                // console.log(req.body.userid);
                // console.log(req.body.token);

                // const userid = headers.userid;
                // const token = headers.token;

                // let IsAuth = AdminList.isAuthenicated(userid,token);
                let IsAuth = true;

                if (IsAuth) 
                {
                    const order_id = req.body.order_id;
                    const user_id = req.body.user_id;

                    let row_order = await productList.getOrderById(order_id);  
                    console.log('Order data from getOrderById:', row_order);
                    
                    if (!row_order || Object.keys(row_order).length === 0) 
                    {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found order.',
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }
                    else
                    {
                        if (row_order.user_id != user_id) {
                             res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found order.',
                                auth : false,
                                data : [],
                            }
                            );
                            return;
                        }
                    }

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


exports.scanIDCardByURL =  async (req, res) => {
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

                // Skip authentication for customer uploads (when userid and token are "-")
                let IsAuth = (userid === "-" && token === "-") ? true : AdminList.isAuthenicated(userid,token);
                // let IsAuth = true;

                if (IsAuth) 
                {
                    console.log("Scan Card ID");
                    const apiKey = '5db030238ace1ba4d8f3d1e7c71b7791c7255d62';
                    const baseUrl = 'https://www.imagetotext.info/api/imageToText';

                    let cardIdURL = req.body.url??'';
                    if (cardIdURL=="") {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: 'Not found URL Image',
                                auth : false,
                                data : [],
                            }
                        );
                        return;
                    }

                    const response2 = await ScanIdCard.sendSlipUrlToApi(cardIdURL, apiKey, baseUrl);
                    
                    if (response2.data.error) {
                        res.status(202).json(
                            { 
                                status: 'error', 
                                message: '',
                                auth : true,
                                data : response2.data.result,
                            }
                        );
                        return;
                    }
                    else
                    {
                        const cleanedResponse = await ScanIdCard.removeSlipBrTags(response2.data.result);
                        res.status(200).json(
                            { 
                                status: 'success', 
                                message: '',
                                auth : true,
                                data : cleanedResponse,
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

