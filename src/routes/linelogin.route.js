const express = require('express')
const router = express.Router()
let cors = require('cors')

const lineLogin = require("../controllers/linelogin.controller.js");

router.use(cors());

router.get('/', lineLogin.default);

router.post('/authorizeuser/', lineLogin.login);

router.get('/LoginLineCallback/', lineLogin.callback);

router.post('/getAccessToken/', lineLogin.getAccessToken);

router.post('/loginByLineId/', lineLogin.loginByLineId);

router.post('/registerByLineId/', lineLogin.registerByLineId);

router.post('/updateLineIdWithAccount/', lineLogin.updateLineIdWithAccount);

module.exports = router