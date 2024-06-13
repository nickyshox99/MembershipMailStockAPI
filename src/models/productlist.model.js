'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'product_list'
const tableKey = 'id'

//User object create
var productList = async function(productSetting) {

};

productList.findAllActive = async function( result) {   

    let sqlStr = "Select * ";
    sqlStr += " FROM "+tableName;
    sqlStr += " WHERE active=1 ";
    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

productList.findById = async function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
    
    
    const datas = await dbConn.raw(sqlStr);
    
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

productList.create = async function(objData, result) {   
    
        
    try {

        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+ 
        "product_name"       
        +",product_thumbnail "
        +",product_img "
        +",use_credit" 
        +",active "         
        +",type "  
        +",sub_type "
        +",product_desc "
        +",give_credit "  
        +",option_credit "  
        +" ) VALUES (?,?,?,?,?,?,?,?,?,?)"
        , [
            objData.product_name
            ,objData.product_thumbnail
            ,objData.product_img
            ,objData.use_credit            
            ,1
            ,objData.type
            ,objData.sub_type
            ,objData.product_desc
            ,objData.give_credit
            ,objData.option_credit
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

productList.updateByID = async function(objData, result) {   

    const rowid = objData.id;
   
    try {
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "        
        +"product_name=? "
        +",product_thumbnail=? "
        +",product_img=? "
        +",use_point=? "
        +",active=? "
        +",type=? "       
        +",sub_type=? "       
        +",product_desc=? "        
        +",give_credit=? "        
        +",option_credit=? "        
        +" WHERE id = ? "
        , [ 
            objData.product_name
            ,objData.product_thumbnail
            ,objData.product_img
            ,objData.use_point
            ,objData.active
            ,objData.type
            ,objData.sub_type
            ,objData.product_desc
            ,objData.give_credit
            ,objData.option_credit
            , rowid]);
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.deleteByID = async function(objData, result) {   

    try {

        
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
   
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.inActiveByID = async function(objData, result) {   

    const rowid = objData.id;    
    let lstID =objData.listId.join(",");
   
    try {
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"active=? "                
        +"WHERE id in ("+lstID+") "
        , [             
            ,objData.active  
        ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.getHistoryOrderByMemberID = async function(memberId,startTime,endTime, result) {   

    let sqlStr = "Select product_order_history.*,product_list.product_img ";
    sqlStr += " FROM product_order_history ";
    sqlStr += " LEFT JOIN product_list ON product_list.id=product_order_history.product_id";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (gift_to='"+memberId+"' OR order_by='"+memberId+"' )";    
    sqlStr += " AND (date between '"+startTime+"' AND '"+endTime+"' )";    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};


module.exports = productList;