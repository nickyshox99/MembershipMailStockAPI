'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'meta_slide'
const tableKey = 'id'

//User object create
var BannerSetting = async function(bannerSetting) {

};

BannerSetting.findAll = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";
    sqlStr += " FROM "+tableName;
    
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
    // dbConn.end;
    return datas[0];
};

BannerSetting.getAllActive = async function( result) {   
    

    let sqlStr = "Select * ";
    sqlStr += " FROM "+tableName;
    sqlStr += " WHERE status=1 "
    
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
    // dbConn.end;
    return datas[0];
};

BannerSetting.findById = async function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    // dbConn.end;
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

BannerSetting.create = async function(objData, result) {   
    
    let sqlStr = "Select * FROM agent_account";
    sqlStr += " where status=1 ";
    
    const dataByID = await dbConn.raw(sqlStr);    
    
    // let metadata = JSON.parse(dataByID[0].meta_data);
    
   
    
    try {
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        ",img "         
        +",status "         
        +" ) VALUES (?,?,?)"
        , [            
            objData.img
            ,objData.status
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        // dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
    
};

BannerSetting.updateByID = async function(objData, result) {   

    const rowid = objData.id;
   
    try {
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "        
        +"img=? "            
        +",status=? "        
        +"WHERE id = ? "
        , [ 
            ,objData.img
            ,objData.status
            , rowid]);
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        // dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return fales;
    }
    
};

BannerSetting.deleteByID = async function(objData, result) {   

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);
        
        let lstID =objData.listId.join(",");
        // console.log(lstID);
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        // dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

module.exports = BannerSetting;