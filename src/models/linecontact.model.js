'use strict';

var dbConn = require('../../config/db.config');

const tableName = 'line_contact';

var LineContact = function() {
};

LineContact.findAll = async function(searchword, page, perPage) {   
    searchword = searchword ? searchword : "";
    page = page ? parseInt(page) : 1;
    perPage = perPage ? parseInt(perPage) : 20;
    
    const offset = (page - 1) * perPage;
    
    let sqlStr = "SELECT * FROM " + tableName;        
    sqlStr += " WHERE 1=1 ";
    
    if (searchword) {
        sqlStr += " AND (display_name LIKE '%" + searchword + "%' ";
        sqlStr += " OR user_id LIKE '%" + searchword + "%' ";
        sqlStr += " OR alias_userid LIKE '%" + searchword + "%' ";
        sqlStr += " OR note LIKE '%" + searchword + "%' ";
        sqlStr += " OR tag LIKE '%" + searchword + "%') ";
    }
    
    sqlStr += " ORDER BY id DESC ";
    sqlStr += " LIMIT " + perPage + " OFFSET " + offset;
    
    let datas = await dbConn.raw(sqlStr);
    
    return datas[0];
};

LineContact.countAll = async function(searchword) {   
    searchword = searchword ? searchword : "";
    
    let sqlStr = "SELECT COUNT(*) as total FROM " + tableName;        
    sqlStr += " WHERE 1=1 ";
    
    if (searchword) {
        sqlStr += " AND (display_name LIKE '%" + searchword + "%' ";
        sqlStr += " OR user_id LIKE '%" + searchword + "%' ";
        sqlStr += " OR alias_userid LIKE '%" + searchword + "%' ";
        sqlStr += " OR note LIKE '%" + searchword + "%' ";
        sqlStr += " OR tag LIKE '%" + searchword + "%') ";
    }
    
    let datas = await dbConn.raw(sqlStr);
    
    return datas[0][0].total;
};

LineContact.findById = async function(id) {   
    let sqlStr = "SELECT * FROM " + tableName;    
    sqlStr += " WHERE id = ? ";
    
    const datas = await dbConn.raw(sqlStr, [id]);
    return datas[0][0] ? datas[0][0] : null;
};

LineContact.findByUserId = async function(userId) {   
    let sqlStr = "SELECT * FROM " + tableName;    
    sqlStr += " WHERE user_id = ? ";
    
    const datas = await dbConn.raw(sqlStr, [userId]);
    return datas[0];
};

module.exports = LineContact;
