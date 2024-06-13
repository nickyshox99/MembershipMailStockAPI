'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const jwt = require('jsonwebtoken');
const tableName = 'refer'
const tableKey = 'id'

//User object create
var ReferList = async function(memberlist) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    
    // this.am_status = userlist.am_status;
};

ReferList.create = async function(objData, result) {   
    
    const tmpData = {
        refer : objData.refer,                    
        status : objData.status,
    };
    
    try {
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        "refer "        
        +",status "        
        +" ) VALUES (?,?)"
        , [
            tmpData.refer            
            ,tmpData.status           
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

ReferList.findAll = async function(searchword, result) {   
    searchword = searchword?searchword:'';
    let sqlStr = "Select * ";            
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (refer like '%"+searchword+"%') ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0];
};

ReferList.findById = async function(username,avatar, result) {   
    let sqlStr = "Select sl_users.*, (CASE WHEN status=1 THEN 'active' ELSE 'inactive' END ) as statusstr ";    
    sqlStr += ",'"+avatar+"' as avatar ";
    sqlStr += ",bank_info.bank_ico,bank_info.bank_color ";
    sqlStr += " FROM sl_users ";
    sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id = sl_users.bank_id "
    sqlStr += " where 1=1 AND (mobile_no = '"+username+"' or id ='"+ username+"') ";
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0][0]?datas[0][0]:[];
};

ReferList.updateByID = async function(objData, result) {   
    try {
        
        const rowid = objData.id;

        // console.log(rowid);
        // console.log(objData);
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "+ 
        "refer=?"   
        +",status=?"     
        +" WHERE id = ? "
        , [
            objData.refer        
            ,objData.status         
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

ReferList.inactiveByID = async function(objData, result) {   
    
    try {
        const datesWrappedInQuotes = objData.listId.map(date => `'${date}'`);
        const withCommasInBetween = datesWrappedInQuotes.join(',')
                
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "+ 
        " `status` = (status-1)*-1 "
        +" WHERE id in ("+withCommasInBetween+") "
        );   
        
        return datas;
    } catch (error) {
        console.log(error);
        return false;
    }
    
   
    
};

ReferList.deleteByID = async function(objData, result) {   

    try {
        
        let lstID =objData.listId.join(",");
        console.log(lstID);
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
        
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

module.exports = ReferList;