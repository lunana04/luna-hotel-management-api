import createRouter from './base.js';
import authorisation from '../../middleware/auth/authorisation.js';

import {
  getRoom,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../../controllers/v1/room.js';

import {
  validatePostRoom,
  validatePutRoom,
} from '../../middleware/validation/room.js';

const roomController = {
  get: getRooms,
  getById: getRoom,
  create: createRoom,
  update: updateRoom,
  delete: deleteRoom,
};

const roomRouter = createRouter(
  roomController,
  validatePostRoom,
  validatePutRoom,
  authorisation
);

export default roomRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: "d1e92f50-7639-4ae5-8a8a-fc317e9cfc6b"
 *         roomType:
 *           type: string
 *           enum: [SINGLE, DOUBLE, SUITE]
 *           example: "DOUBLE"
 *         pricePerNight:
 *           type: number
 *           format: float
 *           example: 120.50
 *         availabilityStatus:
 *           type: string
 *           enum: [RESERVED, PENDING, AVAILABLE]
 *           example: "AVAILABLE"
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
 * /api/v1/rooms:
 *   post:
 *     summary: Create a new room
 *     tags:
 *       - Room
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       '201':
 *         description: Room successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room successfully created"
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid room data"
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
 * /api/v1/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags:
 *       - Room
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [roomId, roomType, pricePerNight, availabilityStatus]
 *         description: Field to sort the rooms by (default is 'roomId')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order to sort the rooms by (default is 'asc')
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
 *                     $ref: '#/components/schemas/Room'
 *       '404':
 *         description: No rooms found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No rooms found"
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
 * /api/v1/rooms/{id}:
 *   get:
 *     summary: Get a room by id
 *     tags:
 *       - Room
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room id
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       '404':
 *         description: No room found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No room with the id: {id} found"
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
 * /api/v1/rooms/{id}:
 *   put:
 *     summary: Update a room by id
 *     tags:
 *       - Room
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       '200':
 *         description: Room successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room with the id: {id} successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       '404':
 *         description: No room found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No room with the id: {id} found"
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
 * /api/v1/rooms/{id}:
 *   delete:
 *     summary: Delete a room by id
 *     tags:
 *       - Room
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room id
 *     responses:
 *       '200':
 *         description: Room successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room with the id: {id} successfully deleted"
 *       '404':
 *         description: No room found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No room with the id: {id} found"
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
