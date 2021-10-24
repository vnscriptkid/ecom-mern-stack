import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";

function AddProductToCart({ productId, loggedIn }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timeout;
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setQuantity(1);
      }, 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [success]);

  const handleAddProductToCart = async () => {
    const payload = { productId, quantity };
    const config = { headers: { Authorization: Cookies.get("token") } };

    const url = `${baseUrl}/api/cart`;

    setLoading(true);

    try {
      const res = await axios.put(url, payload, config);
      console.log(res.data);
      setSuccess(true);
    } catch (e) {
      console.error("Adding to cart failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      action={
        loggedIn
          ? {
              color: success ? "green" : "orange",
              content: success ? "Cart Updated" : "Add To Cart",
              icon: "plus cart",
              onClick: handleAddProductToCart,
              disabled: loading || success,
              loading,
            }
          : {
              color: "blue",
              content: "Sign up to purchase",
              icon: "signup",
              onClick: () => Router.push("/signup"),
            }
      }
    />
  );
}

export default AddProductToCart;
