const express = require('express')
const router = express.Router()
const announcementListController = require('../controllers/announcementlist.controller');
let cors = require('cors')

router.use(cors());

router.post('/getannouncement/', announcementListController.getannouncement);

router.post('/getannouncementactive/', announcementListController.getannouncementactive);

router.get('/getannouncementbyid/:Id', announcementListController.getannouncementById);

router.post('/updateannouncementbyid/', announcementListController.updateannouncementById);

router.post('/deleteannouncementbyid/', announcementListController.deleteannouncementById);

router.post('/create/', announcementListController.create);

module.exports = router