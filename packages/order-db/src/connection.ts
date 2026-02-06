import mongoose from "mongoose";

let isConnected = false;

export const connnectionOrderDb = async () => {
  if (isConnected) {
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in env file!");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      directConnection: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
