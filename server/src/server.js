import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`DocuMind AI Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`API Base URL: http://localhost:${env.PORT}/api/v1`);
  });

  // Graceful shutdown handling
  const handleShutdown = () => {
    logger.info('Received termination signal. Closing server...');
    server.close(() => {
      logger.info('Server closed gracefully');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer().catch((err) => {
  logger.error('Failed to start server:', { error: err.message });
});
