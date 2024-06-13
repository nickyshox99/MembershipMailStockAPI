'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('../models/cryptof.model');
var crypto = require('crypto'); 

const jwt = require('jsonwebtoken');
const tableName = 'admins'
const tableKey = 'adminName'

//User object create
var StaffSetting = async function(adminBankList) {
    // this.adminName = userlist.adminName;
    // this.am_password = userlist.am_password;
    // this.fullName = userlist.fullName;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    
    // this.am_status = userlist.am_status;
};

StaffSetting.findAll = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select "+tableName+".* ,am_group.name  ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " INNER JOIN am_group ON am_group.id="+tableName+".am_group ";
    sqlStr += " where 1=1 AND ("+tableKey+" like '%"+searchword+"%') ";
    
    let datas = await dbConn.raw(sqlStr);

    return datas[0];
};

StaffSetting.findById = async function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " INNER JOIN am_group ON am_group.id="+tableName+".am_group ";
    sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    dbConn.end;
    return datas[0][0]?datas[0][0]:[];
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

StaffSetting.create = async function(newUser, result) {   
    
    try {
        const datas = await dbConn.raw("INSERT INTO " + tableName + " (adminName,hash,salt,fullName,status,createdAt,createdBy,updatedAt,updatedBy,am_rank,am_group)VALUES(?,?,?,?,?,?,?,?,?,?,?) "
        , [newUser.adminName, newUser.hash, newUser.salt,newUser.fullName,newUser.status,newUser.createdAt,newUser.createdBy,newUser.updatedAt,newUser.updatedBy,newUser.am_rank,newUser.am_group]);    
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
    
};

StaffSetting.updateByID = async function(objData, result) {   

    const rowid = objData.adminName;

    let password = objData.hash;
    
    if (objData.oldPassword!=password) 
    {
        var key = 'SuperSumohmomo';
        var encrypted = crypto.createHmac('sha1', key).update(password).digest('hex');
        password = encrypted;
    }
   
    try {
            
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"adminName=? " 
        +",hash=? "
        +",fullName=? "        
        +",am_rank=? "
        +",am_group=? "
        +",status=? "        
        +"WHERE adminName = ?"
        , [     
            objData.adminName     
            ,password
            ,objData.fullName            
            ,objData.am_rank
            ,objData.am_group
            ,objData.status
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {        
        return {errorMessage : error.message};
    }
    
};

StaffSetting.deleteByID = async function(objData, result) {   

    try {
        

        let lstID =objData.listId.join(",");        
        //console.log("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");

        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }

};

StaffSetting.inactiveByID = async function(objData, result) {   
   
    try {
        let lstID = objData.listId.join(",");

        const datas = await dbConn.raw("UPDATE " +tableName+" SET "+ 
        " `am_status` = (am_status-1)*-1 "
        +" WHERE id in ("+lstID+") "
        );   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        return {errorMessage : error.message};
    }
    
    
};

module.exports = StaffSetting;