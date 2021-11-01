import Cart from "../../models/Cart";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";
import mongoose from "mongoose";
import { apiHandler } from "../../utils/apiHandler";
import { ApiError } from "../../utils/apiErrors";

connectDb();

const { ObjectId } = mongoose.Types;

export default apiHandler((req, res) => {
  switch (req.method) {
    case "GET":
      handleGetReq(req, res);
      break;
    case "PUT":
      handlePutReq(req, res);
      break;
    case "DELETE":
      handleDeleteReq(req, res);
      break;
    default:
      throw new ApiError(405, `Method is not allowed`);
  }
});

async function handleGetReq(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "products.product",
      model: "Product",
    });

    if (!cart) throw new ApiError(404, `Cart not found.`);

    return res.status(200).json(cart.products);
  } catch (e) {
    throw new ApiError(500, `Error while fetching cart`);
  }
}

async function handlePutReq(req, res) {
  const { productId, quantity } = req.body;

  if (!productId || !quantity)
    throw new ApiError(422, `One or more fields are missing`);

  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "products",
      model: "Product",
    });

    if (!cart) throw new ApiError(404, `Cart not found.`);

    const product = await Product.findById(productId);

    if (!product) throw new ApiError(422, `Product not found`);

    const productInCart = cart.products.some((cartItem) =>
      ObjectId(productId).equals(cartItem.product)
    );

    if (productInCart) {
      await Cart.findOneAndUpdate(
        {
          _id: cart._id,
          "products.product": productId,
        },
        {
          $inc: { "products.$.quantity": quantity },
        }
      );
    } else {
      const newCartItem = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        {
          _id: cart._id,
        },
        {
          $addToSet: { products: newCartItem },
        }
      );
    }
    return res.status(200).send(`Cart updated`);
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Server error while updating cart`);
  }
}

async function handleDeleteReq(req, res) {
  const { productId } = req.query;

  if (!productId) throw new ApiError(422, `Product id is missing`);

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: "products.product",
      model: "Product",
    });

    res.status(200).send(cart.products);
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Error while updating cart`);
  }
}
