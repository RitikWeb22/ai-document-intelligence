import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Resolve MongoDB Atlas SRV records reliably on Windows & local DNS routers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Graceful fallback to default system DNS if restricted
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
