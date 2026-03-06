import createRouter from './base.js';
import authorisation from '../../middleware/auth/authorisation.js';

import {
  getInventory,
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory,
} from '../../controllers/v1/inventory.js';

import {
  validatePostInventory,
  validatePutInventory,
} from '../../middleware/validation/inventory.js';

const inventoryController = {
  get: getInventories,
  getById: getInventory,
  create: createInventory,
  update: updateInventory,
  delete: deleteInventory,
};

const inventoryRouter = createRouter(
  inventoryController,
  validatePostInventory,
  validatePutInventory,
  authorisation
);

export default inventoryRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       properties:
 *         inventoryId:
 *           type: string
 *           format: uuid
 *           example: "e1a2b3c4-d5f6-7890-ab12-1234567890cd"
 *         hotelId:
 *           type: string
 *           format: uuid
 *           example: "3f2e1d0c-4b5a-6789-0123-abcdef123456"
 *         itemName:
 *           type: string
 *           example: "Towels"
 *         quantity:
 *           type: integer
 *           example: 200
 *         pricePerItem:
 *           type: number
 *           format: float
 *           example: 5.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-08T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-08T13:00:00Z"
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
 * /api/v1/inventory:
 *   post:
 *     summary: Add an inventory item
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       '201':
 *         description: Inventory item successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inventory item successfully added"
 *                 data:
 *                   $ref: '#/components/schemas/Inventory'
 *       '400':
 *         description: Invalid inventory data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid inventory input"
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
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Filter inventory by hotel ID
 *       - in: query
 *         name: itemName
 *         schema:
 *           type: string
 *         description: Filter inventory by item name
 *     responses:
 *       '200':
 *         description: List of inventory items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *       '404':
 *         description: No inventory items found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No inventory items found"
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
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Get an inventory item by ID
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory item ID
 *     responses:
 *       '200':
 *         description: Inventory item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       '404':
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No inventory item with the id: {id} found"
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
 * /api/v1/inventory/{id}:
 *   put:
 *     summary: Update an inventory item by ID
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       '200':
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inventory item with the id: {id} successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Inventory'
 *       '404':
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No inventory item with the id: {id} found"
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
 * /api/v1/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item by ID
 *     tags:
 *       - Inventory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory item ID
 *     responses:
 *       '200':
 *         description: Inventory item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inventory item with the id: {id} successfully deleted"
 *       '404':
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No inventory item with the id: {id} found"
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
