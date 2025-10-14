const express = require('express')
const router = express.Router()
const btnStatusController = require('../controllers/btnstatus.controller');
let cors = require('cors')

router.use(cors());

router.get('/GetBtnStatus', btnStatusController.GetBtnStatus);



module.exports = router