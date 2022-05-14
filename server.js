import express from "express";
import cors from "cors";
import "express-async-errors";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import charactersRouter from "./routes/characterRoutes.js";
import locationRouter from "./routes/locationRoutes.js";
import connectDb from "./db/connect.js";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome from nodejss!");
});

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/user", authRouter);
app.use("/api/characters", charactersRouter);
app.use("/api/locations", locationRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
