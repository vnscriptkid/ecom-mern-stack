import jwt from "jsonwebtoken";
import User from "../../models/User";

export default async (req, res) => {
  if (!("authorization" in req.headers))
    return res.status(401).send(`No auth token in headers.`);

  let userId;
  try {
    // Verify token
    const token = req.headers.authorization;

    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    userId = jwtPayload.userId;
  } catch (e) {
    return res.status(401).send(`Token invalid.`);
  }

  try {
    const users = await User.find({ _id: { $ne: userId } });
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error getting users");
  }
};
