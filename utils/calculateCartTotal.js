function calculateCartTotal(cartItems = []) {
  const total = cartItems.reduce((acc, { quantity, product }) => {
    return acc + quantity * product.price;
  }, 0);
  return {
    cartTotal: ((total * 100) / 100).toFixed(2),
    stripeTotal: Number((total * 100).toFixed(2)),
  };
}

export default calculateCartTotal;
