import Order from "../../models/Order";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";

connectDb();

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
    const orders = await Order.find({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });

    return res.status(200).json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error getting orders");
  }
};
