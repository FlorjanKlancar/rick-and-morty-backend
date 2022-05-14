import dotenv from "dotenv";
import { readFile } from "fs/promises";
import connectDb from "./db/connect.js";
import Location from "./models/Location.js";
dotenv.config();

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    await Location.deleteMany();

    const jsonLocations = JSON.parse(
      await readFile(new URL("./data/locations.json", import.meta.url))
    );
    await Location.create(jsonLocations);

    console.log("CREATED");
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};

start();
