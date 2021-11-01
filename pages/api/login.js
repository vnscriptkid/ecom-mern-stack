import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/User";
import { ApiError } from "../../utils/apiErrors";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;

  // Validate email, password
  if (!email || !password)
    throw new ApiError(422, `Missing one or more fields.`);

  try {
    // check if user exists in db
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new ApiError(422, `Email does not exists.`);

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) throw new ApiError(422, `Wrong password.`);

    // create jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).send(token);
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Error while logging in.`);
  }
};
