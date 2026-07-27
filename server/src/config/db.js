import mongoose from "mongoose";

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = "mongodb://127.0.0.1:27017/wayfarer";

  if (primaryUri) {
    try {
      console.log(`Connecting to primary MongoDB...`);
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`\nMongoDB connected !! DB HOST: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Primary MongoDB connection failed (${err.message}). Falling back to local MongoDB (127.0.0.1:27017)...`);
    }
  }

  try {
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\nMongoDB connected (Local Fallback) !! DB HOST: ${conn.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection FAILED: ", error.message);
    console.warn("⚠️ Make sure MongoDB service is running locally on port 27017 or provide a valid MONGODB_URI");
  }
};

export default connectDB;

