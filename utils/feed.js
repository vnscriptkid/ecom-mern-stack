import products from "../static/products.json";
import Product from "../models/Product";
import User from "../models/User";
import faker from "faker";
import bcrypt from "bcrypt";

import connectDb from "./connectDb";
import Cart from "../models/Cart";

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

async function generateCarts(users) {
  for (let user of users) {
    await new Cart({ user: user._id }).save();
  }
}

async function feed() {
  try {
    await connectDb();
    // clean up
    await Product.deleteMany();
    await User.deleteMany();
    // seeding
    await Product.insertMany(products);
    const users = await generateUsers();
    await User.insertMany(users);
    await generateCarts(users);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

feed();

export default feed;
