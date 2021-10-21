import Product from "../../models/Product";

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetReq(req, res);
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

async function handleDeleteReq(req, res) {
  const { _id } = req.query;

  await Product.findByIdAndDelete({ _id });

  res.status(204).json({});
}
