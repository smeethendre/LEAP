import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECTION);
    console.log(`[DB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("[DB] Connection failed:", error.message);
    process.exit(1);
  }
};

export { connectDB };
