'use strict';

var dbConn = require('../../config/db.config');
const timerHelper = require('../modules/timehelper');

const tableName = 'users_email'
const tableKey = 'id'

// UsersEmail object create
var UsersEmail = async function (usersEmail) {

};

/**
 * Insert new user email record
 * @param {Object} objData - Data object containing user_id, order_id, email, password
 * @returns {Promise<Object|Boolean>} - Returns inserted data with id or false on error
 */
UsersEmail.insertUserEmail = async function (objData, result) {
    try {
        const datas = await dbConn.raw(
            "INSERT INTO users_email (" +
            "user_id, " +
            "order_id, " +
            "email, " +
            "password, " +
            "status_regis, " +
            "start_date, " +
            "end_date " +
            ") VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                objData.user_id,
                objData.order_id,
                objData.email,
                objData.password,
                objData.status_regis || 0,
                objData.start_date || null,
                objData.end_date || null
            ]
        );

        return {
            id: datas[0].insertId,
            ...objData
        };
    } catch (error) {
        console.error('insertUserEmail error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sql: error.sql
        });
        return false;
    }
};

/**
 * Find user email by user_id
 * @param {String} userId - User ID to search
 * @returns {Promise<Array>} - Returns array of matching records
 */
UsersEmail.findByUserId = async function (userId, result) {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE user_id = ? ";
        const datas = await dbConn.raw(sqlStr, [userId]);
        return datas[0];
    } catch (error) {
        console.log('findByUserId error:', error);
        return [];
    }
};

/**
 * Find user email by order_id
 * @param {Number} orderId - Order ID to search
 * @returns {Promise<Object>} - Returns matching record or empty object
 */
UsersEmail.findByOrderId = async function (orderId, result) {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE order_id = ? LIMIT 1";
        const datas = await dbConn.raw(sqlStr, [orderId]);
        return datas[0][0] ? datas[0][0] : {};
    } catch (error) {
        console.log('findByOrderId error:', error);
        return {};
    }
};

/**
 * Find user email by email
 * @param {String} email - Email to search
 * @returns {Promise<Object>} - Returns matching record or empty object
 */
UsersEmail.findByEmail = async function (email, result) {
    try {
        let sqlStr = "SELECT * FROM " + tableName + " WHERE email = ? LIMIT 1";
        const datas = await dbConn.raw(sqlStr, [email]);
        return datas[0][0] ? datas[0][0] : {};
    } catch (error) {
        console.log('findByEmail error:', error);
        return {};
    }
};

/**
 * Update user email record
 * @param {Object} objData - Data object containing id and fields to update
 * @returns {Promise<Boolean>} - Returns true on success, false on error
 */
UsersEmail.updateUserEmail = async function (objData, result) {
    const rowid = objData.id;

    try {
        let updateFields = [];
        let updateValues = [];

        if (objData.password !== undefined) {
            updateFields.push("password=?");
            updateValues.push(objData.password);
        }
        if (objData.status_regis !== undefined) {
            updateFields.push("status_regis=?");
            updateValues.push(objData.status_regis);
        }
        if (objData.start_date !== undefined) {
            updateFields.push("start_date=?");
            updateValues.push(objData.start_date);
        }
        if (objData.end_date !== undefined) {
            updateFields.push("end_date=?");
            updateValues.push(objData.end_date);
        }

        if (updateFields.length === 0) {
            return false;
        }

        updateValues.push(rowid);

        const datas = await dbConn.raw(
            "UPDATE users_email SET " + updateFields.join(", ") + " WHERE id = ?",
            updateValues
        );

        return true;
    } catch (error) {
        console.log('updateUserEmail error:', error);
        return false;
    }
};

UsersEmail.updateUserEmailByOrderId = async function (order_id, email, password, updated_at) {
    try {
        let sqlStr = `UPDATE users_email SET email = ?, password = ?, updated_at = ? WHERE order_id = ?`;
        const datas = await dbConn.raw(sqlStr, [
            email,
            password,
            timerHelper.convertDatetimeToString(new Date(updated_at)),
            order_id
        ]);
        return datas[0].affectedRows;
    } catch (error) {
        console.log('updateUserEmailByOrderId error:', error);
        return 0;
    }
};

/**
 * Update status_regis by order_id
 * @param {Number} orderId - Order ID
 * @param {Number} statusRegis - New status_regis value (0 or 1)
 * @returns {Promise<Boolean>} - Returns true on success, false on error
 */
UsersEmail.updateStatusRegisByOrderId = async function (orderId, statusRegis) {
    try {
        const datas = await dbConn.raw(
            "UPDATE users_email SET status_regis = ? WHERE order_id = ?",
            [statusRegis, orderId]
        );
        return true;
    } catch (error) {
        console.error('updateStatusRegisByOrderId error:', error);
        return false;
    }
};

/**
 * Update status_regis by id
 * @param {Number} id - Record ID
 * @param {Number} statusRegis - New status_regis value (0 or 1)
 * @returns {Promise<Boolean>} - Returns true on success, false on error
 */
UsersEmail.updateStatusRegisById = async function (id, statusRegis) {
    try {
        const datas = await dbConn.raw(
            "UPDATE users_email SET status_regis = ? WHERE id = ?",
            [statusRegis, id]
        );
        return true;
    } catch (error) {
        console.error('updateStatusRegisById error:', error);
        return false;
    }
};

/**
 * Delete user email record by id
 * @param {Number} id - Record ID to delete
 * @returns {Promise<Boolean>} - Returns true on success, false on error
 */
UsersEmail.deleteById = async function (id, result) {
    try {
        const datas = await dbConn.raw("DELETE FROM users_email WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.log('deleteById error:', error);
        return false;
    }
};

module.exports = UsersEmail;

