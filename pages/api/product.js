import Product from "../../models/Product";

import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetReq(req, res);
      break;
    case "POST":
      await handlePostReq(req, res);
      break;
    case "DELETE":
      await handleDeleteReq(req, res);
      break;
    default:
      res
        .status(405)
        .send(`Method ${req.method} is not allowed for this endpoint.`);
  }
};

async function handleGetReq(req, res) {
  const { _id } = req.query;

  const product = await Product.findOne({ _id });

  res.status(200).json(product);
}

async function handlePostReq(req, res) {
  const { name, price, description, mediaUrl } = req.body;

  if (!name || !price || !description || !mediaUrl) {
    return res.status(422).send(`Product missing one or more fields.`);
  }

  const product = await new Product({
    name,
    price,
    description,
    mediaUrl,
  }).save();

  return res.status(201).json(product);
}

async function handleDeleteReq(req, res) {
  const { _id } = req.query;

  await Product.findByIdAndDelete({ _id });

  res.status(204).json({});
}
