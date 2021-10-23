import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/User";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;

  // Validate email, password
  if (!email || !password)
    return res.status(422).send(`Missing one or more fields.`);

  try {
    // check if user exists in db
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(422).send(`Email does not exists.`);

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) return res.status(422).send(`Wrong password.`);

    // create jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).send(token);
  } catch (e) {
    console.error(e);
    res.status(500).send(`Error while logging in.`);
  }
};
