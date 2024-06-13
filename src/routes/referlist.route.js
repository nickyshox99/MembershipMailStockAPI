const express = require('express')
const router = express.Router()
const referlistController = require('../controllers/referlist.controller');
let cors = require('cors')

router.use(cors());

router.post('/create/', referlistController.create);

router.post('/getrefer/', referlistController.getrefer);

router.post('/getreferbyid/', referlistController.getreferbyid);

router.post('/updatereferbyid/', referlistController.updatereferbyid);

router.post('/inactivereferbyid/', referlistController.inactivereferbyid);

router.post('/deletereferbyid/', referlistController.deletereferbyid);

module.exports = router