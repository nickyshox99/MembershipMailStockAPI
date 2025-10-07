'use strict';

var dbConn = require('../../config/db.config');
const timerHelper = require('../modules/timehelper');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'admin_bank'
const tableKey = 'id'

//User object create
var AdminBankList = async function (adminBankList) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;

    // this.am_status = userlist.am_status;
};

AdminBankList.findAll = async function (searchword, result) {

    searchword = searchword ? searchword : "";

    let sqlStr = "Select admin_bank.*,bank_info.bank_ico  ";
    sqlStr += " FROM admin_bank ";
    sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id=admin_bank.bank_id";
    sqlStr += " where 1=1 AND (admin_bank.bank_name like '%" + searchword + "%' or admin_bank.bank_acc_number like '%" + searchword + "%') ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0];
};

AdminBankList.findAllActive = async function (searchword, result) {

    searchword = searchword ? searchword : "";

    let sqlStr = "Select admin_bank.*,bank_info.bank_ico  ";
    sqlStr += " FROM admin_bank ";
    sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id=admin_bank.bank_id";
    sqlStr += " where 1=1 AND (admin_bank.bank_name like '%" + searchword + "%' or admin_bank.bank_acc_number like '%" + searchword + "%') and status=1";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0];
};

AdminBankList.findById = async function (id, result) {
    let sqlStr = "Select *  ";
    sqlStr += " FROM " + tableName;
    sqlStr += " where 1=1 AND (" + tableKey + " = " + id + ") ";

    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0][0] ? datas[0][0] : [];
};

AdminBankList.findByTypeAndID = async function (condition, result) {

    let sqlStr = "Select * ";
    sqlStr += " FROM admin_bank ";
    sqlStr += " where 1=1 ";
    sqlStr += condition;
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0];
};

function compareMeta(inputData, metaData) {
    let result = "";

    if (inputData) {
        result = inputData;
        if (inputData != '' && inputData != metaData) {
            result = Cryptof.encryption(inputData);
        }
    }
    else {
        result = "";
    }


    return result;
}

AdminBankList.create = async function (objData, result) {

    let tmp_metadata = {

        password: objData.pin,
        bank_break_enable: objData.bank_break_enable == true ? 1 : 0,
        deposit_decimal: objData.deposit_decimal == true ? 1 : 0,

        username: "",
        deviceid: "",
        api_refresh: "",
        scb_app_token: "",
        url: "",
        balance: 0.00,

        ktb_api_refresh: "",
        ktb_device_id: "",
        ktb_bearer: "",

        update_time: "",
        before_update_time: 0,
        bank_break_id: "",
        bank_break_credit_check: "",

        kbizusername: "",
        kbizpassword: "",
    };

    tmp_metadata.deviceid = compareMeta(objData.deviceid, tmp_metadata.deviceid);
    tmp_metadata.api_refresh = compareMeta(objData.api_refresh, tmp_metadata.api_refresh);
    tmp_metadata.scb_app_token = compareMeta(objData.scb_app_token, tmp_metadata.scb_app_token);
    tmp_metadata.url = compareMeta(objData.url, tmp_metadata.url);
    tmp_metadata.kbizusername = compareMeta(objData.kbizusername, tmp_metadata.kbizusername);
    tmp_metadata.kbizpassword = compareMeta(objData.kbizpassword, tmp_metadata.kbizpassword);
    // olm add code 
    tmp_metadata.bank_break_id = compareMeta(objData.bank_break_id, tmp_metadata.bank_break_id);
    tmp_metadata.bank_break_credit_check = compareMeta(objData.bank_break_credit_check, tmp_metadata.bank_break_credit_check);

    // console.log(tmp_metadata);
    const json_metadata = JSON.stringify(tmp_metadata);
    const tmpData = {
        bank_id: objData.bank_id,
        bank_name: objData.bank_name,
        bank_type: objData.bank_type,
        bank_acc_name: objData.bank_acc_name,
        bank_acc_number: objData.bank_acc_number,
        promptpay_number: objData.promptpay_number || null,
        work_type: objData.work_type,
        show_type: objData.show_type,
        meta_data: json_metadata,
        // login_status : dataByID[0].login_status,
        status: objData.statusActive,
        parent: objData.parent || 0,
    };

    try {
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw("INSERT INTO " + tableName + " (" +
            "bank_id "
            + ",bank_name "
            + ",bank_type "
            + ",bank_acc_name "
            + ",bank_acc_number "
            + ",promptpay_number "
            + ",work_type "
            + ",show_type "
            + ",meta_data "
            + ",status "
            + ",login_status "
            + ",parent "
            + " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
            , [
                tmpData.bank_id
                , tmpData.bank_name
                , tmpData.bank_type
                , tmpData.bank_acc_name
                , tmpData.bank_acc_number
                , tmpData.promptpay_number
                , tmpData.work_type
                , tmpData.show_type
                , tmpData.meta_data
                , tmpData.status
                , 0
                , tmpData.parent || 0
            ]);

        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }


};

