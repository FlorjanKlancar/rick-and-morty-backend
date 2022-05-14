import Character from "../models/Character.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError,
} from "../errors/index.js";

const getAllCharacters = async (req, res) => {
  const { keyword, sort, activePage, filterValue } = req.query;
  let { characters } = req.query;

  let allChars = await Character.find();
  const rickChar = allChars[1];

  if (characters) {
    const characterIds = characters.split(",");

    const mappedChars = characterIds
      .map((charId) => {
        const foundChar = allChars.find((x) => x.id === +charId);
        return (
          foundChar ?? {
            ...rickChar._doc,
            id: +charId,
            name: "Dummy Rick " + charId,
          }
        );
      })
      .filter((c) => c);

    res.status(StatusCodes.OK).json({
      characters: mappedChars,
    });
  } else {
    let queryObject = {};

    if (keyword) {
      queryObject.name = { $regex: keyword, $options: "i" };
    }

    if (filterValue) {
      let filterValueParsed = JSON.parse(filterValue);
      for (const key in filterValueParsed) {
        if (key[0] === "$") {
          const filterSplit = filterValueParsed[key][0].split("-");

          if (filterSplit) {
            queryObject = {
              [`episode.${filterSplit[0]}`]: {
                $exists: true,
              },

              [`episode.${+filterSplit[1] + 1}`]: {
                $exists: false,
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

    let result = Character.find(queryObject);

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

    // setup pagination
    const page = Number(activePage) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const characters = await result;

    const totalCharacters = await Character.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalCharacters / limit);

    res.status(200).json({
      info: { count: totalCharacters, pages: numOfPages },
      results: characters,
    });
  }
};

const getCharacterById = async (req, res) => {
  const { id } = req.params;

  const character = await Character.findOne({ _id: id });

  if (!character) {
    throw new NotFoundError("Character not found!");
  }

  res.status(200).json(character);
};

const addNewCharacter = async (req, res) => {
  const { name, status, gender, species, location, image } = req.body;

  const character = new Character({
    name,
    status,
    gender,
    species,
    location: { name: location.name },
    image,
  });

  character.save();

  res.status(StatusCodes.CREATED).json(character);
};

const updateCharacter = async (req, res) => {
  const { id } = req.params;
  const { name, status, gender, species, location, image } = req.body;

  const char = await Character.findOne({ _id: id });

  if (name.length) {
    char.name = name;
  }
  if (status) {
    char.status = status;
  }
  if (gender) {
    char.gender = gender;
  }
  if (species) {
    char.species = species;
  }
  if (location.name.length) {
    char.location.name = location.name;
  }
  if (image.length) {
    char.image = image;
  }

  const updatedCharacter = await char.save();

  res.status(StatusCodes.OK).json(updatedCharacter);
};

const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  await Character.deleteOne({ _id: id });

  res.status(StatusCodes.OK).send("Deleted character: " + id);
};

export {
  getAllCharacters,
  getCharacterById,
  addNewCharacter,
  updateCharacter,
  deleteCharacter,
};
