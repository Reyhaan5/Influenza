import mongoose from "mongoose";
import dns from "dns";

// Fixes a common Windows/Node bug where mongodb+srv:// lookups fail
// with "querySrv ECONNREFUSED" even though nslookup works fine —
// Node's internal resolver doesn't always use the OS's DNS settings.
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// connectDB talks to MongoDB Atlas over the network — that takes time,
// so we mark this function "async" and use "await" in front of the call
// that actually reaches out to the internet. "await" just means:
// "pause here until this finishes, then continue to the next line."
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If the connection string or password is wrong, we land here.
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // stop the server — no point running without a DB
  }
};

export default connectDB;