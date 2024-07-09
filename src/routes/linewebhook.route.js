const express = require('express')
let cors = require('cors')

// const lineWebHookController = require("../controllers/linewebhook.controller.js");


// const multer = require('multer');
// const path = require('path');

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '00tmpfile'); // Path to the assets folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// router.get('/test/', lineWebHookController.test);

// router.post('/webhook/:pairKey', lineWebHookController.webhook);

// module.exports = router

module.exports = function(wsConnections) {
    const router = express.Router();

    router.use(cors());

    const lineWebHookController = require("../controllers/linewebhook.controller.js")(wsConnections);    
   
    router.get('/test', lineWebHookController.test);
    router.get('/broadcast', lineWebHookController.broadcast);
    router.post('/webhook/:pairKey', lineWebHookController.webhook);

    return router;
};