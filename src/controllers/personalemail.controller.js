'use strict';

const PersonalEmail = require('../models/personalemail.model');
const jwt = require('jsonwebtoken');
const Secret = require('../../config/secret');

// Get all personal emails
exports.getAllPersonalEmail = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
            // Additional token verification logic can be added here
        }

        const result = await PersonalEmail.findAll();

     
        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Personal emails retrieved successfully',
            debug: {
                total_count: result ? result.length : 0,
                has_data: result && result.length > 0
            }
        });
    } catch (error) {
        console.error('Error in getAllPersonalEmail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve personal emails',
            error: error.message
        });
    }
};

// Get personal email by ID
exports.getPersonalEmailById = async (req, res) => {
    try {
        console.log('=== getPersonalEmailById Debug ===');
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { id } = req.params;

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
            // Additional token verification logic can be added here
        }

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'ID parameter is required'
            });
        }

        const result = await PersonalEmail.findById(id);

        console.log('Searching for ID:', id);
        console.log('Query result:', result);
        console.log('Result length:', result ? result.length : 'null');

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with ID ${id} not found`,
                data: null,
                debug: {
                    searched_id: id,
                    result_count: result ? result.length : 0
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Personal email retrieved successfully',
            debug: {
                found_id: id,
                result_count: result.length
            }
        });
    } catch (error) {
        console.error('Error in getPersonalEmailById:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve personal email',
            error: error.message
        });
    }
};

// Get personal email by email
exports.getPersonalEmailByEmail = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { email } = req.params;

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
            // Additional token verification logic can be added here
        }

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email parameter is required'
            });
        }

        const result = await PersonalEmail.findByEmail(email);

        console.log('Searching for Email:', email);
        console.log('Query result:', result);
        console.log('Result length:', result ? result.length : 'null');

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with email "${email}" not found`,
                data: null,
                debug: {
                    searched_email: email,
                    result_count: result ? result.length : 0
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Personal email retrieved successfully',
            debug: {
                found_email: email,
                result_count: result.length
            }
        });
    } catch (error) {
        console.error('Error in getPersonalEmailByEmail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve personal email',
            error: error.message
        });
    }
};

// Get personal email by user ID
exports.getPersonalEmailByUserId = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { userId } = req.params;

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
            // Additional token verification logic can be added here
        }

        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID parameter is required'
            });
        }

        const result = await PersonalEmail.findByUserId(userId);

        if (result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Personal email not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Personal email retrieved successfully'
        });
    } catch (error) {
        console.error('Error in getPersonalEmailByUserId:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve personal email',
            error: error.message
        });
    }
};

