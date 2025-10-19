const express = require('express');
const router = express.Router();
const PaymentTypeController = require('../controllers/paymenttype.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentType:
 *       type: object
 *       required:
 *         - type_code
 *         - type_name
 *       properties:
 *         id:
 *           type: integer
 *           description: Payment type ID
 *         type_code:
 *           type: string
 *           description: Payment type code (e.g., 'qr', 'stripe')
 *         type_name:
 *           type: string
 *           description: Payment type name (e.g., 'QR Payment', 'Stripe Payment')
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * /api/paymenttype:
 *   get:
 *     summary: Get all payment types
 *     tags: [PaymentType]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for type_name or type_code
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PaymentType'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/', PaymentTypeController.getAllPaymentTypes);

/**
 * @swagger
 * /api/paymenttype/{id}:
 *   get:
 *     summary: Get payment type by ID
 *     tags: [PaymentType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment type ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PaymentType'
 *       404:
 *         description: Payment type not found
 *       500:
 *         description: Server error
 */
router.get('/:id', PaymentTypeController.getPaymentTypeById);

/**
 * @swagger
 * /api/paymenttype/code/{code}:
 *   get:
 *     summary: Get payment type by type code
 *     tags: [PaymentType]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment type code
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PaymentType'
 *       404:
 *         description: Payment type not found
 *       500:
 *         description: Server error
 */
router.get('/code/:code', PaymentTypeController.getPaymentTypeByCode);

/**
 * @swagger
 * /api/paymenttype:
 *   post:
 *     summary: Create new payment type
 *     tags: [PaymentType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_code
 *               - type_name
 *             properties:
 *               type_code:
 *                 type: string
 *                 description: Payment type code
 *               type_name:
 *                 type: string
 *                 description: Payment type name
 *     responses:
 *       201:
 *         description: Payment type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PaymentType'
 *       400:
 *         description: Bad request
 *       409:
 *         description: Type code already exists
 *       500:
 *         description: Server error
 */
router.post('/', PaymentTypeController.createPaymentType);

/**
 * @swagger
 * /api/paymenttype/{id}:
 *   put:
 *     summary: Update payment type
 *     tags: [PaymentType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_code
 *               - type_name
 *             properties:
 *               type_code:
 *                 type: string
 *                 description: Payment type code
 *               type_name:
 *                 type: string
 *                 description: Payment type name
 *     responses:
 *       200:
 *         description: Payment type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PaymentType'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Payment type not found
 *       409:
 *         description: Type code already exists
 *       500:
 *         description: Server error
 */
router.put('/:id', PaymentTypeController.updatePaymentType);

/**
 * @swagger
 * /api/paymenttype/{id}:
 *   delete:
 *     summary: Delete payment type
 *     tags: [PaymentType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment type ID
 *     responses:
 *       200:
 *         description: Payment type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Payment type not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', PaymentTypeController.deletePaymentType);

/**
 * @swagger
 * /api/paymenttype/bulk-delete:
 *   post:
 *     summary: Bulk delete payment types
 *     tags: [PaymentType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of payment type IDs to delete
 *     responses:
 *       200:
 *         description: Bulk delete completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/bulk-delete', PaymentTypeController.bulkDeletePaymentTypes);

module.exports = router;
