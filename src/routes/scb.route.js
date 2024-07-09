const express = require('express')
const router = express.Router()
let cors = require('cors')

const ScbModel = require("../controllers/scb.controller.js");

router.use(cors());

router.get('/refresh_token/:key', ScbModel.refreshtoken);

router.get('/autoapp/:key', ScbModel.autoapp);

router.post('/getTransactionByBankID/', ScbModel.getTransactionByBankID);

router.get('/testLogin/', ScbModel.testLogin);

router.get('/testProfile/', ScbModel.testProfile);

router.get('/testTransaction/', ScbModel.testTransaction);



module.exports = router