const express = require('express');
const router = express.Router();

const usersEmailController = require('../controllers/usersEmail.controller');

// Insert user email
router.post('/insert', usersEmailController.insertUserEmail);

// Get user email by user_id
router.get('/getbyuserid', usersEmailController.getUserEmailByUserId);
router.post('/getbyuserid', usersEmailController.getUserEmailByUserId);

// Get user email by order_id
router.get('/getbyorderid', usersEmailController.getUserEmailByOrderId);
router.post('/getbyorderid', usersEmailController.getUserEmailByOrderId);

// Update status_regis
router.post('/updatestatus', usersEmailController.updateStatusRegis);

module.exports = router;

