import axios from "axios";
import Cookies from "js-cookie";
import { parseCookies } from "nookies";
import { useState } from "react";
import { Segment } from "semantic-ui-react";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import baseUrl from "../utils/baseUrl";

function Cart({ user, initialCartItems = [] }) {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleRemoveFromCart = async (productId) => {
    // console.log("removing: ", productId);
    const config = { headers: { Authorization: Cookies.get("token") } };

    const url = `${baseUrl}/api/cart?productId=${productId}`;

    try {
      const res = await axios.delete(url, config);
      setCartItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Segment>
      <CartItemList
        handleRemoveFromCart={handleRemoveFromCart}
        user={Boolean(user)}
        cartItems={cartItems}
      />
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

    return { initialCartItems: cartItems };
  } catch (e) {
    console.error(e);
    return {};
  }
};

export default Cart;
