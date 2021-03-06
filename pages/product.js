import axios from "axios";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";
import baseUrl from "../utils/baseUrl";
import { hasNonUserRole } from "../utils/auth";

function Product({ product, user }) {
  return (
    <>
      <ProductSummary {...product} loggedIn={Boolean(user)} />
      <ProductAttributes
        {...product}
        user={user}
        isNonUser={hasNonUserRole(user)}
      />
    </>
  );
}

Product.getInitialProps = async function ({ query: { _id } }) {
  const url = `${baseUrl}/api/product`;

  const payload = { params: { _id } };

  const res = await axios.get(url, payload);

  return { product: res.data };
};

export default Product;
