import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import fs from "fs";

const defaultAvatar = "uploads/images/avatar.jpg";

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide required values!");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("This email already exists!");
  }
  const user = await User.create({
    email,
    password,
    displayName: "",
    avatar: req.file ? req.file.path : defaultAvatar,
    isDarkTheme: false,
    userType: "Standard",
  });
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.CREATED).json({
    user,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token });
};

const getUserByID = async (req, res) => {
  const { id: userIdFromParams } = req.params;
  const { userId: userIdFromToken } = req.user;

  const userId = userIdFromParams || userIdFromToken;

  if (userId) {
    const user = await User.findOne({ _id: userId });
    res.status(StatusCodes.OK).json(user);
  } else {
    throw new BadRequestError("Token expired!");
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.user;
  const { displayName, password, isDarkTheme } = JSON.parse(req.body.data);

  if (!userId) {
    throw new BadRequestError("UserId is missing!");
  }

  const user = await User.findOne({ _id: userId }).select("+password");

  if (displayName.length) {
    user.displayName = displayName;
  }
  if (password.length) {
    user.password = password;
  }
  if (req.file) {
    if (user.avatar !== defaultAvatar) {
      fs.unlink(user.avatar, (err) => {
        console.log(err);
      });
    }
    user.avatar = req.file.path;
  }
  user.isDarkTheme = isDarkTheme;

  await user.save();
  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({
    user,
    token,
  });
};

const getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(StatusCodes.OK).json({ users });
};

const updateUserAdmin = async (req, res) => {
  const { userId, avatar, displayName, userType } = req.body;

  if (!userId) {
    throw new BadRequestError("UserId is missing!");
  }

  const user = await User.findOne({ _id: userId });

  user.displayName = displayName;
  user.avatar = avatar;

  if (userType.length) {
    user.userType = userType;
  }
  await user.save();

  res.status(StatusCodes.OK).json({ user });
};

export {
  register,
  login,
  updateUser,
  getUserByID,
  getAllUsers,
  updateUserAdmin,
};
