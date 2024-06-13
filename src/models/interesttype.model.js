'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'interest_list'
const tableKey = 'id'

//User object create
let InterestType = async function() {
    
};

InterestType.findAll = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,interest_period_list.period_unit ,loan_collateral_type.collateral_name  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_id ";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id ";
        sqlStr += " where 1=1 AND (interest_name like '%"+searchword+"%') ";
        
        let datas = await dbConn.raw(sqlStr);
    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
   
};

InterestType.findAllActive = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,interest_period_list.period_unit ,loan_collateral_type.collateral_name  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_id ";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id ";         
        sqlStr += " where 1=1 AND (interest_name like '%"+searchword+"%') and "+tableName+".status=1 ";

        //console.log(sqlStr);
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

InterestType.findById = async function(id, result) {   

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

InterestType.create = async function(objData, result) {   
        
    try {
    
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        "interest_name " 
        +",period_id " 
        +",collateral_type_id " 
        +",period_number " 
        +",status " 
        +" ) VALUES (?,?,?,?,?)"
        , [
            objData.interest_name
            ,objData.period_id
            ,objData.collateral_type_id
            ,objData.period_number
            ,objData.status
        ]);   
                
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

InterestType.updateByID = async function(objData, result) {   

    const rowid = objData.id;

    try {        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"interest_name=?"
        +",period_id=? "        
        +",collateral_type_id=? "
        +",period_number=? "
        +",status=? "
        +"WHERE id = ? "
        , [
            objData.interest_name
            ,objData.period_id
            ,objData.collateral_type_id
            ,objData.period_number
            ,objData.status
            ,rowid
        ]);   
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
};

InterestType.deleteByID = async function(objData, result) {   

    try {
        
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
       
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }

};

InterestType.inactiveByID = async function(objData, result) {   
    
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

InterestType.getInterestPeriod = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select *  ";        
        sqlStr += " FROM interest_period_list ";                
        
        let datas = await dbConn.raw(sqlStr);
    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
   
};

InterestType.getCollateralType = async function(searchword, result) {   

    try {
        searchword=searchword?searchword:"";

        let sqlStr = "Select *  ";        
        sqlStr += " FROM loan_collateral_type ";                
        
        let datas = await dbConn.raw(sqlStr);
    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
   
};

module.exports = InterestType;