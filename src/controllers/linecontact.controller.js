'use strict';
const jwt = require('jsonwebtoken');
const LineContact = require('../models/linecontact.model');
const Secret = require('../../config/secret');

// Middleware to verify Bearer token
const verifyBearerToken = (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, error: 'No Bearer token provided' };
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
        const decoded = jwt.verify(token, Secret.SecretKey);
        return { valid: true, decoded: decoded };
    } catch (error) {
        return { valid: false, error: 'Invalid or expired token' };
    }
};

exports.default = async function(req, res) {
    res.send('line contact api');
};

exports.getLineContact = async function(req, res) {
    try {
        console.log('get line contact..');
        
        // Verify Bearer token
        const authResult = verifyBearerToken(req);
        if (!authResult.valid) {
            return res.status(401).json({ 
                status: 'error', 
                message: authResult.error,
                data: [],
            });
        }
        
        const searchword = req.body.searchword || "";
        const page = req.body.page || 1;
        const perPage = req.body.perPage || 20;
        
        const total = await LineContact.countAll(searchword);
        const contacts = await LineContact.findAll(searchword, page, perPage);
        
        const totalPages = Math.ceil(total / perPage);
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Get line contact successfully',
            data: contacts,
            pagination: {
                page: parseInt(page),
                perPage: parseInt(perPage),
                total: total,
                totalPages: totalPages
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message,
            data: [],
        });
    }
};

exports.getLineContactById = async function(req, res) {
    try {
        console.log('get line contact by id..');
        
        // Verify Bearer token
        const authResult = verifyBearerToken(req);
        if (!authResult.valid) {
            return res.status(401).json({ 
                status: 'error', 
                message: authResult.error,
                data: null,
            });
        }
        
        const id = req.params.Id;
        const contact = await LineContact.findById(id);
        
        if (contact) {
            res.status(200).json({ 
                status: 'success', 
                message: 'Get line contact by id successfully',
                data: contact,
            });
        } else {
            res.status(404).json({ 
                status: 'error', 
                message: 'Line contact not found',
                data: null,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message,
            data: null,
        });
    }
};

exports.getLineContactByUserId = async function(req, res) {
    try {
        console.log('get line contact by user id..');
        
        // Verify Bearer token
        const authResult = verifyBearerToken(req);
        if (!authResult.valid) {
            return res.status(401).json({ 
                status: 'error', 
                message: authResult.error,
                data: [],
            });
        }
        
        const lineUserId = req.params.userId;
        const contacts = await LineContact.findByUserId(lineUserId);
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Get line contact by user id successfully',
            data: contacts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message,
            data: [],
        });
    }
};

module.exports = exports;
