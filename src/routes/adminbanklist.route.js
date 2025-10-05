const express = require('express')
const router = express.Router()
const adminbanklistController = require('../controllers/adminbanklist.controller');
let cors = require('cors')

router.use(cors());

const multer = require('multer');
const path = require('path');

// Multer configuration for QR upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', '..', 'assets', 'qr');
    console.log('Multer destination:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and bank ID
    const timestamp = new Date().getTime();
    const fileExtension = path.extname(file.originalname);
    const fileName = `qr_${timestamp}${fileExtension}`;
    console.log('Multer filename:', fileName);
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

router.post('/getadminbank/', adminbanklistController.getadminbank);

router.post('/getactiveadminbank/', adminbanklistController.getactiveadminbank);

router.post('/getbankinfo/', adminbanklistController.getbankinfo);

router.post('/getbankbreakinfo/', adminbanklistController.getbankbreakinfo);

router.get('/getadminbankbyid/:Id', adminbanklistController.getadminbankbyid);

router.post('/updateadminbankbyid/', adminbanklistController.updateadminbankbyid);

router.post('/deleteadminbankbyid/', adminbanklistController.deleteadminbankbyid);

router.post('/create/', adminbanklistController.create);

router.post('/transferbankbyid/', adminbanklistController.transferbankbyid);

router.post('/uploadqr/', upload.single('qr_image'), adminbanklistController.uploadqr);



module.exports = router