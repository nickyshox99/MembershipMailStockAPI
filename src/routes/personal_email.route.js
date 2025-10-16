const express = require('express')
const router = express.Router()
const personalEmailController = require('../controllers/personal_email.controller');

let cors = require('cors')

router.use(cors());


router.get('/getAllPersonalEmail/', personalEmailController.getAllPersonalEmail);
router.get('/getPersonalEmailById/:id', personalEmailController.getPersonalEmailById);
router.get('/getPersonalEmailByEmail/:email', personalEmailController.getPersonalEmailByEmail);
router.get('/getPersonalEmailByUserId/:userId', personalEmailController.getPersonalEmailByUserId);
router.get('/getPersonalEmailByOrderId/:orderId', personalEmailController.getPersonalEmailByOrderId);
router.get('/getPersonalEmailStatusByOrderId/:orderId', personalEmailController.getPersonalEmailStatusByOrderId);

// PUT endpoints
router.put('/updatePersonalEmailStatus/:id', personalEmailController.updatePersonalEmailStatus);
router.put('/updatePersonalEmailStatusByOrderId', personalEmailController.updatePersonalEmailStatusByOrderId);

// POST endpoints (alternative for updates)
router.post('/updatePersonalEmailStatus/:id', personalEmailController.updatePersonalEmailStatus);
router.post('/updatePersonalEmailStatusByOrderId', personalEmailController.updatePersonalEmailStatusByOrderId);



module.exports = router
