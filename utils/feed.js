import products from "../static/products.json";
import Product from "../models/Product";
import User from "../models/User";

async function feed() {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    const result = await Product.insertMany(products);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

export default feed;
