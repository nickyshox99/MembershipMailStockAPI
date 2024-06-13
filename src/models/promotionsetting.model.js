'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'meta_promotion_setting'
const tableKey = 'id'

//User object create
var PromotionSetting = async function(adminBankList) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    
    // this.am_status = userlist.am_status;
};

PromotionSetting.findAll = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (meta like '%"+searchword+"%') ";
    // console.log(sqlStr);
    let datas = await dbConn.raw(sqlStr);

    let newDatas = [];    
    let i = 0;
    datas[0].forEach(element => {
        newDatas[i] = element;        
        
        let tmpMeta = JSON.parse(element.meta);        
        for (const [key, value] of Object.entries(tmpMeta)) 
        {            
            newDatas[i][key] = value;
        }
        i++;
    });


    // console.log(datas);
    //dbConn.end;
    return newDatas;
};

PromotionSetting.findAllActive = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (meta like '%"+searchword+"%') and status=1 ";
    // console.log(sqlStr);
    let datas = await dbConn.raw(sqlStr);

    let newDatas = [];    
    let i = 0;
    datas[0].forEach(element => {
        newDatas[i] = element;        
        
        let tmpMeta = JSON.parse(element.meta);        
        for (const [key, value] of Object.entries(tmpMeta)) 
        {            
            newDatas[i][key] = value;
        }
        i++;
    });


    // console.log(datas);
    //dbConn.end;
    return newDatas;
};

PromotionSetting.findById = async function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (id = "+id+") ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);

    let newDatas = [];    
    if (datas[0]) {
        const element =datas[0];
        newDatas = element;        
        let tmpMeta = JSON.parse(element.meta);        
        for (const [key, value] of Object.entries(tmpMeta)) 
        {            
            newDatas[key] = value;
        }        
    }
    
    // console.log(datas);
    //dbConn.end;
    return newDatas;
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

