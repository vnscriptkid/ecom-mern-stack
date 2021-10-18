import axios from "axios";
import { useEffect } from "react";

function Home({ products }) {
  console.log("**Products: ", products);

  return <>home</>;
}

Home.getInitialProps = async () => {
  const url = "/api/products";

  const res = await axios.get(url);

  return { products: res.data };
};

export default Home;
