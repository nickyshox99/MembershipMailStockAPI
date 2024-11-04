'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'subscription_type'
const tableKey = 'id'

//User object create
let SubscriptionType = async function() {
    
};

SubscriptionType.findAll = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " where 1=1 AND (subscription_name like '%"+searchword+"%') ";
        
        let datas = await dbConn.raw(sqlStr);
    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
   
};

SubscriptionType.findAllActive = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " where 1=1 AND (subscription_name like '%"+searchword+"%') ";

        //console.log(sqlStr);
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

SubscriptionType.findById = async function(id, result) {   

    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM "+tableName;    
        sqlStr += " where 1=1 AND (id = "+id+") ";        
        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
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

SubscriptionType.create = async function(objData, result) {   
        
    try {
    
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        "subscription_name " 
        +",subscription_img "         
        +",status " 
        +" ) VALUES (?,?,?)"
        , [
            objData.subscription_name
            ,objData.subscription_img            
            ,objData.status
        ]);   
                
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

SubscriptionType.updateByID = async function(objData, result) {   

    const rowid = objData.id;

    try {        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"subscription_name=?"
        +",subscription_img=? "                
        +",status=? "
        +"WHERE id = ? "
        , [
            objData.subscription_name
            ,objData.subscription_img            
            ,objData.status
            ,rowid
        ]);   
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
};

SubscriptionType.deleteByID = async function(objData, result) {   

    try {
        
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
       
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }

};

SubscriptionType.inactiveByID = async function(objData, result) {   
    
    try {
    
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "+ 
        " `status` = (status-1)*-1 "
        +" WHERE id in ("+lstID+") "
        );   
    
    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
};

module.exports = SubscriptionType;