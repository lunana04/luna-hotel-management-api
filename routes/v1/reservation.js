import createRouter from './base.js';
import authorisation from '../../middleware/auth/authorisation.js';

import {
  getReservation,
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../../controllers/v1/reservation.js';

import {
  validatePostReservation,
  validatePutReservation,
} from '../../middleware/validation/reservation.js';

const reservationController = {
  get: getReservations,
  getById: getReservation,
  create: createReservation,
  update: updateReservation,
  delete: deleteReservation,
};

const reservationRouter = createRouter(
  reservationController,
  validatePostReservation,
  validatePutReservation,
  authorisation
);

export default reservationRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         reservationId:
 *           type: string
 *           format: uuid
 *           example: "b3b38c5e-7a3b-48b9-b5f9-f4bf56dfbf91"
 *         guestId:
 *           type: string
 *           example: "987e6543-e21b-45f6-a789-123456789abc"
 *         guest:
 *           $ref: '#/components/schemas/Guest'
 *         roomId:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         checkInDate:
 *           type: integer
 *           example: 20240501
 *         checkOutDate:
 *           type: integer
 *           example: 20240505
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-10T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-12T09:30:00Z"
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
 * /api/v1/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags:
 *       - Reservation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       '201':
 *         description: Reservation successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation successfully created"
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       '400':
 *         description: Invalid reservation data or conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid reservation details"
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
 * /api/v1/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags:
 *       - Reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [reservationId, guestId, roomId, checkInDate, checkOutDate, createdAt]
 *         description: Field to sort the reservations by (default is 'reservationId')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order to sort the reservations by (default is 'asc')
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
 *                     $ref: '#/components/schemas/Reservation'
 *       '404':
 *         description: No reservations found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No reservations found"
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
 * /api/v1/reservations/{id}:
 *   get:
 *     summary: Get a reservation by id
 *     tags:
 *       - Reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation id
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       '404':
 *         description: No reservation found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No reservation with the id: {id} found"
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
 * /api/v1/reservations/{id}:
 *   put:
 *     summary: Update a reservation by id
 *     tags:
 *       - Reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       '200':
 *         description: Reservation successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation with the id: {id} successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       '404':
 *         description: No reservation found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No reservation with the id: {id} found"
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
 * /api/v1/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by id
 *     tags:
 *       - Reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation id
 *     responses:
 *       '200':
 *         description: Reservation successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation with the id: {id} successfully deleted"
 *       '404':
 *         description: No reservation found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No reservation with the id: {id} found"
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
