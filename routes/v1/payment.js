import createRouter from './base.js';
import authorisation from '../../middleware/auth/authorisation.js';

import {
  getPayment,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from '../../controllers/v1/payment.js';

import {
  validatePostPayment,
  validatePutPayment,
} from '../../middleware/validation/payment.js';

const paymentController = {
  get: getPayments,
  getById: getPayment,
  create: createPayment,
  update: updatePayment,
  delete: deletePayment,
};

const paymentRouter = createRouter(
  paymentController,
  validatePostPayment,
  validatePutPayment,
  authorisation
);

export default paymentRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         reservationId:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           example: "2025-05-01T15:00:00Z"
 *         amount:
 *           type: number
 *           format: float
 *           example: 249.99
 *         paymentMethod:
 *           type: string
 *           example: "Credit Card"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-01T15:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-01T15:30:00Z"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: Create a new payment
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '201':
 *         description: Payment successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment successfully created"
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       '400':
 *         description: Invalid payment data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid payment information"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [paymentId, reservationId, paymentDate, amount, paymentMethod, createdAt]
 *         description: Field to sort the payments by (default is 'paymentId')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order to sort the payments by (default is 'asc')
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       '404':
 *         description: No payments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No payments found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     summary: Get a payment by id
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment id
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '404':
 *         description: No payment found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No payment with the id: {id} found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   put:
 *     summary: Update a payment by id
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '200':
 *         description: Payment successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment with the id: {id} successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       '404':
 *         description: No payment found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No payment with the id: {id} found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   delete:
 *     summary: Delete a payment by id
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment id
 *     responses:
 *       '200':
 *         description: Payment successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment with the id: {id} successfully deleted"
 *       '404':
 *         description: No payment found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No payment with the id: {id} found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
