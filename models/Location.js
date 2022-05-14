import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Please provide type"],
      trim: true,
    },
    dimension: {
      type: String,
      required: [true, "Please provide dimension"],
      trim: true,
    },
    residents: {
      type: [String],
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    created: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Location", LocationSchema);
