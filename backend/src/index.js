import 'dotenv/config';
import './config/dns.js';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initSentry, setupSentryErrorHandler } from './config/sentry.js';
import { clerkAuth } from './middleware/auth.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

import cloudinary from "./utils/cloudinary.js";

const app = express();
const PORT = process.env.PORT || 5000;

initSentry();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Stripe webhook needs raw body - must be before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkAuth);

app.get('/', (_req, res) => {
  res.json({ message: 'Psychology Lab API', version: '1.0.0' });
});

// Test route
app.get("/api/test-cloudinary", async (_req, res) => {
  try {
    const config = cloudinary.config();

    console.log("Cloudinary runtime config:", {
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret_exists: !!config.api_secret,
    });

    const result = await cloudinary.api.ping();

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cloudinary test error:", {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });

    res.status(500).json({
      success: false,
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });
  }
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
setupSentryErrorHandler(app);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
