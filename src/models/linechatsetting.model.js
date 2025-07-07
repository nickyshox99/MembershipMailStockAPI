'use strict';

var dbConn = require('../../config/db.config');
const timerHelper = require('../modules/timehelper');

const Cryptof = require('./cryptof.model');
var crypto = require('crypto'); 

const jwt = require('jsonwebtoken');
const tableName = 'line_setting'
const tableKey = 'id'

// //User object create
var lineChatSetting = async function(adminBankList) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    // this.is_parent = userlist.is_parent;
    // this.parent = userlist.parent;
    // this.am_status = userlist.am_status;
};

lineChatSetting.findAll = async function(searchword, result) {   

    try{
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*   ";        
        sqlStr += " FROM "+tableName;            
        sqlStr += " where 1=1 AND ("+tableKey+" like '%"+searchword+"%') ";
        
        let datas = await dbConn.raw(sqlStr);
        
        return datas[0];
    
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
};

lineChatSetting.findAllActive = async function(searchword, result) {   

    try 
    {
        searchword=searchword?searchword:"";

        let sqlStr = "Select "+tableName+".*   ";        
        sqlStr += " FROM "+tableName;            
        sqlStr += " where 1=1 AND ("+tableKey+" like '%"+searchword+"%') and status=1";
        
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

lineChatSetting.findByID = async function(id, result) {   
    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";
        
        const datas = await dbConn.raw(sqlStr);    
        dbConn.end;
        return datas[0][0]?datas[0][0]:[];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

lineChatSetting.findByBotUserId = async function(id, result) {   
    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM "+tableName;        
        sqlStr += " where 1=1 AND (user_id = '"+id+"') ";
        
        
        const datas = await dbConn.raw(sqlStr);    
        dbConn.end;
        return datas[0][0]?datas[0][0]:[];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

lineChatSetting.getContact = async function(bot_user_id, result) {
    try {   
        let sqlStr = "Select *  ";        
        sqlStr += " FROM line_contact ";
        sqlStr += " where 1=1 AND (bot_user_id = '"+bot_user_id+"') ";
        
        let datas = await dbConn.raw(sqlStr);
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
};

lineChatSetting.getContactByUserId = async function(user_id, result) {
    try {   
        let sqlStr = "Select *  ";        
        sqlStr += " FROM line_contact ";
        sqlStr += " where 1=1 AND (user_id = '"+user_id+"') ";

        
        
        let datas = await dbConn.raw(sqlStr);
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
};

lineChatSetting.getLineSticker = async function( result) {   
    try
    {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM line_sticker ";
        sqlStr += " where 1=1 AND active=1 ";
        
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
};

lineChatSetting.getActiveChatContact = async function(bot_user_id,isAdmin,userId, result) {   

    try {
        let sqlStr = "Select line_chat_message.*,line_chat_active.reply_by,line_chat_active.last_chattime   ";        
        sqlStr += " FROM line_chat_active ";
        sqlStr += " INNER JOIN line_chat_message ON line_chat_message.line_chat_active_id=line_chat_active.id";
        sqlStr += " where 1=1 AND is_deleted=0 AND line_chat_active.active=1 AND (line_chat_active.bot_user_id = '"+bot_user_id+"' ) ";
        
        // if (!isAdmin) 
        // {
        //     sqlStr += " AND (line_chat_active.reply_by='' or line_chat_active.reply_by='"+userId+"' or line_chat_active.reply_by is null )";
        // }
    
        sqlStr += " ORDER BY line_chat_message.message_datetime ";
     
        let datas = await dbConn.raw(sqlStr);
    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
   
};

lineChatSetting.getActiveChatContact2 = async function(bot_user_id,isAdmin,userId, result) {   
    try {
        
    
    let sqlStr = `
        SELECT 
            lca.id AS id,
            lca.bot_user_id AS bot_user_id,
            lca.chat_with_user_id AS chat_with_user_id,
            lca.chat_datetime,
            lca.last_chattime,
            lca.active,
            lca.reply_by,
            lca.reply_datetime,
            lca.close_by,
            lca.reply_token,
            lcm.id AS message_id,
            lcm.bot_user_id AS message_bot_user_id,
            lcm.chat_with_user_id AS message_chat_with_user_id,
            lcm.line_chat_active_id,
            lcm.message_datetime,
            lcm.message,
            lcm.message_type,
            lcm.reply_to_id,
            lcm.message_detail,
            lcm.is_read,
            lcm.is_deleted,
            lcm.is_sending,
            lcm.send_by,
            lcm.send_completed,
            COALESCE(unread_message_count.unread_count, 0) AS unread_message_count
        FROM 
            line_chat_active lca
        LEFT JOIN 
            (SELECT 
                lcm1.*
            FROM 
                line_chat_message lcm1
            JOIN 
                (SELECT 
                    line_chat_active_id, MAX(message_datetime) AS max_message_datetime
                FROM 
                    line_chat_message
                WHERE 
                    is_deleted = 0
                GROUP BY 
                    line_chat_active_id) lcm2
            ON 
                lcm1.line_chat_active_id = lcm2.line_chat_active_id 
                AND lcm1.message_datetime = lcm2.max_message_datetime
                AND lcm1.is_deleted = 0) lcm
        ON 
            lca.id = lcm.line_chat_active_id
        LEFT JOIN 
            (SELECT 
                line_chat_active_id, COUNT(*) AS unread_count
            FROM 
                line_chat_message
            WHERE 
                is_read = 0 AND is_deleted = 0 
            GROUP BY 
                line_chat_active_id) unread_message_count
        ON 
            lca.id = unread_message_count.line_chat_active_id
        WHERE 
            lca.active = 1
            AND lca.bot_user_id='${bot_user_id}'
            AND (unread_message_count.unread_count > 0 OR lca.last_chattime > NOW() + INTERVAL 390 MINUTE);
        `;
        
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
};

lineChatSetting.getChatWithUserId = async function(bot_user_id,user_id,isAdmin,userId,openAllHistory, result) {   
    try 
    {
        
        let sqlStr = "Select line_chat_message.*,line_chat_active.reply_by,line_chat_active.active ";        
        sqlStr += " FROM line_chat_active ";
        sqlStr += " INNER JOIN line_chat_message ON line_chat_message.line_chat_active_id=line_chat_active.id";
        sqlStr += " where 1=1  AND (line_chat_active.bot_user_id = '"+bot_user_id+"' AND line_chat_active.chat_with_user_id = '"+user_id+"' ) ";

        if (openAllHistory!=true) 
        {
            sqlStr += " AND is_deleted=0";
        }
        // if (!isAdmin) 
        // {
        //     sqlStr += " AND (line_chat_active.reply_by='' or line_chat_active.reply_by='"+userId+"' or line_chat_active.reply_by is null )";
        // }

        sqlStr += " ORDER BY line_chat_message.message_datetime ";
        
        let datas = await dbConn.raw(sqlStr);
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
};

lineChatSetting.getLastChatWithUserId = async function(bot_user_id,user_id,isAdmin,userId,openAllHistory, result) {   

    try {
        let sqlStr = "Select line_chat_message.*,line_chat_active.reply_by,line_chat_active.active ";        
        sqlStr += " FROM line_chat_active ";
        sqlStr += " INNER JOIN line_chat_message ON line_chat_message.line_chat_active_id=line_chat_active.id";
        sqlStr += " where 1=1  AND (line_chat_active.bot_user_id = '"+bot_user_id+"' AND line_chat_active.chat_with_user_id = '"+user_id+"' ) ";

        if (openAllHistory!=true) 
        {
            sqlStr += " AND is_deleted=0";
        }
        // if (!isAdmin) 
        // {
        //     sqlStr += " AND (line_chat_active.reply_by='' or line_chat_active.reply_by='"+userId+"' or line_chat_active.reply_by is null )";
        // }

        sqlStr += " ORDER BY line_chat_message.message_datetime DESC LIMIT 1";

    
        
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
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

lineChatSetting.create = async function(objData, result) {   
    
    try {
       
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("         
        +" channel_token " 
        +",bot_name " 
        +",line_url "
        // +",display_name "
        // +",user_id "
        // +",basic_id "
        // +",picture_url "
        // +",status_message "
        +",last_login "
        // +",note "
        +",status "
        +",pair_key"
        // +" ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"        
        +" ) VALUES (?,?,?,?,?,?)" 
        , [             
            ,objData.channel_token 
            ,objData.bot_name 
            ,objData.line_url 
            // ,objData.display_name 
            // ,objData.user_id 
            // ,objData.basic_id 
            // ,objData.picture_url 
            // ,objData.status_message 
            ,timerHelper.convertDatetimeToStringNoT(objData.last_login),
            // ,objData.note
            ,objData.status
            ,objData.pair_key
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return true;
    } catch (error) {
        console.log(error);
        return error.message;
    }
    
    
};

lineChatSetting.updateByID = async function(objData, result) {   

    const rowid = objData.id;

    try {
            
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"channel_token=? " 
        +",bot_name=? "
        +",line_url=? "
        +",display_name=? "
        +",user_id=? "
        +",basic_id=? "
        +",picture_url=? "        
        +",status_message=? "        
        +",last_login=? "        
        +",note=? "        
        +",status=? "       
        +"WHERE "+tableKey+" = ?"
        , [     
            objData.channel_token?objData.channel_token:'' 
            ,objData.bot_name?objData.bot_name:''
            ,objData.line_url?objData.line_url:''
            ,objData.display_name?objData.display_name:''
            ,objData.user_id?objData.user_id:''
            ,objData.basic_id?objData.basic_id:'' 
            ,objData.picture_url?objData.picture_url:'' 
            ,objData.status_message?objData.status_message:''
            ,timerHelper.convertDatetimeToStringNoT(objData.last_login)
            , objData.note
            , objData.status
            , rowid
        ]);   
                
        return true;
    } catch (error) {
        console.log(error);
        return error.message;
    }
    
};

lineChatSetting.deleteByID = async function(objData, result) {   

    try {
       
        let lstID =objData.listId.join(",");
        // console.log(lstID);
        console.log("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");

        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;        
        return true;
    } catch (error) {
        console.log(error);
        return error.message;
    }

};

lineChatSetting.getChatTag = async function( result) {   
    try {

        let sqlStr = "Select *  ";        
        sqlStr += " FROM line_tag ";      
        sqlStr += " where 1=1 AND active=1 ";
        sqlStr += " ORDER BY tag_order  ";  
        
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
   
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
    
};

lineChatSetting.insertLineSticker = async function(objData, result) {   

    try {
       
        const datas = await dbConn.raw("INSERT INTO line_sticker ("
        +"packageId"
        +",stickerId"
        +",stickerResourceType"
        +",keywords"
        +",active"
        +" ) VALUES (?,?,?,?,?)"
        , [            
            ,objData.packageId
            ,objData.stickerId
            ,objData.stickerResourceType
            ,objData.keywords
            ,objData.active
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

lineChatSetting.updateLineSticker = async function(objData, result) {   

    const rowid = objData.id;

    try {
            
        const datas = await dbConn.raw("UPDATE line_sticker SET "
        +"packageId=? " 
        +",stickerId=? "
        +",stickerResourceType=? "
        +",keywords=? "
        +",active=? "
        +"WHERE id = ?"
        , [     
            ,objData.packageId?objData.packageId:'' 
            ,objData.stickerId?objData.stickerId:''
            ,objData.stickerResourceType?objData.stickerResourceType:''            
            ,objData.keywords?objData.keywords:''
            ,objData.active?objData.active:0
            , rowid
        ]);   
        
        dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

lineChatSetting.deleteLineStickerById = async function(objData, result) {   

    try {
       
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM line_sticker WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;        
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }

};

lineChatSetting.getQuickMessage = async function(botId, result) {   

    try {
        let sqlStr = "Select line_quick_message.*,line_setting.bot_name  ";        
        sqlStr += " FROM line_quick_message ";
        sqlStr += " LEFT JOIN line_setting ON line_setting.id=line_quick_message.line_setting_id ";
        sqlStr += " where 1=1 AND active=1 ";
        
        if (botId!=0) {
            sqlStr += " AND line_setting_id="+botId;    
        }
        
        sqlStr += " ORDER By orders ";
        
        let datas = await dbConn.raw(sqlStr);
            
        return datas[0];
    
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
   
};

lineChatSetting.insertQuickMessage = async function(objData, result) {   

    try {
       
        const datas = await dbConn.raw("INSERT INTO line_quick_message ("
        +"message"
        +",name_message"
        +",active"
        +",orders"
        +",line_setting_id"
        +" ) VALUES (?,?,?,?,?)"
        , [            
            ,objData.message?objData.message:'' 
            ,objData.name_message?objData.name_message:'' 
            ,objData.active?objData.active:0
            ,objData.orders?objData.orders:''  
            ,objData.line_setting_id?objData.line_setting_id:0  
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

lineChatSetting.updateQuickMessage = async function(objData, result) {   

    const rowid = objData.id;

    try {
            
        const datas = await dbConn.raw("UPDATE line_quick_message SET "
        +"message=? " 
        +",name_message=? "         
        +",active=? "
        +",orders=? "       
        +",line_setting_id=? "
        +"WHERE id = ?"
        , [     
            ,objData.message?objData.message:'' 
            ,objData.name_message?objData.name_message:'' 
            ,objData.active?objData.active:0
            ,objData.orders?objData.orders:''  
            ,objData.line_setting_id?objData.line_setting_id:0         
            , rowid
        ]);   
        
        
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

lineChatSetting.deleteQuickMessageById = async function(objData, result) {   

    try {
       
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM line_quick_message WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }

};

lineChatSetting.getBankVerify = async function( result) {   
    try 
    {
        let sqlStr = "Select bank_verify.*,bank_info.bank_name,line_setting.bot_name,line_setting.picture_url ";        
        sqlStr += " FROM bank_verify ";
        sqlStr += " LEFT JOIN bank_info ON bank_info.bank_id=bank_verify.bank_id ";
        sqlStr += " LEFT JOIN line_setting ON line_setting.id=bank_verify.line_setting_id ";
        sqlStr += " where 1=1 AND bank_verify.status=1 ";
        // sqlStr += " ORDER By orders ";
        
        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
};

lineChatSetting.insertBankVerify = async function(objData, result) {   

    try {
       
        const datas = await dbConn.raw("INSERT INTO bank_verify ("
        +"bank_id"
        +",bank_acc_name"
        +",bank_acc_number"
        +",status"
        +",line_setting_id"
        +" ) VALUES (?,?,?,?,?)"
        , [            
            ,objData.bank_id
            ,objData.bank_acc_name
            ,objData.bank_acc_number
            ,objData.status
            ,objData.line_setting_id            
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

lineChatSetting.updateBankVerify = async function(objData, result) {   

    const rowid = objData.id;

    try {
            
        const datas = await dbConn.raw("UPDATE bank_verify SET "
        +"bank_id=? " 
        +",bank_acc_name=? "
        +",bank_acc_number=? "        
        +",status=? "        
        +",line_setting_id=? "  
        +"WHERE id = ?"
        , [     
            ,objData.bank_id?objData.bank_id:1 
            ,objData.bank_acc_name?objData.bank_acc_name:''
            ,objData.bank_acc_number?objData.bank_acc_number:''            
            ,objData.status?objData.status:1 
            ,objData.line_setting_id?objData.line_setting_id:1 
            , rowid
        ]);   
        
        
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

lineChatSetting.deleteBankVerifyById = async function(objData, result) {   

    try {
       
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("DELETE FROM bank_verify WHERE id in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }

};



module.exports = lineChatSetting;