import axios from "axios";
import { parseCookies } from "nookies";
import { Segment } from "semantic-ui-react";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import baseUrl from "../utils/baseUrl";

function Cart({ user, products = [] }) {
  return (
    <Segment>
      <CartItemList user={Boolean(user)} />
      <CartSummary />
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

    const products = res.data;

    return { products };
  } catch (e) {
    console.error(e);
    return {};
  }
};

export default Cart;
