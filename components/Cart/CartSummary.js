import { useEffect, useState } from "react";
import { Button, Divider, Segment } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ cartItems = [] }) {
  const [cartEmpty, setCartEmpty] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [stripeTotal, setStripeTotal] = useState(0);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(cartItems);

    setCartEmpty(cartItems.length === 0);
    setCartTotal(cartTotal);
    setStripeTotal(stripeTotal);
  }, [cartItems]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub total: </strong> ${cartTotal}
        <Button
          disabled={cartEmpty}
          icon="cart"
          color="teal"
          floated="right"
          content="Checkout"
        />
      </Segment>
    </>
  );
}

export default CartSummary;
