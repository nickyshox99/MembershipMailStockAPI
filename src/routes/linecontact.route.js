const express = require('express')
const router = express.Router()
const lineContactController = require('../controllers/linecontact.controller');
let cors = require('cors')

router.use(cors());

router.post('/getlinecontact/', lineContactController.getLineContact);

router.get('/getlinecontactbyid/:Id', lineContactController.getLineContactById);

router.get('/getlinecontactbyuserid/:userId', lineContactController.getLineContactByUserId);

module.exports = router
