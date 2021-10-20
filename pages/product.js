import axios from "axios";

function Product({ product }) {
  console.log("product: ", product);
  return <>product</>;
}

Product.getInitialProps = async function ({ query: { _id } }) {
  const url = "http://localhost:3000/api/product";

  const payload = { params: { _id } };

  const res = await axios.get(url, payload);

  return { product: res.data };
};

export default Product;
