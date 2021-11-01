import Product from "../../models/Product";
import { ApiError } from "../../utils/apiErrors";

import connectDb from "../../utils/connectDb";

connectDb();

export default (req, res) => {
  switch (req.method) {
    case "GET":
      handleGetReq(req, res);
      break;
    case "POST":
      handlePostReq(req, res);
      break;
    case "DELETE":
      handleDeleteReq(req, res);
      break;
    default:
      throw new ApiError(
        405,
        `Method ${req.method} is not allowed for this endpoint.`
      );
  }
};

async function handleGetReq(req, res) {
  const { _id } = req.query;

  const product = await Product.findOne({ _id });

  if (!product) throw new ApiError(404, `Product not found.`);

  res.status(200).json(product);
}

async function handlePostReq(req, res) {
  try {
    const { name, price, description, mediaUrl } = req.body;

    if (!name || !price || !description || !mediaUrl) {
      throw new ApiError(422, `Product missing one or more fields.`);
    }

    const product = await new Product({
      name,
      price,
      description,
      mediaUrl,
    }).save();

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    throw new ApiError(500, `Server error while creating new product.`);
  }
}

async function handleDeleteReq(req, res) {
  try {
    const { _id } = req.query;

    await Product.findByIdAndDelete({ _id });

    return res.status(204).json({});
  } catch (e) {
    throw new ApiError(500, `Server error while deleting product`);
  }
}