AdminBankList.updateByID = async function (objData, result) {

    try {
        const rowid = objData.id;

        let sqlStr = "Select admin_bank.*  ";
        sqlStr += " FROM admin_bank ";
        sqlStr += " where admin_bank.id=" + rowid;
        // console.log(sqlStr);
        const dataByID = await dbConn.raw(sqlStr);
        let tmp_metadata = {
            deviceid: "",
            api_refresh: "",
            scb_app_token: "",
            url: "",
            kbizusername: "",
            kbizpassword: "",
        };

        if (dataByID[0].meta_data && dataByID[0].meta_data != "") {
            let metadata = JSON.parse(dataByID[0].meta_data);
            tmp_metadata = {

                password: objData.pin,
                bank_break_enable: objData.bank_break_enable == true ? 1 : 0,
                deposit_decimal: objData.deposit_decimal == true ? 1 : 0,

                username: metadata.username,
                deviceid: metadata.deviceid,
                api_refresh: metadata.api_refresh,
                scb_app_token: metadata.scb_app_token,
                url: metadata.url,
                balance: metadata.balance,

                kbizusername: metadata.kbizusername,
                kbizpassword: metadata.kbizpassword,

                ktb_api_refresh: metadata.ktb_api_refresh ? metadata.ktb_api_refresh : '',
                ktb_device_id: metadata.ktb_device_id ? metadata.ktb_device_id : '',
                ktb_bearer: metadata.ktb_bearer ? metadata.ktb_bearer : '',

                update_time: metadata.update_time ? metadata.update_time : '',
                before_update_time: metadata.before_update_time ? metadata.before_update_time : 0,

                bank_break_id: objData.bank_break_id ? objData.bank_break_id : 0,
                bank_break_credit_check: objData.bank_break_credit_check ? objData.bank_break_credit_check : 0.00,
            };
        }

        tmp_metadata.deviceid = compareMeta(objData.deviceid, tmp_metadata.deviceid);
        tmp_metadata.api_refresh = compareMeta(objData.api_refresh, tmp_metadata.api_refresh);
        tmp_metadata.scb_app_token = compareMeta(objData.scb_app_token, tmp_metadata.scb_app_token);
        tmp_metadata.url = compareMeta(objData.url, tmp_metadata.url);
        tmp_metadata.kbizusername = compareMeta(objData.kbizusername, tmp_metadata.kbizusername);
        tmp_metadata.kbizpassword = compareMeta(objData.kbizpassword, tmp_metadata.kbizpassword);

        const json_metadata = JSON.stringify(tmp_metadata);
        const tmpData = {
            bank_id: objData.bank_id,
            bank_name: objData.bank_name,
            bank_type: objData.bank_type,
            bank_acc_name: objData.bank_acc_name,
            bank_acc_number: objData.bank_acc_number,
            promptpay_number: objData.promptpay_number || null,
            work_type: objData.work_type,
            show_type: objData.show_type,
            meta_data: json_metadata,

            status: objData.statusActive,
        };

        // console.log(rowid);
        //console.log(tmpData);

        const datas = await dbConn.raw("UPDATE " + tableName + " SET " +
            "bank_id=?"
            + ",bank_name=? "
            + ",bank_type=? "
            + ",bank_acc_name=? "
            + ",bank_acc_number=? "
            + ",promptpay_number=? "
            + ",work_type=? "
            + ",show_type=? "
            + ",meta_data=? "
            + ",status=? "
            + "WHERE id = ? "
            , [
                tmpData.bank_id
                , tmpData.bank_name
                , tmpData.bank_type
                , tmpData.bank_acc_name
                , tmpData.bank_acc_number
                , tmpData.promptpay_number
                , tmpData.work_type
                , tmpData.show_type
                , tmpData.meta_data
                , tmpData.status
                , rowid]);

        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }




};

AdminBankList.deleteByID = async function (objData, result) {

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);

        let lstID = objData.listId.join(",");
        // console.log(lstID);
        const datas = await dbConn.raw("DELETE FROM " + tableName + " WHERE id in (" + lstID + ")");

        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

AdminBankList.getBankInfo = async function (result) {


    let sqlStr = "Select *  ";
    sqlStr += " FROM bank_info ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0];
};

AdminBankList.getBankBreakInfo = async function (result) {


    let sqlStr = "Select *  ";
    sqlStr += " FROM admin_bank WHERE bank_type='BREAK' ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0];
};

AdminBankList.getBankInfoByName = async function (bank_name, result) {


    let sqlStr = "Select *  ";
    sqlStr += " FROM bank_info ";
    sqlStr += " WHERE bank_name like '%" + bank_name.toLowerCase() + "%' or bank_ico like '%" + bank_name.toLowerCase() + "%' ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0];
};

AdminBankList.getBankInfoByBankID = async function (bank_id, result) {
    let sqlStr = "Select *  ";
    sqlStr += " FROM bank_info ";
    sqlStr += " WHERE bank_id = " + bank_id + " ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0][0] ? datas[0][0] : [];
};

AdminBankList.getWithdrawPIN = async function (pin, result) {
    let sqlStr = "Select *  ";
    sqlStr += " FROM withdraw_pin ";
    sqlStr += " WHERE pin = '" + pin + "' ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0];
};




module.exports = AdminBankList;