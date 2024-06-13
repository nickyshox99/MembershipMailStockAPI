const express = require('express')
const router = express.Router()
const staffListController = require('../controllers/stafflist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getstaff/', staffListController.getStaff);

router.get('/getstaffbyid/:Id', staffListController.getStaffById);

router.post('/updatestaffbyid/', staffListController.updateStaffById);

router.post('/deletestaffbyid/', staffListController.deleteStaffById);

router.post('/create/', staffListController.create);

module.exports = router