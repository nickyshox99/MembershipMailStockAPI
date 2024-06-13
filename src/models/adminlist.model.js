'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const StaffGroupSetting = require('./staffgroupsetting.model');

const jwt = require('jsonwebtoken');
const tableName = 'admins'
const tableKey = 'adminName'

//User object create
var AdminList = function(userlist) {
    this.adminName = userlist.adminName;
    this.hash = userlist.hash;
    this.salt = userlist.salt;
    this.fullName = userlist.fullName;
    this.status = userlist.status;
    this.createdAt = userlist.createdAt;
    this.createdBy = userlist.createdBy;
    this.updatedAt = userlist.updatedAt;    
    this.updatedBy = userlist.updatedBy;  
    this.am_rank = userlist.am_rank;  
};

AdminList.create = async function(newUser, result) {    
    try {
        const datas = await dbConn.raw("INSERT INTO " + tableName + " (adminName,hash,salt,fullName,status,createdAt,createdBy,updatedAt,updatedBy,am_rank)VALUES(?,?,?,?,?,?,?,?,?,?) "
        , [newUser.adminName, newUser.hash, newUser.salt,newUser.fullName,newUser.status,newUser.createdAt,newUser.createdBy,newUser.updatedAt,newUser.updatedBy,newUser.am_rank]);    
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

AdminList.findById = async function(id, result) {   
    try {        
        const datas = await dbConn.raw("Select * from " + tableName + " where " + tableKey + " = ?", [id]);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return [];
    }
    
};

AdminList.findByIdWithGroup = async function(id, result) {   
    try {        
        let sqlStr = "Select "+tableName+".*,am_group.permission,am_group.default_page,am_group.name from " + tableName;
        sqlStr += " LEFT JOIN am_group ON am_group.id="+ tableName+ ".am_group ";
        sqlStr += " WHERE "+ tableName+ "."+tableKey+"='"+id+"'";
        const datas = await dbConn.raw(sqlStr);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return null;
    }
    
};

AdminList.getPageAdminByName = async function(page_name, result) {   
    try {        
        let sqlStr = "Select * from page_admin ";        
        sqlStr += " WHERE page_name='"+page_name+"'";
        const datas = await dbConn.raw(sqlStr);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return [];
    }
    
};

AdminList.getCustomPagePermission = async function(page_admin_id,am_group_id, result) {   
    try {        
        let sqlStr = "Select * from am_group_page_permission ";        
        sqlStr += " WHERE page_admin_id="+page_admin_id+" AND am_group_id="+am_group_id;
        const datas = await dbConn.raw(sqlStr);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return [];
    }
    
};

AdminList.isAuthenicated = async function(userid, authToken, result) {

    // console.log("userid :", userid);
    // console.log("authToken :", authToken);

    try {
        let jwtToken = jwt.verify(authToken, Secret.SecretKey);
        // console.log("Decode userid :", jwtToken.userid);        
        if (jwtToken.userid == userid) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

AdminList.addAllowIPAdddress = async function(ipAddress)
{
    // console.log(ipAddress);
    try {
        const datas = await dbConn.raw("INSERT INTO ip_allowed (ip_address)VALUES(?) ", [ipAddress]);    
        return true;    
    } catch (error) {
        console.log(error);
        return false;
    }
    
}

AdminList.getAllAdminActive = async function(id, result) {   
    try {        
        const datas = await dbConn.raw("Select * from " + tableName + " where  status = 1");    
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
    
};

AdminList.getCustomPagePermission2 = async function(admin_id,page_name) 
{
    let pagePermission = [];
    pagePermission['canView'] = 0;
    pagePermission['canEdit'] = 0;
    pagePermission['canDelete'] = 0;
    pagePermission['canAdd'] = 0;
    pagePermission['canApprove'] = 0;                            
    pagePermission['canViewAll'] = 0;

    if (admin_id=="" ) 
    {
        return pagePermission;                       
    }

    if (page_name=="" ) 
    {
        return pagePermission;                     
    }

    let adminData = await this.findByIdWithGroup(admin_id);
    
    if (adminData==null) 
    {        
        return pagePermission;
    }

    let tmpData=[];
    let havePermissionInPage = false;
    let foundPageId = 0;

    if (adminData.am_rank==4) 
    {
        pagePermission['canView'] = 1;
        pagePermission['canEdit'] = 1;
        pagePermission['canDelete'] = 1;
        pagePermission['canAdd'] = 1;
        pagePermission['canApprove'] = 1;                            
        pagePermission['canViewAll'] = 1;
     
        return pagePermission;
        
    }                                        
    else
    {
        
        let tmpPermission = adminData.permission;
        tmpPermission = tmpPermission.replaceAll('[',"");
        tmpPermission = tmpPermission.replaceAll(']',"");
        tmpPermission = tmpPermission.replaceAll('"',"'");
        let tmpPageAuthen = await StaffGroupSetting.getPageByAmPermission(tmpPermission);
        //console.log(tmpPageAuthen);
        for (let index = 0; index < tmpPageAuthen.length; index++) {
            const element = tmpPageAuthen[index];                                    
            if (element.page_name==page_name) {                                
                havePermissionInPage = true;
                foundPageId = element.id;                                
                break;
            }
        }

                
        if (!havePermissionInPage) 
        {           
            return pagePermission;
        }
        
        //check customer permission        
        let customPagePermission = await StaffGroupSetting.getCustomPermissionByAmGroupId(adminData.am_group,foundPageId);                        
        if (customPagePermission!=null) 
        {                            
            pagePermission['canView']    = customPagePermission.can_view1;   
            pagePermission['canEdit']    = customPagePermission.can_edit1;   
            pagePermission['canDelete']  = customPagePermission.can_delete1;   
            pagePermission['canAdd']     = customPagePermission.can_add1;   
            pagePermission['canApprove'] = customPagePermission.can_approve1;                               
            pagePermission['canViewAll'] = customPagePermission.can_viewall1;
        }
        else
        {
            pagePermission['canView'] = 1;
            pagePermission['canEdit'] = 1;
            pagePermission['canDelete'] = 1;
            pagePermission['canAdd'] = 1;
            pagePermission['canApprove'] = 1;                            
            pagePermission['canViewAll'] = 1;
            
        }

        return pagePermission;
    }
}

module.exports = AdminList;