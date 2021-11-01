import Order from "../../models/Order";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";
import { apiHandler } from "../../utils/apiHandler";
import { ApiError } from "../../utils/apiErrors";

connectDb();

export default apiHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate({
      path: "products.product",
      model: "Product",
    });

    return res.status(200).json(orders);
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Server error getting orders`);
  }
});
