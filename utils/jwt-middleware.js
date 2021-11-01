import User from "../models/User";
import jwt from "jsonwebtoken";
import connectDb from "./connectDb";
import { ApiError } from "./apiErrors";

connectDb();

export { jwtMiddleware };

async function jwtMiddleware(req, res) {
  if (!("authorization" in req.headers))
    throw new ApiError(401, `No auth token in headers.`);

  let userId;
  try {
    // Verify token
    const token = req.headers.authorization;

    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    userId = jwtPayload.userId;

    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, `User not found`);

    req.user = user;
  } catch (e) {
    throw new ApiError(401, `Token invalid.`);
  }
}
