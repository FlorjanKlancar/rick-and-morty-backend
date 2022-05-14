import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/index.js";
import Location from "../models/Location.js";

const getAllLocations = async (req, res) => {
  const { keyword, sort, activePage, filterValue } = req.query;
  // console.log("filterValue", filterValue);
  let queryObject = {};

  if (filterValue) {
    let filterValueParsed = JSON.parse(filterValue);
    // console.log("filterValueParsed", filterValueParsed);
    for (const key in filterValueParsed) {
      // console.log(filterValueParsed[key]);
      if (key[0] === "$") {
        if (filterValueParsed[key][0].includes("-")) {
          let array = filterValueParsed[key][0].split("-");
          queryObject = {
            $expr: {
              $and: [
                { $lt: [{ $size: "$residents" }, +array[1]] },
                { $gte: [{ $size: "$residents" }, +array[0]] },
              ],
            },
          };
        } else if (filterValueParsed[key][0].includes(">")) {
          let value = filterValueParsed[key][0].substring(1);
          queryObject = {
            $expr: {
              $gt: [{ $size: "$residents" }, +value],
            },
          };
        }
      } else {
        queryObject[key] = {
          $regex: filterValueParsed[key].join("|"),
        };
      }
    }
  }
  if (keyword) {
    queryObject.name = { $regex: keyword, $options: "i" };
  }

  let result = Location.find(queryObject);
  if (sort === "date_asc") {
    result = result.sort("createdAt");
  }
  if (sort === "date_desc") {
    result = result.sort("-createdAt");
  }
  if (sort === "asc") {
    result = result.sort("name");
  }
  if (sort === "desc") {
    result = result.sort("-name");
  }

  const page = Number(activePage) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const locations = await result;

  const totalLocations = await Location.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalLocations / limit);
  res.status(StatusCodes.OK).json({
    info: { count: totalLocations, pages: numOfPages },
    results: locations,
  });
};

const getLocationById = async (req, res) => {
  const { id } = req.params;

  const location = await Location.findOne({ _id: id });
  if (!location) {
    throw new NotFoundError("Location not found!");
  }

  res.status(StatusCodes.OK).json(location);
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, dimension, type, residents } = req.body;

  const location = await Location.findOneAndUpdate(
    { _id: id },
    { name, dimension, type, residents }
  );
  if (!location) {
    throw new NotFoundError("Location not found!");
  }

  res.status(StatusCodes.OK).json("success");
};

const deleteLocation = async (req, res) => {
  const { id } = req.params;
  await Location.deleteOne({ _id: id });

  res.status(StatusCodes.OK).json("success");
};

const createLocation = async (req, res) => {
  const { name, dimension, type, residents } = req.body;

  const location = await Location.create({
    name,
    dimension,
    type,
    residents,
  });

  res.status(StatusCodes.CREATED).json({
    location,
  });
};
export {
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  createLocation,
};
