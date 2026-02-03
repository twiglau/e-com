import "dotenv/config";
import { connnectionOrderDb } from "./connection";
import mongoose from "mongoose";

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    await connnectionOrderDb();
    console.log("✅ Successfully connected to MongoDB!");
    console.log("Database:", mongoose.connection.db?.databaseName);

    // 关闭连接
    await mongoose.connection.close();
    console.log("Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
