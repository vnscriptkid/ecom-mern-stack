import { Card } from "semantic-ui-react";

function ProductList({ products }) {
  const itemsFromProducts = products.map((product) => ({
    header: product.name,
    image: product.mediaUrl,
    meta: `$${product.price}`,
    color: "teal",
    fluid: true,
    childKey: product._id,
    href: `/product?_id=${product._id}`,
  }));

  return (
    <Card.Group stackable itemsPerRow={3} centered items={itemsFromProducts} />
  );
}

export default ProductList;
