import Product from "../../models/Product";
import { ApiError } from "../../utils/apiErrors";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  const { page, size } = req.query;

  let pageNumber = Number(page);
  const pageSize = Number(size);

  try {
    const totalDocs = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocs / pageSize);

    // Prevent malform pageNumber
    pageNumber = Math.max(1, pageNumber);
    pageNumber = Math.min(totalPages, pageNumber);

    const skips = (pageNumber - 1) * pageSize;

    const products = await Product.find().skip(skips).limit(pageSize);

    return res.status(200).json({ products, totalPages });
  } catch (err) {
    console.log(err);
    throw new ApiError(500, `Server error while getting products`);
  }
};
