const express = require('express')
const router = express.Router()
const adminsettingController = require('../controllers/adminsetting.controller');
let cors = require('cors')

router.use(cors());

/**
 * @swagger 
 * tags:
 *   - name: adminsetting
 *     description: For managing admin settings
 * /api/adminsetting/getadminsetting/:
 *   get:
 *     summary: Get a list of setting
 *     description: Returns a list of admin settings
 *     parameters:
 *       - in: query
 *         name: searchWord
 *         schema:
 *           type: string
 *         description: The required field for searching
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The optional field for filtering by ID
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {}
 */
router.get('/getadminsetting/', adminsettingController.getadminsetting);

router.post('/getadminsettingbyid/', adminsettingController.getadminsettingbyid);

router.post('/updateadminsettingbyid/', adminsettingController.updateadminsettingbyid);


module.exports = router