PromotionSetting.create = async function(objData, result) {   
    
    let sqlStr = "Select * FROM agent_account ";
    sqlStr += " where status=1 ";
    
    const dataByID = await dbConn.raw(sqlStr);    
    
    // let metadata = JSON.parse(dataByID[0].meta_data);

    let tmp_metadata = {
        Banner : objData.Banner?objData.Banner:'-',
        Title : objData.Title?objData.Title:'-',
        Type : objData.Type?objData.Type:'Normal',
        LimitPerDay : objData.LimitPerDay?objData.LimitPerDay:1,
        From: objData.From?objData.From:new Date(),
        To: objData.To?objData.To:new Date(),
        Deposit: objData.Deposit?objData.Deposit:1,
        DepositType: objData.DepositType?objData.DepositType:'Equal',
        Rec: objData.Rec?objData.Rec:1,
        Rec_type: objData.Rec_type?objData.Rec_type:"unit",
        Limit: objData.Limit?objData.Limit:100,
        LimitType: objData.LimitType?objData.LimitType:'DepositWithBonus',
        TurnOver: objData.TurnOver?objData.TurnOver:100,
        TurnType: objData.TurnType?objData.TurnType:'percent',
        TurnCal: objData.TurnCal?objData.TurnCal:'credit_bonus',
        TurnTypeWithdraw: objData.TurnTypeWithdraw?objData.TurnTypeWithdraw:'turnover',
        TypeTakeTurn: objData.TypeTakeTurn?objData.TypeTakeTurn:'ALL',        
        MaxWithdraw: objData.MaxWithdraw?objData.MaxWithdraw:'',
        note_pro: objData.note_pro?objData.note_pro:'',
    };
    
    // let json_metadata=JSON.stringify(tmp_metadata);
    // json_metadata = json_metadata.replace("/","\/");
    // console.log(json_metadata);

    // let json_metadata = JSON.stringify(tmp_metadata, function(key, value) {
    //     if (typeof value === "string") {
    //         return value.split("/").join("\\/");
    //     }
    //     return value;
    // });

    let json_metadata = JSON.stringify(tmp_metadata, undefined, 0).replace(/\\/g, '\\\\');
    
    const tmpData = {            
        meta_data : json_metadata,                  
        status : objData.statusActive?objData.statusActive:1,
        deleted : objData.deleted?objData.deleted:0,
    };
    
    try {
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        "meta " 
        +",status " 
        +",deleted " 
        +" ) VALUES (?,?,?)"
        , [
            tmpData.meta_data
            ,tmpData.status
            ,tmpData.deleted            
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
    
};

PromotionSetting.updateByID = async function(objData, result) {   

    const rowid = objData.id;

    let sqlStr = "Select * FROM agent_account ";
    sqlStr += " where status=1 ";
    
    const dataByID = await dbConn.raw(sqlStr);    
    
    // let metadata = JSON.parse(objData.meta_data);

    let tmp_metadata = {
        Banner : objData.Banner?objData.Banner:'-',
        Title : objData.Title?objData.Title:'-',
        Type : objData.Type?objData.Type:'Normal',
        LimitPerDay : objData.LimitPerDay?objData.LimitPerDay:1,
        From: objData.From?objData.From:new Date(),
        To: objData.To?objData.To:new Date(),
        Deposit: objData.Deposit?objData.Deposit:1,
        DepositType: objData.DepositType?objData.DepositType:'Equal',
        Rec: objData.Rec?objData.Rec:1,
        Rec_type: objData.Rec_type?objData.Rec_type:"unit",
        Limit: objData.Limit?objData.Limit:100,
        LimitType: objData.LimitType?objData.LimitType:'DepositWithBonus',
        TurnOver: objData.TurnOver?objData.TurnOver:100,
        TurnType: objData.TurnType?objData.TurnType:'percent',
        TurnCal: objData.TurnCal?objData.TurnCal:'credit_bonus',
        TurnTypeWithdraw: objData.TurnTypeWithdraw?objData.TurnTypeWithdraw:'turnover',
        TypeTakeTurn: objData.TypeTakeTurn?objData.TypeTakeTurn:'ALL',    
        MaxWithdraw: objData.MaxWithdraw?objData.MaxWithdraw:'',
        note_pro: objData.note_pro?objData.note_pro:'',
    };

    let json_metadata = JSON.stringify(tmp_metadata, undefined, 0).replace(/\\/g, '\\\\');

    const tmpData = {            
        meta_data : json_metadata,                   
        status : objData.status?objData.status:1,
        deleted : objData.deleted?objData.deleted:0,
    };
    
    try {
        // console.log(tmpData.meta_data);
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +" meta='"+tmpData.meta_data+"'"
        +",status=? "        
        +",deleted=? "
        +"WHERE id = ? "
        , [            
            ,tmpData.status            
            ,tmpData.deleted
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
};

PromotionSetting.deleteByID = async function(objData, result) {   

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);

        let lstID =objData.listId.join(",");
        console.log(lstID);
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }

};

PromotionSetting.inactiveByID = async function(objData, result) {   
    
    
    const datesWrappedInQuotes = objData.listId.map(date => `'${date}'`);
    const withCommasInBetween = datesWrappedInQuotes.join(',')
    // console.log( withCommasInBetween );
    // let lstID = objData.listId.join(",");

    // console.log(lstID);
    // console.log(objData);
    
    const datas = await dbConn.raw("UPDATE " +tableName+" SET "+ 
    " `deleted` = (deleted-1)*-1 "
    +" WHERE id in ("+withCommasInBetween+") "
    );   
    
    // const datas=[];
    // datas['affectedRows'] = 0;
    //dbConn.end;
    return datas;
    
};

PromotionSetting.getPromotionByType = async function (promotionType,result) {
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (promotion_type = '"+promotionType+"' ) ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0]?datas[0]:[];
}

module.exports = PromotionSetting;