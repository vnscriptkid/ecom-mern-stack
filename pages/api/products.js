import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  const { page, size } = req.query;

  let pageNumber = Number(page);
  const pageSize = Number(size);

  const totalDocs = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocs / pageSize);

  // Prevent malform pageNumber
  pageNumber = Math.max(1, pageNumber);
  pageNumber = Math.min(totalPages, pageNumber);

  const skips = (pageNumber - 1) * pageSize;

  const products = await Product.find().skip(skips).limit(pageSize);

  res.status(200).json({ products, totalPages });
};