// Get personal email by order ID
exports.getPersonalEmailByOrderId = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { orderId } = req.params;

        console.log('=== getPersonalEmailByOrderId Debug ===');
        console.log('Order ID:', orderId);

        // Verify token if provided
        if (req.headers.token) {
            const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET || 'your-secret-key');
        }

        if (!orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Order ID parameter is required'
            });
        }

        const result = await PersonalEmail.findByOrderId(orderId);

        console.log('Query result:', result);
        console.log('Result length:', result ? result.length : 'null');

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with Order ID ${orderId} not found`,
                data: null,
                debug: {
                    searched_order_id: orderId,
                    result_count: result ? result.length : 0
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Personal email retrieved successfully',
            debug: {
                found_order_id: orderId,
                result_count: result.length
            }
        });
    } catch (error) {
        console.error('Error in getPersonalEmailByOrderId:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve personal email',
            error: error.message
        });
    }
};

// Update personal email status by personal email ID
exports.updatePersonalEmailStatus = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { id } = req.params;
        const { status } = req.body;

        console.log('=== updatePersonalEmailStatus Debug ===');
        console.log('ID from params:', id);
        console.log('Status from body:', status);
        console.log('Body:', req.body);

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
        }

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'ID parameter is required'
            });
        }

        if (status === undefined || status === null) {
            return res.status(400).json({
                status: 'error',
                message: 'Status is required in request body'
            });
        }

        const result = await PersonalEmail.updateStatus(id, status);

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Personal email not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { affectedRows: result },
            message: 'Personal email status updated successfully'
        });
    } catch (error) {
        console.error('Error in updatePersonalEmailStatus:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update personal email status',
            error: error.message
        });
    }
};

exports.updatePersonalData = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { id } = req.params;
        const { email,password,updated_at } = req.body;

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
        }

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'ID parameter is required'
            });
        }

        const result = await PersonalEmail.updatePersonalData(id, email,password,updated_at);

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Personal email not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { affectedRows: result },
            message: 'Personal email status updated successfully'
        });
    } catch (error) {
        console.error('Error in updatePersonalEmailStatus:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update personal email status',
            error: error.message
        });
    }
};

// Get personal email status by order ID
exports.getPersonalEmailStatusByOrderId = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { orderId } = req.params;

        
        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
        }

        if (!orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Order ID parameter is required'
            });
        }

        const result = await PersonalEmail.findByOrderId(orderId);

        

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with Order ID ${orderId} not found`,
                data: null,
                debug: {
                    searched_order_id: orderId,
                    result_count: result ? result.length : 0
                }
            });
        }

        // Return only status information
        const statusInfo = result.map(item => ({
            status_regis: item.status_regis,
        }));

        res.status(200).json({
            status: 'success',
            data: statusInfo,
            message: 'Personal email status retrieved successfully',
            debug: {
                found_order_id: orderId,
                result_count: result.length
            }
        });
    } catch (error) {
        console.error('Error in getPersonalEmailStatusByOrderId:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve personal email status',
            error: error.message
        });
    }
};

// Update personal email status by order ID (all data from body)
exports.updatePersonalEmailStatusByOrderId = async (req, res) => {
    try {
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { orderId, status } = req.body;

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
        }

        if (!orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Order ID is required in request body'
            });
        }

        if (status === undefined || status === null) {
            return res.status(400).json({
                status: 'error',
                message: 'Status is required in request body'
            });
        }

        const result = await PersonalEmail.updateStatusByOrderId(orderId, status);

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Personal email not found for this order'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { affectedRows: result },
            message: 'Personal email status updated successfully'
        });
    } catch (error) {
        console.error('Error in updatePersonalEmailStatusByOrderId:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update personal email status',
            error: error.message
        });
    }
};

// Create new personal email
exports.createPersonalEmail = async (req, res) => {
    try {
        
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { user_id, order_id, email, status_regis } = req.body;

        

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
        }

        // Validate required fields
        if (!user_id || !order_id || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'user_id, order_id, and email are required'
            });
        }

        // Prepare data for insertion
        const personalEmailData = {
            user_id: user_id, // ใช้ LINE user ID จริง (ตอนนี้เป็น VARCHAR แล้ว)
            order_id: order_id,
            email: email,
            password: null, // ไม่ใช้ password สำหรับ personal_email
            status_regis: status_regis || 0,
            start_date: null,
            end_date: null
        };

        console.log('Inserting personal email data:', { ...personalEmailData, password: '***' });

        // Create new personal email
        const insertId = await PersonalEmail.create(personalEmailData);

        console.log('Personal email created with ID:', insertId);

        res.status(201).json({
            status: 'success',
            data: { 
                id: insertId,
                user_id: user_id,
                order_id: order_id,
                email: email,
                status_regis: status_regis || 0
            },
            message: 'Personal email created successfully'
        });
    } catch (error) {
        console.error('Error in createPersonalEmail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create personal email',
            error: error.message
        });
    }
};

// delete new personal email
exports.deletePersonalEmail = async (req, res) => {
    try {
        
        const userData = JSON.parse(req.headers.userdata || '{}');
        

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
        }
                     

        // Create new personal email
        const insertId = await PersonalEmail.delete(req.body);

        res.status(201).json({
            status: 'success',            
            message: 'Personal email deleted successfully'
        });
    } catch (error) {
        console.error('Error in deletePersonalEmail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete personal email',
            error: error.message
        });
    }
};

