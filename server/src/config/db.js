import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wayfarer";
    const connectionInstance = await mongoose.connect(connStr);
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection FAILED: ", error.message);
    console.warn("⚠️ Make sure MongoDB service is running locally on port 27017 or provide MONGODB_URI in server/.env");
  }
};

export default connectDB;
