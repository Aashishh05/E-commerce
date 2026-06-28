import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.log(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default ConnectDB;
