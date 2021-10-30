import axios from "axios";
import ProductList from "../components/Index/ProductList";
import ProductPagination from "../components/Index/ProductPagination";
import baseUrl from "../utils/baseUrl";

function Home({ products, totalPages }) {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

Home.getInitialProps = async (ctx) => {
  const page = ctx.query.page ? ctx.query.page : 1;

  const payload = { params: { page, size: 9 } };

  const url = `${baseUrl}/api/products`;

  const res = await axios.get(url, payload);

  const { products, totalPages } = res.data;

  return { products, totalPages };
};

export default Home;
