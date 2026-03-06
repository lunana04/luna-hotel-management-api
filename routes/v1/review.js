import createRouter from './base.js';
import authorisation from '../../middleware/auth/authorisation.js';

import {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../../controllers/v1/review.js';

import {
  validatePostReview,
  validatePutReview,
} from '../../middleware/validation/review.js';

const reviewController = {
  get: getReviews,
  getById: getReview,
  create: createReview,
  update: updateReview,
  delete: deleteReview,
};

const reviewRouter = createRouter(
  reviewController,
  validatePostReview,
  validatePutReview,
  authorisation
);

export default reviewRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         reviewId:
 *           type: string
 *           format: uuid
 *           example: "d4c3b2a1-e5f6-7890-abcd-1234567890ef"
 *         guestId:
 *           type: string
 *           format: uuid
 *           example: "9f8e7d6c-5b4a-3210-9876-543210fedcba"
 *         hotelId:
 *           type: string
 *           format: uuid
 *           example: "1a2b3c4d-5e6f-7081-9a0b-c1d2e3f4g5h6"
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         comment:
 *           type: string
 *           example: "Great review and clean rooms!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-08T14:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-08T15:00:00Z"
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
 * /api/v1/reviews:
 *   post:
 *     summary: Submit a new review
 *     tags:
 *       - Review
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '201':
 *         description: Review successfully submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review successfully submitted"
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Invalid review data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input for review"
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
 * /api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags:
 *       - Review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Filter reviews by hotel ID
 *       - in: query
 *         name: guestId
 *         schema:
 *           type: string
 *         description: Filter reviews by guest ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, rating]
 *         description: Field to sort the reviews by (default is 'createdAt')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order to sort the reviews by (default is 'desc')
 *     responses:
 *       '200':
 *         description: List of reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       '404':
 *         description: No reviews found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No reviews found"
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
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags:
 *       - Review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     responses:
 *       '200':
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       '404':
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No review with the id: {id} found"
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
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags:
 *       - Review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '200':
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review with the id: {id} successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       '404':
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No review with the id: {id} found"
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
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags:
 *       - Review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     responses:
 *       '200':
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review with the id: {id} successfully deleted"
 *       '404':
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No review with the id: {id} found"
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
