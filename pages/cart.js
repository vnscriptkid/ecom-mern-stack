import axios from "axios";
import { parseCookies } from "nookies";
import { Segment } from "semantic-ui-react";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import baseUrl from "../utils/baseUrl";

function Cart({ user, cartItems = [] }) {
  return (
    <Segment>
      <CartItemList user={Boolean(user)} cartItems={cartItems} />
      <CartSummary cartItems={cartItems} />
    </Segment>
  );
}

Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) return {};

  const config = { headers: { Authorization: token } };

  const url = `${baseUrl}/api/cart`;

  try {
    const res = await axios.get(url, config);

    const cartItems = res.data;

    return { cartItems };
  } catch (e) {
    console.error(e);
    return {};
  }
};

export default Cart;
