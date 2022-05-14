import { readFile } from "fs/promises";
import dotenv from "dotenv";
import connectDb from "./db/connect.js";
import Character from "./models/Character.js";

dotenv.config();

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    await Character.deleteMany();

    const jsonCharacters = JSON.parse(
      await readFile(new URL("./data/characters.json", import.meta.url))
    );
    await Character.create(jsonCharacters);

    console.log("CREATED!");
    process.exit(0);
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};

start();
