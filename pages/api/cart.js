import Cart from "../../models/Cart";
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
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });

    if (!cart) return res.status(404).send(`Cart not found.`);

    return res.status(200).json(cart.products);
  } catch (e) {
    return res.status(500).send(`Error while fetching cart`);
  }
};
