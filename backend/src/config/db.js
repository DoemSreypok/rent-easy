import mongoose from 'mongoose';

// Disable query buffering so Mongoose never hangs for 10000ms when MongoDB is offline
mongoose.set('bufferCommands', false);

let isConnecting = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) return;
  isConnecting = true;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rent-easy-db';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will retry connecting when database is available.');
    isConnecting = false;
    // Auto-retry in 5 seconds
    setTimeout(connectDB, 5000);
  }
};

export const ensureConnected = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  try {
    await connectDB();
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
  setTimeout(connectDB, 3000);
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️ MongoDB connection error event:', err.message);
});
