'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'am_group'
const tableKey = 'id'

//User object create
var StaffGroupSetting = async function(adminBankList) {
    // this.am_username = userlist.am_username;
    // this.am_password = userlist.am_password;
    // this.am_fullname = userlist.am_fullname;
    // this.am_rank = userlist.am_rank;
    // this.am_group = userlist.am_group;
    
    // this.am_status = userlist.am_status;
};

StaffGroupSetting.findAll = async function(searchword, result) {   

    searchword=searchword?searchword:"";

    let sqlStr = "Select * ";        
    sqlStr += " FROM "+tableName;        
    sqlStr += " where 1=1 AND (name like '%"+searchword+"%') ";
    let datas = await dbConn.raw(sqlStr);

    return datas[0];
};

StaffGroupSetting.getAllPage = async function(result) {   

    try {
        let sqlStr = "Select * ";        
        sqlStr += " FROM page_admin ";        
        sqlStr += " WHERE 1=1 and status=1 ORDER BY menuorder ";    
        let datas = await dbConn.raw(sqlStr);   
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
   
};

StaffGroupSetting.getPageByAmPermission = async  function(am_permission,result) {   

    try {
        let sqlStr = "Select * ";        
        sqlStr += " FROM page_admin ";        
        sqlStr += " WHERE 1=1 and status=1 ";
        sqlStr += " AND id in ("+am_permission +") ";
        sqlStr += " ORDER BY menuorder ";   
        let datas = await dbConn.raw(sqlStr);   
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }

    
};

StaffGroupSetting.getPagePermissionByAmGroupId = async function(am_group_id,result) {   

    try {
        let sqlStr = "Select am_group_page_permission.*,page_admin.page_name,page_admin.page_name_th ";        
        sqlStr += " FROM am_group_page_permission ";        
        sqlStr += " INNER JOIN page_admin ON page_admin.id=am_group_page_permission.page_admin_id ";       
        sqlStr += " WHERE 1=1  ";
        sqlStr += " AND am_group_id = "+am_group_id +" ";
        sqlStr += " ORDER BY menuorder ";   
        let datas = await dbConn.raw(sqlStr);   
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }

    
};

StaffGroupSetting.findById = async function(id, result) {   
    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM "+tableName;    
        sqlStr += " where 1=1 AND ("+tableKey+" = "+id+") ";  
        const datas = await dbConn.raw(sqlStr);  
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
   
};

function compareMeta(inputData,metaData)
{   
    
    if (inputData!='' && inputData!=metaData) 
    {
        inputData = Cryptof.encryption(metaData);
    }
    
    return inputData;
}

StaffGroupSetting.create = async function(objData, result) {   
    
    
    try {
        
        const datas = await dbConn.raw("INSERT INTO "+tableName+" ("+         
        "name " 
        +",permission " 
        +",status "        
        +",default_page "    
        +",default_page_th "
        +",default_page_id "          
        +" ) VALUES (?,'"+objData.permission+"',?,?,?,?)"
        , [
            objData.name            
            ,objData.status                     
            ,objData.default_page
            ,objData.default_page_th
            ,objData.default_page_id
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

StaffGroupSetting.checkDuplicatePagePermission = async function(am_group_id,page_admin_id, result) {   

    let sqlStr = "Select * ";        
    sqlStr += " FROM am_group_page_permission";        
    sqlStr += " where 1=1 AND (am_group_id = "+am_group_id+" and page_admin_id="+page_admin_id+") ";
    let datas = await dbConn.raw(sqlStr);

    return datas[0];
};

StaffGroupSetting.insertPagePermission = async function(objData, result) {   
    
    
    try {
        
        const datas = await dbConn.raw("INSERT INTO am_group_page_permission ("+         
        "am_group_id " 
        +",page_admin_id " 
        +",can_view1 "        
        +",can_add1 "    
        +",can_edit1 "
        +",can_delete1 "          
        +",can_approve1 "          
        +",can_viewall1 "          
        +" ) VALUES (?,?,?,?,?,?,?,?)"
        , [
            objData.am_group_id            
            ,objData.page_admin_id                     
            ,objData.can_view1
            ,objData.can_add1
            ,objData.can_edit1
            ,objData.can_delete1
            ,objData.can_approve1
            ,objData.can_viewall1
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return datas[0];
    } catch (error) {
        console.log(error);        
        return {errorMessage : error.message};
    }
    
    
};

StaffGroupSetting.updatePagePermission = async function(objData, result) {   
    
    try {
        
        const datas = await dbConn.raw("UPDATE am_group_page_permission SET "+                 
        "can_view1 =? "        
        +",can_add1 =? "    
        +",can_edit1 =? "
        +",can_delete1 =? "          
        +",can_approve1 =? "          
        +",can_viewall1 =? "          
        + " WHERE "
        + "am_group_id =? " 
        +" and page_admin_id = ? "
        , [                 
            objData.can_view1
            ,objData.can_add1
            ,objData.can_edit1
            ,objData.can_delete1
            ,objData.can_approve1
            ,objData.can_viewall1
            ,objData.am_group_id            
            ,objData.page_admin_id    
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

StaffGroupSetting.deletePagePermission = async function(objData, result) {   
    
    try {
                
        let lstID = objData.listId.join(",");                
        
        const datas = await dbConn.raw("DELETE FROM am_group_page_permission "                 
        + " WHERE "
        + "id in ("+lstID+")"
        );   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
    
};

StaffGroupSetting.updateByID = async function(objData, result) {   

    const rowid = objData.id;
   
    console.log(objData);
    try {
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +" permission='"+objData.permission+"'"
         +",name=? "    
        +",status=? "        
        +",default_page=? "    
        +",default_page_th=? "
        +",default_page_id=? "    
        +"WHERE id = ? "
        , [ 
             objData.name           
            ,objData.status            
            ,objData.default_page 
            ,objData.default_page_th 
            ,objData.default_page_id 
            ,rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return datas[0];
    } catch (error) {
        console.log(error);        
        return {errorMessage : error.message};
    }
    
};

StaffGroupSetting.deleteByID = async function(objData, result) {   

    try {
        //  console.log(objData.listId);
        // console.log(tmpData);
        
        let lstID =objData.listId.join(",");
        // console.log(lstID);
        const datas = await dbConn.raw("DELETE FROM "+tableName+" WHERE "+ tableKey+" in ("+lstID+")");
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }

};

StaffGroupSetting.inactiveByID = async function(objData, result) {   
    
    try {
        
        const datesWrappedInQuotes = objData.listId.map(date => `'${date}'`);
        const withCommasInBetween = datesWrappedInQuotes.join(',')
        // console.log( withCommasInBetween );
        // let lstID = objData.listId.join(",");
    
        // console.log(lstID);
        // console.log(objData);
    
        let lstID =objData.listId.join(",");
        
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "+ 
        " `deleted` = (deleted-1)*-1 "
        +" WHERE id in ("+lstID+") "
        );   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
   
    
};

StaffGroupSetting.checkStaffPageAuthen = async function(userid,pagename,result) {   

    try {
        let sqlStr = "SELECT * FROM "+tableName+" WHERE adminName='"+userid+"'";

        const amusers = await dbConn.raw(sqlStr);
        if (amusers[0]) {
            
            if (amusers[0].am_rank==4) 
            {
                return true;
            }
            else
            {
                if (pagename=="") 
                {
                    return false;
                }
                else
                {
                    const amgroup = amusers[0].am_group;
                    sqlStr ="SELECT * FROM am_group WHERE id="+amgroup;
                    const am_group = await dbConn.raw(sqlStr);

                    if (am_group[0]['permission']) {
                        let permission = am_group[0]['permission'];
                        sqlStr ="SELECT * FROM page_admin WHERE id in ("+am_group[0]['permission']+") AND page_name='"+pagename+"'";
                        const checkPermission = await dbConn.raw(sqlStr);                    
                        if (checkPermission.length>0) {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }    
    
    return false;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

StaffGroupSetting.getPermissionByAmGroup = async function(amgroup,result)
{
    try {
        let sqlStr ="SELECT * FROM am_group WHERE id="+amgroup;        
        const am_group = await dbConn.raw(sqlStr);
        return am_group[0];
    } catch (error) {   
        console.log(error);           
        return [];
    }
    
}

StaffGroupSetting.getCustomPermissionByAmGroupId = async function(amgroup_id,page_admin_id,result)
{
    try {
        let sqlStr ="SELECT * FROM am_group_page_permission WHERE am_group_id="+amgroup_id+" AND page_admin_id="+page_admin_id;  
        
        const am_group = await dbConn.raw(sqlStr);
        return am_group[0][0];
    } catch (error) {   
        console.log(error);           
        return null;
    }
    
}




module.exports = StaffGroupSetting;