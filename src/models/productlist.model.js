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

    let sqlStr = "Select product_list.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " FROM "+tableName;
    sqlStr += " INNER JOIN subscription_type ON subscription_type.id=product_list.subscription_type_id ";
    sqlStr += " WHERE product_list.status=1  ";
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

productList.findAll = async function( result) {   

    let sqlStr = "Select product_list.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " FROM "+tableName;
    sqlStr += " INNER JOIN subscription_type ON subscription_type.id=product_list.subscription_type_id ";
    
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
        +",subscription_type_id "
        +",product_img "        
        +",use_credit "         
        +",status  "  
        +",type  "
        +",product_desc "
        +",give_credit "  
        +",subscription_day "  
        +",subscription_times "  
        +" ) VALUES (?,?,?,?,?,?,?,?,?,?)"
        , [
            objData.product_name
            ,objData.subscription_type_id
            ,objData.product_img            
            ,objData.use_credit            
            ,objData.status
            ,objData.type
            ,objData.product_desc
            ,objData.give_credit
            ,objData.subscription_day
            ,objData.subscription_times
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
        +",subscription_type_id=? "
        +",product_img=? "        
        +",use_credit=? "
        +",status=? "
        +",type=? "       
        +",product_desc=? "       
        +",give_credit=? "        
        +",subscription_day=? "        
        +",subscription_times=? "        
        +" WHERE id = ? "
        , [ 
            objData.product_name
            ,objData.subscription_type_id
            ,objData.product_img            
            ,objData.use_credit
            ,objData.status
            ,objData.type            
            ,objData.product_desc
            ,objData.give_credit
            ,objData.subscription_day
            ,objData.subscription_times
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
        +"status=? "                
        +"WHERE id in ("+lstID+") "
        , [             
            ,objData.status  
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

productList.getLastSubscriptionOrderByMemberID = async function(memberId,subTypeId,email, result) {   

    let sqlStr = "Select product_order_history.* ";
    sqlStr += " FROM product_order_history ";    
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (user_id='"+memberId+"' )";    
    sqlStr += " AND (email='"+email+"' )";    
    sqlStr += " AND (subscription_type_id="+subTypeId+" )";
    sqlStr += " AND end_date is not NULL ";
    sqlStr += " AND approve_date is not NULL ";    
    sqlStr += " AND canceled = 0 ";    
    sqlStr += " ORDER BY end_date DESC LIMIT 1 ";
    
    let datas = await dbConn.raw(sqlStr);

    //dbConn.end;
    return datas[0];
};

productList.createSubScribeOrder = async function(objData, result) {   
    
        
    try {

        const datas = await dbConn.raw("INSERT INTO membership_order_history ("+ 
        "user_id "       
        +",email "
        +",product_id  "        
        +",subscription_type_id "         
        +",product_name  "  
        +",start_date   "
        +",end_date  "
        +",buy_date  "  
        +",create_by "  
        +",create_date "  
        +",approve_by  "  
        +",approve_date "  
        +" ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
        , [
            objData.user_id 
            ,objData.email
            ,objData.product_img            
            ,objData.subscription_type_id            
            ,objData.product_name
            ,null
            ,null
            ,objData.buy_date
            ,objData.create_by
            ,objData.create_date
            ,null
            ,null
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

productList.createAndApproveSubScribeOrder = async function(objData, result) {   
    
        
    try {

        const datas = await dbConn.raw("INSERT INTO membership_order_history ("+ 
        "user_id "       
        +",email "
        +",product_id  "        
        +",subscription_type_id "         
        +",product_name  "  
        +",start_date   "
        +",end_date  "
        +",buy_date  "  
        +",create_by "  
        +",create_date "  
        +",approve_by  "  
        +",approve_date "  
        +" ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
        , [
            objData.user_id 
            ,objData.email
            ,objData.product_img            
            ,objData.subscription_type_id            
            ,objData.product_name
            ,objData.start_date
            ,objData.end_date
            ,objData.buy_date
            ,objData.create_by
            ,objData.create_date
            ,objData.approve_by
            ,objData.approve_date
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

productList.getOrderById = async function(id, result) {   

    let sqlStr = "Select *  ";        
    sqlStr += " FROM membership_order_history ";    
    sqlStr += " where 1=1 AND (id = "+id+") ";
    
    
    const datas = await dbConn.raw(sqlStr);
    
    return datas[0][0]?datas[0][0]:[];
};

productList.approveOrderById = async function(objData, result) {   

    const rowid = objData.id;    
   
    try {
        
        const datas = await dbConn.raw("UPDATE membership_order_history SET "
        +"approve_by=? "
        +"approve_date=? "
        +"start_date=? "
        +"end_date=? "
        +"WHERE id = ? "
        , [             
            ,objData.approve_by  
            ,objData.approve_date  
            ,objData.start_date  
            ,objData.end_date  
            ,rowid
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.cancelOrderById = async function(objData, result) {   

    const rowid = objData.id;    
   
    try {
        
        const datas = await dbConn.raw("UPDATE membership_order_history SET "
        +"canceled=1 "        
        +"WHERE id = ? "
        , [   
            rowid
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

module.exports = productList;