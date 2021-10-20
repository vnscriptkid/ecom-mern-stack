import Product from "../../models/Product";

export default async (req, res) => {
  const product = await Product.findOne({ _id: req.query._id });

  res.status(200).json(product);
};
