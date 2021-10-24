import { Item, Label } from "semantic-ui-react";
import AddProductToCart from "../../components/Product/AddProductToCart";

function ProductSummary({ _id, mediaUrl, name, sku, price, loggedIn }) {
  return (
    <Item.Group>
      <Item>
        <Item.Image size="medium" src={mediaUrl} />
        <Item.Content>
          <Item.Header>{name}</Item.Header>
          <Item.Description>
            <p>${price}</p>
            <Label>SKU: {sku}</Label>
          </Item.Description>
          <Item.Extra>
            <AddProductToCart productId={_id} loggedIn={loggedIn} />
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}

export default ProductSummary;
