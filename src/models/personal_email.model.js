'use strict';

var dbConn = require('../../config/db.config');
const tableName = 'personal_email';
const tableKey = 'id';

// PersonalEmail object create
var PersonalEmail = function(personalEmail) {
    this.user_id = personalEmail.user_id;
    this.order_id = personalEmail.order_id;
    this.email = personalEmail.email;
    this.password = personalEmail.password;
    this.status_regis = personalEmail.status_regis;
    this.start_date = personalEmail.start_date;
    this.end_date = personalEmail.end_date;
    this.created_at = personalEmail.created_at;
    this.updated_at = personalEmail.updated_at;
};

// Find all personal emails
PersonalEmail.findAll = async function() {
    try {
        let sqlStr = `SELECT 
            ue.*,
            lc.display_name as line_display_name,
            lc.picture_url as line_profile_url
            FROM ${tableName} ue
            LEFT JOIN line_contact lc ON lc.user_id COLLATE utf8mb4_unicode_ci = ue.user_id COLLATE utf8mb4_unicode_ci
            ORDER BY ue.id DESC`;
        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.findAll:', error);
        throw error;
    }
};

// Find personal email by ID
PersonalEmail.findById = async function(id) {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE id = ?";
        const datas = await dbConn.raw(sqlStr, [id]);
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.findById:', error);
        throw error;
    }
};

// Find personal email by email
PersonalEmail.findByEmail = async function(email) {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE email = ?";
        const datas = await dbConn.raw(sqlStr, [email]);
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.findByEmail:', error);
        throw error;
    }
};

// Find personal email by user ID
PersonalEmail.findByUserId = async function(userId) {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE user_id = ? ORDER BY id DESC";
        const datas = await dbConn.raw(sqlStr, [userId]);
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.findByUserId:', error);
        throw error;
    }
};

// Create new personal email
PersonalEmail.create = async function(newPersonalEmail) {
    try {
        let sqlStr = `INSERT INTO ${tableName} 
                     (user_id, order_id, email, password, status_regis, start_date, end_date, created_at, updated_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        
        const result = await dbConn.raw(sqlStr, [
            newPersonalEmail.user_id,
            newPersonalEmail.order_id,
            newPersonalEmail.email,
            newPersonalEmail.password,
            newPersonalEmail.status_regis || 0,
            newPersonalEmail.start_date,
            newPersonalEmail.end_date
        ]);
        
        return result[0].insertId;
    } catch (error) {
        console.error('Error in PersonalEmail.create:', error);
        throw error;
    }
};

// Update personal email
PersonalEmail.update = async function(id, personalEmail) {
    try {
        let sqlStr = `UPDATE ${tableName} SET 
                     user_id = ?, order_id = ?, email = ?, password = ?, 
                     status_regis = ?, start_date = ?, end_date = ?, updated_at = NOW()
                     WHERE id = ?`;
        
        const result = await dbConn.raw(sqlStr, [
            personalEmail.user_id,
            personalEmail.order_id,
            personalEmail.email,
            personalEmail.password,
            personalEmail.status_regis,
            personalEmail.start_date,
            personalEmail.end_date,
            id
        ]);
        
        return result[0].affectedRows;
    } catch (error) {
        console.error('Error in PersonalEmail.update:', error);
        throw error;
    }
};

// Delete personal email
PersonalEmail.delete = async function(id) {
    try {
        let sqlStr = "DELETE FROM " + tableName + " WHERE id = ?";
        const result = await dbConn.raw(sqlStr, [id]);
        return result[0].affectedRows;
    } catch (error) {
        console.error('Error in PersonalEmail.delete:', error);
        throw error;
    }
};

// Find personal emails by order ID
PersonalEmail.findByOrderId = async function(orderId) {
    try {
        let sqlStr = `SELECT 
            ue.*,
            lc.display_name as line_display_name,
            lc.picture_url as line_profile_url
            FROM users_email ue
            LEFT JOIN line_contact lc ON lc.user_id COLLATE utf8mb4_unicode_ci = ue.user_id COLLATE utf8mb4_unicode_ci
            WHERE ue.order_id = ${orderId} 
            ORDER BY ue.id DESC`;
        
        const datas = await dbConn.raw(sqlStr);
        
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.findByOrderId:', error);
        throw error;
    }
};

// Find active personal emails
PersonalEmail.findActiveEmails = async function() {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE status_regis = 1 ORDER BY id DESC";
        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.findActiveEmails:', error);
        throw error;
    }
};

// Find inactive personal emails
PersonalEmail.findInactiveEmails = async function() {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE status_regis = 0 ORDER BY id DESC";
        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.findInactiveEmails:', error);
        throw error;
    }
};

// Search personal emails with multiple criteria
PersonalEmail.search = async function(searchParams) {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE 1=1";
        let params = [];
        
        if (searchParams.email) {
            sqlStr += " AND email LIKE ?";
            params.push(`%${searchParams.email}%`);
        }
        
        if (searchParams.user_id) {
            sqlStr += " AND user_id = ?";
            params.push(searchParams.user_id);
        }
        
        if (searchParams.order_id) {
            sqlStr += " AND order_id = ?";
            params.push(searchParams.order_id);
        }
        
        if (searchParams.status_regis !== undefined) {
            sqlStr += " AND status_regis = ?";
            params.push(searchParams.status_regis);
        }
        
        sqlStr += " ORDER BY id DESC";
        
        const datas = await dbConn.raw(sqlStr, params);
        return datas[0];
    } catch (error) {
        console.error('Error in PersonalEmail.search:', error);
        throw error;
    }
};

// Update personal email status only
PersonalEmail.updateStatus = async function(id, status) {
    try {
        // Validate and convert parameters
        const validId = parseInt(id) || 0;
        const validStatus = parseInt(status) || 0;
        
        if (validId === 0) {
            throw new Error('Invalid ID provided');
        }
        
        if (validStatus < 0 || validStatus > 1) {
            throw new Error('Status must be 0 (inactive) or 1 (active)');
        }
        
        let sqlStr = `UPDATE ${tableName} SET status_regis = ${validStatus}, updated_at = NOW() WHERE id = ${validId}`;
        console.log('Update SQL:', sqlStr);
        
        const result = await dbConn.raw(sqlStr);
        return result[0].affectedRows;
    } catch (error) {
        console.error('Error in PersonalEmail.updateStatus:', error);
        throw error;
    }
};

// Update personal email status by order ID
PersonalEmail.updateStatusByOrderId = async function(orderId, status) {
    try {
        
        // Validate status
        const validStatus = parseInt(status);
        if (isNaN(validStatus) || validStatus < 0 || validStatus > 1) {
            throw new Error('Status must be 0 (inactive) or 1 (active)');
        }
        
        // order_id is stored as string in database, so we keep it as string
        const validOrderId = String(orderId);
        
        if (!validOrderId || validOrderId === 'undefined' || validOrderId === 'null') {
            throw new Error('Invalid Order ID provided');
        }
        
        //สลับไปเรื่อย
        let sqlStr = `UPDATE personal_email SET status_regis = ${validStatus}, updated_at = NOW() WHERE order_id = ${validOrderId}`;
        
        const result = await dbConn.raw(sqlStr);        
        
        return result[0].affectedRows;
    } catch (error) {
        console.error('Error in PersonalEmail.updateStatusByOrderId:', error);
        throw error;
    }
};

module.exports = PersonalEmail;
