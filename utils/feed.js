import products from "../static/products.json";
import Product from "../models/Product";
import User from "../models/User";
import faker from "faker";
import bcrypt from "bcrypt";

import connectDb from "./connectDb";

async function generateUsers(amount = 10) {
  const users = [];
  for (let i of Array(amount).keys()) {
    const user = new User({
      name: faker.name.firstName(),
      email: i === 0 ? "root@gmail.com" : faker.internet.email(),
      password: await bcrypt.hash("123456", 10),
      role: i === 0 ? "root" : "user",
    }).toObject();
    users.push(user);
  }
  return users;
}

async function feed() {
  try {
    await connectDb();
    // clean up
    await Product.deleteMany();
    await User.deleteMany();
    // seeding
    await Product.insertMany(products);
    await User.insertMany(await generateUsers());
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

feed();

export default feed;
