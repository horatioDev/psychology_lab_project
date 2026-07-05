import mongoose from 'mongoose';

/**
 * MongoDB Atlas M0 (free): 512MB storage, shared cluster, suitable for dev/small prod.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  console.log('MongoDB Atlas connected');
}

export default connectDB;
