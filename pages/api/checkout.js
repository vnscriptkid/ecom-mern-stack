import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/User";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";
import calculateCartTotal from "../../utils/calculateCartTotal";
import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import Order from "../../models/Order";
import { apiHandler } from "../../utils/apiHandler";
import { ApiError } from "../../utils/apiErrors";

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

export default apiHandler(async (req, res) => {
  const { paymentData } = req.body;

  if (!paymentData) throw new ApiError(422, `paymentData missing in req body`);

  try {
    // find the cart of this user
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "products.product",
      model: "Product",
    });

    if (!cart) throw new ApiError(404, `Cart not found`);

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
      user: req.user._id,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products,
    }).save();

    // Clear products in cart
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });

    return res.status(200).send("Checkout successful");
  } catch (e) {
    console.error(e);
    throw new ApiError(500, `Error while checking out`);
  }
});
