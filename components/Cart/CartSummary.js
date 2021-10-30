import { useEffect, useState } from "react";
import { Button, Divider, Segment } from "semantic-ui-react";
import StripeCheckout from "react-stripe-checkout";

import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ cartItems = [], handleCheckout, success }) {
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
        <StripeCheckout
          name="React Reserve"
          amount={stripeTotal}
          image={cartItems.length > 0 ? cartItems[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey={process.env.STRIPE_PUBLIC_KEY}
          token={handleCheckout}
          triggerEvent="onClick"
        >
          <Button
            disabled={cartEmpty || success}
            icon="cart"
            color="teal"
            floated="right"
            content="Checkout"
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
