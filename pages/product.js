import axios from "axios";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";

function Product({ product }) {
  return (
    <>
      <ProductSummary {...product} />
      <ProductAttributes {...product} />
    </>
  );
}

Product.getInitialProps = async function ({ query: { _id } }) {
  const url = "http://localhost:3000/api/product";

  const payload = { params: { _id } };

  const res = await axios.get(url, payload);

  return { product: res.data };
};

export default Product;
