import axios from "axios";
import ProductList from "../components/Index/ProductList";
import baseUrl from "../utils/baseUrl";

function Home({ products }) {
  return <ProductList products={products} />;
}

Home.getInitialProps = async () => {
  const url = `${baseUrl}/api/products`;

  const res = await axios.get(url);

  return { products: res.data };
};

export default Home;
