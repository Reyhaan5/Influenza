import mongoose from "mongoose";
import dns from "dns";

// WINDOWS DNS FIX — DO NOT REMOVE
// Windows' default DNS resolver (via c-ares) frequently fails to resolve
// the SRV record for MongoDB Atlas (mongodb+srv://...), throwing
// "querySrv ECONNREFUSED". Forcing Node to use public DNS servers and
// preferring IPv4 results fixes this reliably. This must run before
// mongoose.connect() is ever called.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in your .env file");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
