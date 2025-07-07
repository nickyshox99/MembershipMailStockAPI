var dbConn = require('../../config/db.config');
const timerHelper = require('../modules/timehelper');
const Cryptof = require('./cryptof.model');
const MemberList = require('./memberlist.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var NoticeManage = async function() {
    
};

NoticeManage.createAdmin = async function(userData,icon,title,text,meta_data,status,result) 
{   
    

    const tmpData = {        
        username : userData.id?userData.id:'',
        mobile_no : userData.mobile_no?userData.mobile_no:'',
        icon : icon,
        title : title?title:'-',
        text : text?text:'',
        meta_data : meta_data?meta_data:'',
        status : status,        
    };
    
    try {
        // console.log(rowid);
        //console.log(tmpData);
        const datas = await dbConn.raw("INSERT INTO notice_admin ("+ 
        "username "
        +",mobile_no "
        +",icon "
        +",title "
        +",text "
        +",meta_data " 
        +",status " 
        +",date " 
        +" ) VALUES (?,?,?,?,?,'"+tmpData.meta_data+"',?,?)"
        , [
            tmpData.username
            ,tmpData.mobile_no
            ,tmpData.icon
            ,tmpData.title
            ,tmpData.text                        
            ,tmpData.status
            ,timerHelper.convertDatetimeToString(new Date())
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

NoticeManage.createMember = async function(userData,icon,title,text,meta_data,status,result) 
{   


    const tmpData = {        
        username : userData.id?userData.id:'',
        mobile_no : userData.mobile_no?userData.mobile_no:'',
        icon : icon,
        title : title?title:'',
        text : text?text:'',
        meta_data : meta_data?meta_data:'',
        status : status,        
    };
    
    try {
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw("INSERT INTO notice_user ("+ 
        "username "
        +",mobile_no "
        +",icon "
        +",title "
        +",text "
        +",meta_data " 
        +",status " 
        +",date " 
        +" ) VALUES (?,?,?,?,?,'"+tmpData.meta_data+"',?,?)"
        , [
            tmpData.username
            ,tmpData.mobile_no
            ,tmpData.icon
            ,tmpData.title
            ,tmpData.text                        
            ,tmpData.status
            ,timerHelper.convertDatetimeToString(new Date())
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

NoticeManage.createAlliance = async function(userData,icon,title,text,meta_data,status,result) 
{   

    const tmpData = {
        
        username : userData.id?userData.id:'',
        mobile_no : userData.mobile_no?userData.mobile_no:'',
        icon : icon,
        title : title?title:'',
        text : text?text:'',
        meta_data : meta_data?meta_data:'',
        status : status,        
    };
    
    try {
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw("INSERT INTO notice_al ("+ 
        ",username "
        +",mobile_no "
        +",icon "
        +",title "
        +",text "
        +",meta_data " 
        +",status " 
        +",date " 
        +" ) VALUES (?,?,?,?,?,'"+tmpData.meta_data+"',?,?)"
        , [
            tmpData.username
            ,tmpData.mobile_no
            ,tmpData.icon
            ,tmpData.title
            ,tmpData.text                        
            ,tmpData.status
            ,timerHelper.convertDatetimeToString(new Date())
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

NoticeManage.updateAdminByID = async function(id,status,result) 
{   
    const tmpData = {
        id : id,
        status : status,        
    };
    
    try {
        const sqlStr = `UPDATE notice_admin SET            
         status=${status}
         WHERE id = ${id}`;
        
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw(sqlStr);    
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
};

NoticeManage.updateMemberByID = async function(id,status,result) 
{   
    const tmpData = {
        id : id,
        status : status,        
    };
    
    try {
        const sqlStr = `UPDATE notice_user SET 
         status=${status}
         WHERE id = ${id}`;
        
        // console.log(sqlStr);
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw(sqlStr);      
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
};

NoticeManage.updateAllianceByID = async function(id,status,result) 
{   
    const tmpData = {
        id : id,
        status : status,        
    };
    
    try {
        const sqlStr = `UPDATE notice_al SET            
         status=${status}
         WHERE id = ${id}`;
        
        // console.log(rowid);
        // console.log(tmpData);
        const datas = await dbConn.raw(sqlStr);      
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
    
};

NoticeManage.findNoticeMemberByID = async function(username, result) {   
    let sqlStr = "Select *   ";        
    sqlStr += " FROM notice_user ";    
    sqlStr += " where 1=1 AND (username = '"+username+"') and status=1 order by date asc limit 0,1";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0]?datas[0]:[];
};

NoticeManage.findNoticeAdminByID = async function(adminname, result) {   
    let sqlStr = "Select *   ";        
    sqlStr += " FROM notice_admin ";    
    sqlStr += " where 1=1 AND (username = '"+adminname+"') and status=1 order by date asc limit 0,1";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0]?datas[0]:[];
};

NoticeManage.findNoticeAllianceByID = async function(username, result) {   
    let sqlStr = "Select *   ";        
    sqlStr += " FROM notice_al ";    
    sqlStr += " where 1=1 AND (username = '"+username+"') and status=1 order by date asc limit 0,1";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0]?datas[0]:[];
};


module.exports = NoticeManage;