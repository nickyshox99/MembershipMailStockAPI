'use strict';

const UsersEmail = require('../models/usersemail.model');
const IpAllowList = require('../models/ipallowlist.model');

/**
 * Insert user email data
 * POST /api/usersemail/insert
 */
exports.insertUserEmail = async function (req, res) {
    console.log('insertUserEmail');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }

        // Get data from request body
        const user_id = req.body.user_id || '';
        const order_id = req.body.order_id || 0;
        const email = req.body.email || '';
        const password = req.body.password || '';
        const status_regis = req.body.status_regis || 0;
        const start_date = req.body.start_date || null;
        const end_date = req.body.end_date || null;
        // Validate required fields
        if (!user_id || !order_id || !email || !password) {
            res.status(202).json({
                status: 'error',
                message: 'Missing required fields: user_id, order_id, email, password',
                auth: false,
                data: [],
            });
            return;
        }

        // Check if order_id already exists (เช็คแค่ order_id เพราะ user คนเดียวสามารถซื้อหลาย order ได้)
        // const existingByOrderId = await UsersEmail.findByOrderId(order_id);
        // if (existingByOrderId && existingByOrderId.id) {
        //     res.status(202).json({
        //         status: 'error',
        //         message: 'Order ID already exists',
        //         auth: false,
        //         data: [],
        //     });
        //     return;
        // }

        // Prepare data for insertion
        const objData = {
            user_id,
            order_id,
            email,
            password,
            status_regis,
            start_date,
            end_date,
        };

        console.log('Inserting user email with data:', { ...objData, password: '***' });

        // Insert data
        const result = await UsersEmail.insertUserEmail(objData);

        console.log('Insert result:', result ? 'success' : 'failed');

        if (result) {
            res.status(200).json({
                status: 'success',
                message: 'User email inserted successfully',
                auth: true,
                data: result,
            });
        } else {
            console.error('Insert failed: result is false/null');
            res.status(202).json({
                status: 'error',
                message: 'Failed to insert user email',
                auth: false,
                data: [],
            });
        }

    } catch (error) {
        console.log('insertUserEmail error:', error);
        res.status(202).json({
            status: 'error',
            message: 'insertUserEmail: ' + error.message,
            auth: false,
            data: [],
        });
    }
};

/**
 * Get user email by user_id
 * GET /api/usersemail/getbyuserid
 */
exports.getUserEmailByUserId = async function (req, res) {
    console.log('getUserEmailByUserId');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }

        const user_id = req.query.user_id || req.body.user_id || '';

        if (!user_id) {
            res.status(202).json({
                status: 'error',
                message: 'Missing user_id parameter',
                auth: false,
                data: [],
            });
            return;
        }

        const result = await UsersEmail.findByUserId(user_id);

        res.status(200).json({
            status: 'success',
            message: '',
            auth: true,
            data: result,
        });

    } catch (error) {
        console.log('getUserEmailByUserId error:', error);
        res.status(202).json({
            status: 'error',
            message: 'getUserEmailByUserId: ' + error.message,
            auth: false,
            data: [],
        });
    }
};

/**
 * Get user email by order_id
 * GET /api/usersemail/getbyorderid
 */
exports.getUserEmailByOrderId = async function (req, res) {
    console.log('getUserEmailByOrderId');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }

        const order_id = req.query.order_id || req.body.order_id || 0;

        if (!order_id) {
            res.status(202).json({
                status: 'error',
                message: 'Missing order_id parameter',
                auth: false,
                data: [],
            });
            return;
        }

        const result = await UsersEmail.findByOrderId(order_id);

        res.status(200).json({
            status: 'success',
            message: '',
            auth: true,
            data: result,
        });

    } catch (error) {
        console.log('getUserEmailByOrderId error:', error);
        res.status(202).json({
            status: 'error',
            message: 'getUserEmailByOrderId: ' + error.message,
            auth: false,
            data: [],
        });
    }
};

/**
 * Update status_regis
 * POST /api/usersemail/updatestatus
 */
exports.updateStatusRegis = async function (req, res) {
    console.log('updateStatusRegis');

    try {
        const ipAddress = await IpAllowList.getIPv4Address(req);
        const ipBlockList = await IpAllowList.findBlockedById(ipAddress);

        if (ipBlockList.length > 0) {
            res.status(202).send('Unauthorize ip. (' + ipAddress + ')');
            return;
        }

        // Get data from request body
        const id = req.body.id || 0;
        const order_id = req.body.order_id || 0;
        const status_regis = req.body.status_regis;

        console.log('=== Update Status Regis ===');
        console.log('id:', id);
        console.log('order_id:', order_id);
        console.log('status_regis:', status_regis);

        // Validate: must have either id or order_id
        if (!id && !order_id) {
            res.status(202).json({
                status: 'error',
                message: 'Missing required field: id or order_id',
                auth: false,
                data: [],
            });
            return;
        }

        // Validate: status_regis must be defined
        if (status_regis === undefined || status_regis === null) {
            res.status(202).json({
                status: 'error',
                message: 'Missing required field: status_regis',
                auth: false,
                data: [],
            });
            return;
        }

        let result = false;

        // Update by order_id (preferred)
        if (order_id) {
            console.log('Updating by order_id:', order_id);
            result = await UsersEmail.updateStatusRegisByOrderId(order_id, status_regis);
        } 
        // Update by id
        else if (id) {
            console.log('Updating by id:', id);
            result = await UsersEmail.updateStatusRegisById(id, status_regis);
        }

        if (result) {
            res.status(200).json({
                status: 'success',
                message: 'Status updated successfully',
                auth: true,
                data: [],
            });
        } else {
            res.status(202).json({
                status: 'error',
                message: 'Failed to update status',
                auth: false,
                data: [],
            });
        }

    } catch (error) {
        console.log('updateStatusRegis error:', error);
        res.status(202).json({
            status: 'error',
            message: 'updateStatusRegis: ' + error.message,
            auth: false,
            data: [],
        });
    }
};

module.exports = exports;

