import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Please provide status"],
      enum: ["Dead", "Alive", "Unknown"],
      trim: true,
    },
    species: {
      type: String,
      required: [true, "Please provide species"],
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ["Male", "Female", "Unknown"],
      required: [true, "Please provide gender"],
    },
    origin: {
      name: { type: String, trim: true },
      url: { type: String, trim: true },
    },
    location: {
      name: { type: String, trim: true },
      url: { type: String, trim: true },
    },
    image: {
      type: String,
      trim: true,
    },
    episode: [
      {
        type: String,
        trim: true,
      },
    ],
    url: {
      type: String,
      trim: true,
    },
    created: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Character", CharacterSchema);
