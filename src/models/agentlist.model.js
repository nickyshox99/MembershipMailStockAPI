'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const jwt = require('jsonwebtoken');
const tableName = 'agent_account'
const tableKey = 'id'

var AgentList = function() 
{
    
};

AgentList.create = function(newData, result) {
    console.log(newData);    
    try {
        const datas = dbConn.query("INSERT INTO " + tableName + " (agent,username,password,prefix,end_point_api,end_point_game,setting_register,id_random,meta_data,parent,status,line_token,agent_brand)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) "
        , [newData.agent,newData.username,newData.password,newData.prefix,newData.end_point_api,newData.end_point_game,newData.setting_register,newData.id_random,newData.meta_data,newData.parent,newData.status,newData.line_token,newData.agent_brand]);
        dbConn.end;        
        return datas;
    } catch (error) {
        return error;
    }
    
};

AgentList.findAll = function(id, result) {   
    try {
        const datas = dbConn.query("Select * from " + tableName +" order by agent " );
        dbConn.end;
        // console.log(datas);
        return datas;
    } catch (error) {
        return error;
    }     
   
};

AgentList.findByID = function(id, result) {   
    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM "+tableName;    
        sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
        
        // console.log(sqlStr);
        const datas = dbConn.query(sqlStr);
        // console.log(datas);
        dbConn.end;
        return datas[0]?datas[0]:[];
        
    } catch (error) {
        return error;
    }
    
};

AgentList.updateByID = function(objData, result) {   

    const rowid = objData.id;
    
    try {
        
        const datas = dbConn.query("UPDATE "+ tableName +" SET "+ 
        "agent=?"
        +",username=? "
        +",password=? "
        +",prefix=? "
        +",end_point_api=? "
        +",end_point_game=? "
        +",setting_register=? "
        +",id_random=? "        
        +",meta_data=? "
        +",parent=? "
        +",status=? "
        +",line_token=? "
        +",agent_brand=? "
        +"WHERE "+tableKey+" = ? "
        , [
            objData.agent
            ,objData.username
            ,objData.password
            ,objData.prefix
            ,objData.end_point_api
            ,objData.end_point_game
            ,objData.setting_register
            ,objData.id_random
            ,objData.meta_data
            ,objData.parent
            ,objData.status
            ,objData.line_token
            ,objData.agent_brand
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

AgentList.deleteByID = function(objData, result) {   

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);

        let lstID =objData.listId.join(",");
        console.log(lstID);
        const datas = dbConn.query("DELETE FROM "+tableName+" WHERE "+tableKey+" in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }

};

AgentList.getActiveAgent = function(result) {   
    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM "+tableName;    
        sqlStr += " where 1=1 AND status=1";
        
        // console.log(sqlStr);
        const datas = dbConn.query(sqlStr);
        // console.log(datas);
        dbConn.end;
        return datas[0]?datas[0]:[];
        
    } catch (error) {
        return error;
    }
    
};


module.exports = AgentList;