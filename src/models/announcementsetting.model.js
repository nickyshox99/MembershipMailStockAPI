'use strict';

var dbConn = require('../../config/db.config');
const timerHelper = require('../modules/timehelper');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'announcement_setting'
const tableKey = 'id'

//User object create
var PopupSetting = async function(popupSetting) {

};

PopupSetting.findAll = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (topic like '%"+searchword+"%') ";
    // console.log(sqlStr);
    let datas = await dbConn.raw(sqlStr);

    // let newDatas = [];    
    // let i = 0;
    // datas.forEach(element => {
    //     newDatas[i] = element;        
        
    //     let tmpMeta = JSON.parse(element.meta);        
    //     for (const [key, value] of Object.entries(tmpMeta)) 
    //     {            
    //         newDatas[i][key] = value;
    //     }
    //     i++;
    // });


    // console.log(datas);
    //dbConn.end
    return datas[0];
};

PopupSetting.findAllActive = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (topic like '%"+searchword+"%') and status=1 ";
    console.log(sqlStr);
    let datas = await dbConn.raw(sqlStr);

    // let newDatas = [];    
    // let i = 0;
    // datas.forEach(element => {
    //     newDatas[i] = element;        
        
    //     let tmpMeta = JSON.parse(element.meta);        
    //     for (const [key, value] of Object.entries(tmpMeta)) 
    //     {            
    //         newDatas[i][key] = value;
    //     }
    //     i++;
    // });


    // console.log(datas);
    //dbConn.end
    return datas[0];
};

PopupSetting.findById = async function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end
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

PopupSetting.create = async function(objData, result) {   
    
    // let sqlStr = "Select * FROM agent_account";
    // sqlStr += " where status=1 ";
    
    // const dataByID = await dbConn.raw(sqlStr);    
    
    // let metadata = JSON.parse(dataByID[0].meta_data);
    
   
    
    try {

        let dateAnn = objData.date_announcement?new Date(objData.date_announcement):new Date();
        let updatedate = objData.update_date?new Date(objData.update_date):new Date();
        
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        "topic "       
        +",description " 
        +",date_announcement " 
        +",update_date " 
        +",update_by " 
        +",status "         
        +" ) VALUES (?,?,?,?,?,?)"
        , [            
            objData.topic
            ,objData.description
            ,timerHelper.convertDatetimeToStringNoT(dateAnn)
            ,timerHelper.convertDatetimeToStringNoT(updatedate)
            ,objData.update_by  
            ,objData.status                     
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
    
};

PopupSetting.updateByID = async function(objData, result) {   

    const rowid = objData.id;
   
    try {

        let dateAnn = objData.date_announcement?new Date(objData.date_announcement):new Date();
        let updatedate = objData.update_date?new Date(objData.update_date):new Date();
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +" topic=? "
        +",description=? "    
        +",date_announcement=? " 
        +",update_date=? " 
        +",update_by=? " 
        +",status=? "        
        +"WHERE id = ? "
        , [ 
            objData.topic
            ,objData.description
            ,timerHelper.convertDatetimeToStringNoT(dateAnn)
            ,timerHelper.convertDatetimeToStringNoT(updatedate)
            ,objData.update_by  
            ,objData.status 
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end
        return true;
    } catch (error) {
        console.log(error);
        return false;
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
        //dbConn.end
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

module.exports = PopupSetting;