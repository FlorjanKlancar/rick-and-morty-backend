import { UnAuthenticatedError } from "../errors/index.js";

UnAuthenticatedError;
const authorization = (userType) => async (req, res, next) => {
  const authorization = req.user.authorization;

  try {
    if (authorization !== userType) {
      throw new UnAuthenticatedError("Authorization Invalid");
    }

    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authorization Invalid");
  }
};

export default authorization;
