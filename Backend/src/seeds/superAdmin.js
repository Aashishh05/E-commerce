import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../models/userModel.js";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required in .env",
      );
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.name = process.env.SUPER_ADMIN_NAME || "Super Admin";

      existingAdmin.role = "super_admin";
      existingAdmin.isActive = true;

      await existingAdmin.save();

      console.log("Super Admin already exists");
      console.log("Super Admin verified/updated");
      console.log(`Email: ${email}`);

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const superAdmin = await User.create({
      name: process.env.SUPER_ADMIN_NAME || "Super Admin",
      email,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
    });

    console.log("Super Admin created successfully");
    console.log(`Email: ${superAdmin.email}`);
  } catch (error) {
    console.error("Failed to seed Super Admin:", error);

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedSuperAdmin();
