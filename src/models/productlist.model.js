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
    sqlStr += " FROM product_list ";    
    sqlStr += " where 1=1 AND (id = "+id+") ";
    
    
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

    let sqlStr = "Select membership_order_history.* ";
    sqlStr += " FROM membership_order_history ";    
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
        //console.log(objData);

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
        +",note "  
        +" ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        , [
            objData.user_id 
            ,objData.email
            ,objData.product_id            
            ,objData.subscription_type_id            
            ,objData.product_name
            ,null
            ,null
            ,objData.buy_date
            ,objData.create_by
            ,objData.create_date
            ,null
            ,null
            ,objData.note
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
        +",note "  
        +" ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        , [
            objData.user_id 
            ,objData.email
            ,objData.product_id
            ,objData.subscription_type_id            
            ,objData.product_name
            ,objData.start_date
            ,objData.end_date
            ,objData.buy_date
            ,objData.create_by
            ,objData.create_date
            ,objData.approve_by
            ,objData.approve_date
            ,objData.note
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
        +",approve_date=? "
        +",start_date=? "
        +",end_date=? "
        +",note=? "
        +"WHERE id = ? "
        , [             
            objData.approve_by  
            ,objData.approve_date  
            ,objData.start_date  
            ,objData.end_date  
            ,objData.note  
            ,rowid
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.SentFamliyInviteOrder = async function(objData, result) {   

    const rowid = objData.id;    

    try {
        
        const datas = await dbConn.raw("UPDATE membership_order_history SET "
        +"sent_email_by=? "
        +",sent_email_at=? "
        +",note=? "
        +",skip_invite=0 "
        +",wait_check_payment=1 "
        +" WHERE id = ? "
        , [             
            objData.sent_email_by  
            ,objData.sent_email_at  
            ,objData.note  
            ,rowid
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.SkipFamliyInviteOrder = async function(objData, result) {   

    const rowid = objData.id;    

    try {
        
        const datas = await dbConn.raw("UPDATE membership_order_history SET "
        +"sent_email_by=? "
        +",sent_email_at=? "
        +",note=? "
        +",skip_invite=1 "
        +",wait_check_payment=1 "
        +" WHERE id = ? "
        , [             
            objData.sent_email_by  
            ,objData.sent_email_at  
            ,objData.note  
            ,rowid
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.PaymentOrderWithSlip = async function(objData, result) {   

    const rowid = objData.id;    

    try {
        
        const datas = await dbConn.raw("UPDATE membership_order_history SET "
        +"slip_file_url=? "
        +",slip_file_at=? "
        +",wait_check_payment=1 "
        +",slip_correct=NULL "
        +",check_slip_by='' "
        +" WHERE id = ? "
        , [             
            objData.slip_file_url  
            ,objData.slip_file_at  
            ,rowid
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.SentPaymentMessageOrder = async function(objData, result) {   

    const rowid = objData.id;    

    try {
        
        const datas = await dbConn.raw("INSERT INTO offer_message ( "
        +"offer_at "
        +",to_email "
        +",to_userid "
        +",subscription_type_id "
        +",offer_by "
        +" )VALUES(?,?,?,?,?)"        
        , [ 
            objData.offer_at  
            ,objData.to_email  
            ,objData.to_userid
            ,objData.subscription_type_id
            ,objData.offer_by
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.VerifySlipOrder = async function(objData, result) {   

    const rowid = objData.id;    

    try {
        
        const datas = await dbConn.raw("UPDATE membership_order_history SET "
        +"wait_check_payment=0 "
        +",slip_correct=? "
        +",check_slip_by=? "    
        +",check_slip_at=? "    
        +" WHERE id = ? "
        , [             
            objData.slip_correct  
            ,objData.check_slip_by  
            ,objData.check_slip_at
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
        +",note=? "        
        +"WHERE id = ? "
        , [   
            objData.note,
            rowid
            ]          
        );
        

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

productList.GetHistorySubScribeOrderByMemberID = async function(memberId, result) {   

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " FROM membership_order_history ";        
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (user_id='"+memberId+"' )";    
    sqlStr += " ORDER BY canceled, subscription_type_id , email,end_date DESC ";
    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderNotApprove = async function(result) {   

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " FROM membership_order_history ";        
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (membership_order_history.approve_by is NULL || membership_order_history.approve_by ='') ";    
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";
    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderWaitInvitation = async function(result) {   

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,(SELECT subscription_group.group_name FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email AND subscription_group.subscription_type_id = membership_order_history.subscription_type_id  LIMIT 1) as group_name ";   
    sqlStr += " ,(SELECT subscription_group.id FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email AND subscription_group.subscription_type_id = membership_order_history.subscription_type_id LIMIT 1) as group_id ";   
    sqlStr += " FROM membership_order_history ";        
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";    
    sqlStr += " AND (membership_order_history.sent_email_by is NULL OR membership_order_history.sent_email_by ='') ";    
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";
    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderWaitCheckPayment = async function(result) {   

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,(SELECT subscription_group.group_name FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_name ";   
    sqlStr += " ,(SELECT subscription_group.id FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_id ";   
    sqlStr += " FROM membership_order_history ";        
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";    
    sqlStr += " AND (membership_order_history.sent_email_by is not NULL AND membership_order_history.sent_email_by <>'') ";    
    sqlStr += " AND (membership_order_history.wait_check_payment = 1 ) ";    
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";
    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderCheckedPayment = async function(result) {   

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,(SELECT subscription_group.group_name FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_name ";   
    sqlStr += " ,(SELECT subscription_group.id FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_id ";   
    sqlStr += " FROM membership_order_history ";        
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";    
    sqlStr += " AND (membership_order_history.sent_email_by is not NULL AND membership_order_history.sent_email_by <>'') ";    
    sqlStr += " AND (membership_order_history.wait_check_payment = 0 ) ";    
    sqlStr += " AND (membership_order_history.slip_correct is not NULL ) ";    
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";
    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

productList.GetOrderNearExpire = async function(result) {   

    let sqlStr = `
    SELECT 
        moh.*, 
        st.subscription_name, 
        st.subscription_img,
        DATEDIFF(latest.max_end_date,CURDATE()) AS days_left,
        offerlatest.max_offer_at as latest_offer_message_at,
        offerlatest.offer_by
        FROM membership_order_history moh 
        INNER JOIN (
            SELECT 
                email, 
                MAX(end_date) AS max_end_date,
                subscription_type_id
            FROM membership_order_history
            WHERE slip_correct=1
            GROUP BY email, subscription_type_id
        ) latest 
        ON moh.email = latest.email 
        AND moh.subscription_type_id = latest.subscription_type_id 
        AND moh.end_date = latest.max_end_date
        LEFT JOIN ( 
            SELECT 
                to_email, 
                MAX(offer_at) AS max_offer_at,
                subscription_type_id,
                offer_by
            FROM offer_message
            GROUP BY to_email,subscription_type_id
        ) offerlatest ON moh.email = offerlatest.to_email AND moh.subscription_type_id = offerlatest.subscription_type_id
        LEFT JOIN subscription_type st ON st.id = moh.subscription_type_id
        WHERE moh.slip_correct = 1
        AND DATEDIFF(latest.max_end_date,CURDATE())<7
        AND moh.canceled<>1
        ORDER BY days_left ASC;
    `;
    
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};



productList.GetSubScribeOrderById = async function(id,email,result) {   

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";    
    sqlStr += " FROM membership_order_history ";        
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += ` AND membership_order_history.id=${id} and membership_order_history.email='${email}'`;
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";        
    
    let datas = await dbConn.raw(sqlStr);

   
    //dbConn.end;
    return datas[0];
};

module.exports = productList;