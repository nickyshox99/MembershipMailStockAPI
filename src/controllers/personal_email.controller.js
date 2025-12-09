'use strict';

const Personal_Email = require('../models/personal_email.model');
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

        const result = await Personal_Email.findAll();

     
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

        const result = await Personal_Email.findById(id);

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
        console.log('=== getPersonalEmailByEmail Debug ===');
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

        const result = await Personal_Email.findByEmail(email);

        console.log('Searching for email:', email);
        console.log('Query result:', result);
        console.log('Result length:', result ? result.length : 'null');

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with email ${email} not found`,
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
        console.log('=== getPersonalEmailByUserId Debug ===');
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

        const result = await Personal_Email.findByUserId(userId);

        console.log('Searching for userId:', userId);
        console.log('Query result:', result);
        console.log('Result length:', result ? result.length : 'null');

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with user ID ${userId} not found`,
                data: null,
                debug: {
                    searched_userId: userId,
                    result_count: result ? result.length : 0
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Personal email retrieved successfully',
            debug: {
                found_userId: userId,
                result_count: result.length
            }
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
        console.log('=== getPersonalEmailByOrderId Debug ===');
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { orderId } = req.params;

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
            // Additional token verification logic can be added here
        }

        if (!orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Order ID parameter is required'
            });
        }

        const result = await Personal_Email.findByOrderId(orderId);

        console.log('Searching for orderId:', orderId);
        console.log('Query result:', result);
        console.log('Result length:', result ? result.length : 'null');

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with order ID ${orderId} not found`,
                data: null,
                debug: {
                    searched_orderId: orderId,
                    result_count: result ? result.length : 0
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Personal email retrieved successfully',
            debug: {
                found_orderId: orderId,
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

// Get personal email status by order ID
exports.getPersonalEmailStatusByOrderId = async (req, res) => {
    console.log("getPersonalEmailStatusByOrderId")
    try {
        
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { id } = req.params;
        const orderId =id

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
            // Additional token verification logic can be added here
        }

        if (!orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Order ID parameter is required'
            });
        }

        const result = await Personal_Email.findByOrderId(orderId);
        
        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with order ID ${orderId} not found`,
                data: null,
                debug: {
                    searched_orderId: orderId,
                    result_count: result ? result.length : 0
                }
            });
        }

        // Return only status information
        const statusData = result.map(item => ({
            id: item.id,
            order_id: item.order_id,
            status_regis: item.status_regis,
            email: item.email,
            user_id: item.user_id
        }));

        res.status(200).json({
            status: 'success',
            data: statusData,
            message: 'Personal email status retrieved successfully',
            debug: {
                found_orderId: orderId,
                result_count: statusData.length
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

// Update personal email status
exports.updatePersonalEmailStatus = async (req, res) => {
    try {
        console.log('=== updatePersonalEmailStatus Debug ===');
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { id } = req.params;
        const { status } = req.body;

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

        if (status === undefined || status === null) {
            return res.status(400).json({
                status: 'error',
                message: 'Status parameter is required'
            });
        }

        console.log('Updating ID:', id, 'Status:', status);

        const result = await Personal_Email.updateStatus(id, status);

        console.log('Update result:', result);

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with ID ${id} not found or no changes made`,
                debug: {
                    updated_id: id,
                    new_status: status,
                    affected_rows: result
                }
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Personal email status updated successfully',
            debug: {
                updated_id: id,
                new_status: status,
                affected_rows: result
            }
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

// Update personal email status by order ID
exports.updatePersonalEmailStatusByOrderId = async (req, res) => {
    try {
        console.log('=== updatePersonalEmailStatusByOrderId Debug ===');
        const userData = JSON.parse(req.headers.userdata || '{}');
        const { orderId, status } = req.body;

        // Verify token if provided
        let token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, Secret.SecretKey);
            // Additional token verification logic can be added here
        }

        if (!orderId) {
            return res.status(400).json({
                status: 'error',
                message: 'Order ID parameter is required'
            });
        }

        if (status === undefined || status === null) {
            return res.status(400).json({
                status: 'error',
                message: 'Status parameter is required'
            });
        }

        console.log('Updating Order ID:', orderId, 'Status:', status);

        const result = await Personal_Email.updateStatusByOrderId(orderId, status);

        console.log('Update result:', result);

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Personal email with Order ID ${orderId} not found or no changes made`,
                debug: {
                    updated_orderId: orderId,
                    new_status: status,
                    affected_rows: result
                }
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Personal email status updated successfully',
            debug: {
                updated_orderId: orderId,
                new_status: status,
                affected_rows: result
            }
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
