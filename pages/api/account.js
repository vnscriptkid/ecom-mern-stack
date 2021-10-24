import bcrypt from "bcrypt";
import isLength from "validator/lib/isLength";
import isEmail from "validator/lib/isEmail";

import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  if (!("authorization" in req.headers))
    return res.status(401).send(`No auth token in headers.`);

  // Verify token
  const token = req.headers.authorization;

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId);

    if (!user) return res.status(404).send(`User not found.`);

    return res.status(200).json(user);
  } catch (e) {
    res.status(401).send(`Token invalid.`);
  }
};
