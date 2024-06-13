const express = require('express')
const router = express.Router()
const adminlistController = require('../controllers/adminlist.controller');
let cors = require('cors')

router.use(cors());

// show
router.get('/', adminlistController.default);

router.get('/initial/', adminlistController.initial);

router.post('/login/', adminlistController.login);

router.post('/refreshtoken/', adminlistController.refreshtoken);

router.post('/isAuthenicated/', adminlistController.isAuthenicated);

router.get('/allowipaddress/', adminlistController.allowipaddress);

// Login
router.post('/googleAuthen/', adminlistController.googleAuthen);

router.post('/getGoogleAuthen/', adminlistController.getGoogleAuthen);

router.post('/getTime/', adminlistController.getTime);

router.post('/changepassword/', adminlistController.changePassword);

router.post('/changepasswordmember/', adminlistController.changePasswordMember);

router.post('/getPagePermission/', adminlistController.getPagePermission);

router.post('/getAllAdminActive/', adminlistController.getAllAdminActive);



module.exports = router