import {
  Button,
  Header,
  Icon,
  Item,
  Message,
  Segment,
} from "semantic-ui-react";
import Router from "next/router";

function CartItemList({ user, cartItems = [], handleRemoveFromCart, success }) {
  if (success)
    return (
      <Message
        success
        header="Success!"
        content="You payment has been accepted"
        icon="star outline"
      />
    );

  const mapCartItemsToItems = (cartItems) => {
    return cartItems.map((item) => ({
      childKey: item.product._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => Router.push(`/product?_id=${item.product._id}`)}
        >
          {item.product.name}
        </Item.Header>
      ),
      image: item.product.mediaUrl,
      meta: `${item.quantity} x $${item.product.price}`,
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(item.product._id)}
        />
      ),
    }));
  };

  if (cartItems.length === 0)
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No product in your cart. Add some?
        </Header>
        <div>
          {user ? (
            <Button onClick={() => Router.push("/")} color="orange">
              View Products
            </Button>
          ) : (
            <Button onClick={() => Router.push("/login")} color="blue">
              Login to Add Products
            </Button>
          )}
        </div>
      </Segment>
    );

  return <Item.Group divided items={mapCartItemsToItems(cartItems)} />;
}

export default CartItemList;
