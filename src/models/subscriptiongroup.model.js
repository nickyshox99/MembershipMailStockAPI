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
        sqlStr += " ,(SELECT end_at FROM subscription_group_payment WHERE subscription_group_payment.subscription_group_id="+tableName +".id ORDER BY subscription_group_payment.end_at DESC  LIMIT 1  ) as end_at ";
        sqlStr += " ,(SELECT count(*) FROM subscription_group_user WHERE subscription_group_user.subscription_group_id="+tableName +".id ) as CountMember ";
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

SubscriptionGroup.getSubscribeMemberByGroupById = async function(id, result) {   

    try {
        let sqlStr = "Select subscription_group_user.*, subscription_group_user.id as id , subscription_group_user.user_id,subscription_group_user.email,subscription_type.subscription_name,subscription_type.subscription_img  ";        
        sqlStr += " FROM "+tableName;  
        sqlStr += " INNER JOIN subscription_type ON "+tableName+".subscription_type_id = subscription_type.id ";              
        sqlStr += " INNER JOIN subscription_group_user ON "+tableName+".id = subscription_group_user.subscription_group_id ";
        sqlStr += " where 1=1 AND ("+tableName+".id = "+id+") ";        
        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

SubscriptionGroup.getSubscribePaymentById = async function(group_id, result) {   

    try {
        let sqlStr = "Select subscription_group_payment.id as id ,subscription_group_payment.* ";
        sqlStr += " FROM subscription_group_payment ";
        sqlStr += " INNER JOIN subscription_group ON subscription_group.id = subscription_group_payment.subscription_group_id ";
        sqlStr += " where 1=1 AND (subscription_group.id = "+group_id+") ";
        
        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }

};

SubscriptionGroup.getGroupOfMemberByMemberId = async function(user_id, result) {   

    try {
        let sqlStr = "Select subscription_group_user.*, subscription_group_user.id as id , subscription_group_user.user_id,subscription_group_user.email,subscription_type.subscription_name,subscription_type.subscription_img  ";        
        sqlStr += " FROM "+tableName;  
        sqlStr += " INNER JOIN subscription_type ON "+tableName+".subscription_type_id = subscription_type.id ";              
        sqlStr += " INNER JOIN subscription_group_user ON "+tableName+".id = subscription_group_user.subscription_group_id ";
        sqlStr += " where 1=1 AND (subscription_group_user.user_id = '"+user_id+"') ";        
        console.log(sqlStr);
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

SubscriptionGroup.checkDuplicateMember = async function(objData, result) {   

    try {
        let sqlStr = "Select count(*) as totalCount ";
        sqlStr += " FROM subscription_group_user";
        sqlStr += " where 1=1 AND (subscription_group_id = "+objData.subscription_group_id+") ";
        sqlStr += " AND (user_id = '"+objData.user_id+"') ";
        sqlStr += " AND (email = '"+objData.email+"') ";
        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

SubscriptionGroup.addMemberToGroup = async function(objData, result) {   
        
    
    try {
    
        const datas = await dbConn.raw("INSERT INTO  subscription_group_user ("+ 
        "subscription_group_id " 
        +",update_at"
        +",update_by"
        +",user_id " 
        +",email "        
        +" ) VALUES (?,?,?,?,?)"
        , [
            objData.subscription_group_id
            ,objData.update_at            
            ,objData.update_by
            ,objData.user_id
            ,objData.email
        ]);   
                
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

SubscriptionGroup.setMemberToHeaderGroup = async function(objData, result) {   


    try {  
        const datas2 = await dbConn.raw("UPDATE " +tableName+" SET "
        +"is_header_group=0"
        +",update_at=? "                
        +",update_by=? "        
        +"WHERE subscription_group_id = ? "
        , [
            objData.isHeader
            ,objData.update_at            
            ,objData.update_by
            ,objData.subscription_group_id            
        ]);  

        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"is_header_group=?"
        +",update_at=? "                
        +",update_by=? "        
        +"WHERE subscription_group_id = ? and email=? "
        , [
            objData.isHeader
            ,objData.update_at            
            ,objData.update_by
            ,objData.subscription_group_id
            ,objData.email
        ]);   
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
};

SubscriptionGroup.deleteMemberFromGroupByID = async function(objData, result) {   

    try {
        
        let lstID =objData.listId.join(",");        
        
        const datas = await dbConn.raw("DELETE FROM subscription_group_user WHERE id in ("+lstID+")");
       
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }

};

SubscriptionGroup.deletePaymentHistoryByID = async function(objData, result) {   

    try {
        
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM subscription_group_payment WHERE id in ("+lstID+")");
       
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }

};



SubscriptionGroup.addPaymentNoteGroup = async function(objData, result) {   
        
 
    try {
    
        const datas = await dbConn.raw("INSERT INTO  subscription_group_payment ("+ 
        "subscription_group_id " 
        +",start_at"
        +",end_at"
        +",update_at"
        +",update_by"
        +",paid_amount " 
        +",paid_by "        
        +",ref_img1 "        
        +",ref_img2 "        
        +" ) VALUES (?,?,?,?,?,?,?,?,?)"
        , [
            objData.subscription_group_id
            ,objData.start_at            
            ,objData.end_at
            ,objData.update_at            
            ,objData.update_by
            ,objData.paid_amount
            ,objData.paid_by
            ,objData.ref_img1
            ,objData.ref_img2
        ]);   
                
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

module.exports = SubscriptionGroup;