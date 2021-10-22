import { Button, Header, Icon, Segment } from "semantic-ui-react";

function CartItemList() {
  const user = true;

  return (
    <Segment secondary color="teal" inverted textAlign="center" placeholder>
      <Header icon>
        <Icon name="shopping basket" />
        No product in your cart. Add some?
      </Header>
      <div>
        {user ? (
          <Button color="orange">View Products</Button>
        ) : (
          <Button color="blue">Login to Add Products</Button>
        )}
      </div>
    </Segment>
  );
}

export default CartItemList;
