const express = require('express')
const router = express.Router()
const lineCallBackController = require('../controllers/linecallback.controller');
let cors = require('cors')

router.use(cors());

router.post('/linecallback/', lineCallBackController.linecallback);


module.exports = router