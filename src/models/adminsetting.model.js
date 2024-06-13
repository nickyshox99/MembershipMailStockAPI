'use strict';

var dbConn = require('../../config/db.config');


const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'meta_setting'
const tableKey = 'meta'

//User object create
var AdminSetting = function(adminSetting) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    
    // this.am_status = userlist.am_status;
};

AdminSetting.findAll = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select *   ";        
    sqlStr += " FROM meta_setting ";        
    
    const datas = await dbConn.raw(sqlStr);    
    
    return datas[0];
};

AdminSetting.findById = async function(id, result) {   
    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND ("+tableKey+" = '"+id+"') ";
    
    const datas = await dbConn.raw(sqlStr);

    //dbConn.end;
    return datas[0][0];
};

function compareMeta(inputData,metaData)
{   
    // console.log("compareMeta");
    // console.log(inputData);
    // console.log(metaData);
    if (inputData!='' && inputData!=metaData) 
    {
        inputData = Cryptof.encryption(metaData);
    }
    // console.log(inputData);
    return inputData;
}

AdminSetting.updateByID =async function(objData, result) {   

    const rowid = objData.id;

    const json_metadata=JSON.stringify(objData.value);
    const tmpData = {        
        value : json_metadata,                
    };
    
    try {
        // console.log(rowid);
        // console.log(tmpData);
        const datas =  await dbConn.raw("UPDATE " +tableName+" SET "+             
        "value=? "                
        +"WHERE meta = ? "
        , [         
             tmpData.value            
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }

    
    
    
};


module.exports = AdminSetting;