'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'subscription_group'
const tableKey = 'id'

//User object create
let SubscriptionGroup = async function() {
    
};

SubscriptionGroup.findAll = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*, "+tableName+".id as id , subscription_type.subscription_name,subscription_type.subscription_img  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " LEFT JOIN subscription_type ON "+tableName+".subscription_type_id = subscription_type.id ";
        sqlStr += " where 1=1 AND (group_name like '%"+searchword+"%') ";
        
        let datas = await dbConn.raw(sqlStr);
    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
   
};

SubscriptionGroup.findAllActive = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*, "+tableName+".id as id , subscription_type.subscription_name,subscription_type.subscription_img  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " LEFT JOIN subscription_type ON "+tableName+".subscription_type_id = subscription_type.id ";
        sqlStr += " where 1=1 AND (group_name like '%"+searchword+"%') ";

        //console.log(sqlStr);
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

SubscriptionGroup.findById = async function(id, result) {   

    try {
        let sqlStr = "Select "+tableName+".*, "+tableName+".id as id , subscription_type.subscription_name,subscription_type.subscription_img  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " LEFT JOIN subscription_type ON "+tableName+".subscription_type_id = subscription_type.id ";
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

SubscriptionGroup.create = async function(objData, result) {   
        
    console.log(objData);
    try {
    
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        "group_name " 
        +",update_at"
        +",update_by"
        +",subscription_type_id " 
        +" ) VALUES (?,?,?,?)"
        , [
            objData.group_name
            ,objData.update_at            
            ,objData.update_by
            ,objData.subscription_type_id
        ]);   
                
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

SubscriptionGroup.updateByID = async function(objData, result) {   

    const rowid = objData.id;

    try {        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"group_name=?"
        +",update_at=? "                
        +",update_by=? "
        +",subscription_type_id=? "
        +"WHERE id = ? "
        , [
            objData.group_name
            ,objData.update_at            
            ,objData.update_by
            ,objData.subscription_type_id
            ,rowid
        ]);   
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
};

SubscriptionGroup.deleteByID = async function(objData, result) {   

    try {
        
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
       
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }

};

SubscriptionGroup.inactiveByID = async function(objData, result) {   
    
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

module.exports = SubscriptionGroup;