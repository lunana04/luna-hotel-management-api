// Import the Express module
import express from 'express';

// This should be declared under - import express from "express";
import swaggerJSDoc from "swagger-jsdoc";

// This should be declared under - import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import logger from "./middleware/logger.js";

import helmet from "helmet";

import rateLimit from "express-rate-limit";

const isTestEnv = process.env.NODE_ENV === 'test';

// import { readLimiter, writeLimiter } from './middleware/rateLimiter.js';

import authRoutes from "./routes/v1/auth.js";

// Import the index routes module
import indexRoutes from './routes/index.js';

import hotelRoutes from './routes/v1/hotel.js';

import employeeRoutes from './routes/v1/employee.js';

import paymentRoutes from './routes/v1/payment.js';

import reservationRoutes from './routes/v1/reservation.js';

import roomRoutes from './routes/v1/room.js';

import guestRoutes from './routes/v1/guest.js';

import serviceRoutes from './routes/v1/service.js';

import reviewRoutes from './routes/v1/review.js';

import inventoryRoutes from './routes/v1/inventory.js';

import userRoutes from './routes/v1/user.js';

import { isContentTypeApplicationJSON } from './middleware/utils.js'; // Make sure this exists and is correct

const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// This should be declared above app.use("/", indexRoutes);
app.use(express.urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data

// This should be declared under - app.use(urlencoded({ extended: false }));
app.use(express.json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

app.use(
  helmet({
    xPoweredBy: true,
  })
);

const readLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 20,
  message: 'You have exceeded the number of requests: 20. Please try again in 2 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'You have exceeded the number of requests: 10. Please try again in 1 minute.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters only if NOT in test environment
if (!isTestEnv) {
  // Apply readLimiter only to GET requests on all /api/v1 routes
  app.use('/api/v1', (req, res, next) => {
    if (req.method === 'GET') {
      return readLimiter(req, res, next);
    }
    next();
  });

  // Apply writeLimiter only to POST, PUT, PATCH, DELETE requests on all /api/v1 routes
  app.use('/api/v1', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return writeLimiter(req, res, next);
    }
    next();
  });
}

// Swagger options for API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Management System API',
      version: '1.0.0',
      description: 'A hotel management system API',
      contact: {
        name: 'Luna',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/v1/*.js'], // Adjust this path to your actual route files
};

// Initialize Swagger documentation
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// This should be declared under - const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(isContentTypeApplicationJSON);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/v1/auth", authRoutes);

// Use the routes module
app.use('/', indexRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/guests', guestRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/users', userRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
