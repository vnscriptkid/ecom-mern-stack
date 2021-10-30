import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/User";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";
import calculateCartTotal from "../../utils/calculateCartTotal";
import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import Order from "../../models/Order";

connectDb();

// {
//   "id": "tok_abc",
//   "object": "token",
//   "card": {
//       "id": "card_xyz",
//       "object": "card",
//       "address_city": "hanoi",
//       "address_country": "Vietnam",
//       "address_line1": "Keangnam - Hanoi",
//       "address_line1_check": "unchecked",
//       "address_line2": null,
//       "address_state": null,
//       "address_zip": "100",
//       "address_zip_check": "unchecked",
//       "brand": "Visa",
//       "country": "US",
//       "cvc_check": "unchecked",
//       "dynamic_last4": null,
//       "exp_month": 12,
//       "exp_year": 2034,
//       "funding": "credit",
//       "last4": "4242",
//       "name": "thanh",
//       "tokenization_method": null
//   },
//   "client_ip": "x.x.x.x",
//   "created": 1635582544,
//   "email": "thanh@gmail.com",
//   "livemode": false,
//   "type": "card",
//   "used": false
// }

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (!("authorization" in req.headers))
    return res.status(401).send(`No auth token in headers.`);

  const { paymentData } = req.body;

  if (!paymentData)
    return res.status(422).send(`paymentData missing in req body.`);

  // Verify token
  const token = req.headers.authorization;

  let userId = null;
  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    userId = jwtPayload.userId;
  } catch (e) {
    res.status(401).send(`Token invalid.`);
  }

  try {
    // find the cart of this user
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart) return res.status(404).send(`Cart not found`);

    // calculate total from items in cart
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);

    // is exsiting customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1,
    });

    const isExistingCustomer = prevCustomer.data.length > 0;

    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id,
      });
    }

    const customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;

    const charge = await stripe.charges.create(
      {
        currency: "usd",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`,
      },
      {
        idempotency_key: uuidv4(),
      }
    );

    // Add new order
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products,
    }).save();

    // Clear products in cart
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });

    res.status(200).send("Checkout successful");
  } catch (e) {
    console.error(e);
    res.status(500).send(`Error while checkout`);
  }
};
