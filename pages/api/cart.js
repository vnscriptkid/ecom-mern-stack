import Cart from "../../models/Cart";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

connectDb();

const { ObjectId } = mongoose.Types;

export default (req, res) => {
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
      res.status(405).send(`Method is not allowed`);
  }
};

async function handleGetReq(req, res) {
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
}

async function handlePutReq(req, res) {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(422).send(`One or more fields are missing`);
  }

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
      path: "products",
      model: "Product",
    });

    if (!cart) return res.status(404).send(`Cart not found.`);

    const product = await Product.findById(productId);

    if (!product) return res.status(422).send(`Product not found`);

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
    res.status(200).send(`Cart updated`);
  } catch (e) {
    return res.status(500).send(`Error while updating cart`);
  }
}

async function handleDeleteReq(req, res) {
  const { productId } = req.query;

  if (!productId) {
    return res.status(422).send(`Product id is missing`);
  }

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
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: "products.product",
      model: "Product",
    });

    res.status(200).send(cart.products);
  } catch (e) {
    return res.status(500).send(`Error while updating cart`);
  }
}
