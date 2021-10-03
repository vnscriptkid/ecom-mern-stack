import axios from "axios";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const url = "/api/products";
    const res = await axios.get(url);
    console.log(res.data);
  }

  return <>home</>;
}

export default Home;
