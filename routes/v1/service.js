import createRouter from './base.js';
import authorisation from '../../middleware/auth/authorisation.js';

import {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../controllers/v1/service.js';

import {
  validatePostService,
  validatePutService,
} from '../../middleware/validation/service.js';

const serviceController = {
  get: getServices,
  getById: getService,
  create: createService,
  update: updateService,
  delete: deleteService,
};

const serviceRouter = createRouter(
  serviceController,
  validatePostService,
  validatePutService,
  authorisation
);
export default serviceRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         serviceId:
 *           type: string
 *           format: uuid
 *           example: "f2a4b6c8-d1e3-4f5a-9b8c-0d1234567890"
 *         hotelId:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
 *         serviceName:
 *           type: string
 *           example: "Spa Treatment"
 *         price:
 *           type: number
 *           format: float
 *           example: 75.50
 *         description:
 *           type: string
 *           example: "A full-body massage and facial treatment package."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-08T10:15:30Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-08T11:00:00Z"
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
 * /api/v1/services:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Service
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       '201':
 *         description: Service successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service successfully created"
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       '400':
 *         description: Invalid input or duplicate service
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid service data or duplicate service name"
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
 * /api/v1/services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Service
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [serviceId, serviceName, price, createdAt]
 *         description: Field to sort the services by (default is 'serviceId')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order to sort the services by (default is 'asc')
 *     responses:
 *       '200':
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       '404':
 *         description: No services found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No services found"
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
 * /api/v1/services/{id}:
 *   get:
 *     summary: Get a service by id
 *     tags:
 *       - Service
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service id
 *     responses:
 *       '200':
 *         description: Service found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       '404':
 *         description: No service found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No service with the id: {id} found"
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
 * /api/v1/services/{id}:
 *   put:
 *     summary: Update a service by id
 *     tags:
 *       - Service
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       '200':
 *         description: Service successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service with the id: {id} successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       '404':
 *         description: No service found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No service with the id: {id} found"
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
 * /api/v1/services/{id}:
 *   delete:
 *     summary: Delete a service by id
 *     tags:
 *       - Service
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service id
 *     responses:
 *       '200':
 *         description: Service successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service with the id: {id} successfully deleted"
 *       '404':
 *         description: No service found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No service with the id: {id} found"
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
