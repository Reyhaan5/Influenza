import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropStaleIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const collection = mongoose.connection.collection("brandprofiles");

    // List all current indexes so we can confirm what's there
    const indexes = await collection.indexes();
    console.log("Current indexes on brandprofiles:", indexes);

    // Drop the stale index left over from an earlier schema version
    // (back when the field was named "userId" instead of "user")
    const staleIndexExists = indexes.some((idx) => idx.name === "userId_1");

    if (staleIndexExists) {
      await collection.dropIndex("userId_1");
      console.log("Dropped stale index: userId_1");
    } else {
      console.log("No stale userId_1 index found — nothing to drop.");
    }

    const indexesAfter = await collection.indexes();
    console.log("Indexes after cleanup:", indexesAfter);
  } catch (error) {
    console.error("Error dropping index:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
};

dropStaleIndex();