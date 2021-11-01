import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isLength from "validator/lib/isLength";
import isEmail from "validator/lib/isEmail";

import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import Cart from "../../models/Cart";
import { ApiError } from "../../utils/apiErrors";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;

  // Validate name, email, password
  if (!name || !email || !password)
    throw new ApiError(422, `Missing one or more fields.`);

  if (!isLength(name, { min: 3, max: 10 }))
    throw new ApiError(422, `Name must be from 3 to 10 characters.`);

  if (!isLength(password, { min: 6, max: 20 }))
    throw new ApiError(422, `Password must be from 6 to 20 characters.`);

  if (!isEmail(email)) throw new ApiError(422, `Email is invalid.`);

  try {
    // check if user exists in db
    const emailExists = await User.findOne({ email });

    if (emailExists) throw new ApiError(422, `Email already exists.`);

    const hash = await bcrypt.hash(password, 10);

    // create user
    const user = await new User({ name, email, password: hash }).save();

    // create cart for user
    await new Cart({ user: user._id }).save();

    // create jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).send(token);
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Error while signing up user.`);
  }
};
