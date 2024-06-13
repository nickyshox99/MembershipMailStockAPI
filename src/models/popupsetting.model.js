'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'meta_promotion_popup'
const tableKey = 'id'

//User object create
var PopupSetting = function(popupSetting) {

};

PopupSetting.findAll = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (promotion_text like '%"+searchword+"%') ";
    // console.log(sqlStr);
    let datas = await dbConn.raw(sqlStr);

    return datas[0];
};

PopupSetting.findAllActive = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (promotion_text like '%"+searchword+"%') and status=1 ";
    // console.log(sqlStr);
    let datas = await dbConn.raw(sqlStr);
    return datas[0];
};

PopupSetting.findById = async function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0];
};

function compareMeta(inputData,metaData)
{       
    if (inputData) 
    {
        if (inputData!='' && inputData!=metaData) 
        {
            inputData = Cryptof.encryption(metaData);
        
        }
    } 
    return inputData;
}

PopupSetting.create = async function(objData, result) {   
    
    try {
        
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        ",promotion_img " 
        +",promotion_page " 
        +",promotion_text " 
        +",status "         
        +" ) VALUES (?,'"+objData.promotion_page+"',?,?)"
        , [
            objData.promotion_img
            ,objData.promotion_text
            ,objData.status                     
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
    
};

PopupSetting.updateByID = async function(objData, result) {   

    const rowid = objData.id;
   
    try {
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +" promotion_page='"+objData.promotion_page+"'"
        +",promotion_text=? "    
        +",promotion_img=? " 
        +",status=? "        
        +"WHERE id = ? "
        , [ 
            ,objData.promotion_text           
            ,objData.promotion_img            
            ,objData.status
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
};

PopupSetting.deleteByID = async function(objData, result) {   

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);
        
        let lstID =objData.listId.join(",");
        // console.log(lstID);
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }

};

module.exports = PopupSetting;