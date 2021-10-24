import App from "next/app";
import Layout from "../components/_App/Layout";
import { parseCookies } from "nookies";

import { handleRedirect } from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps;

    const { token } = parseCookies(ctx);

    console.log({ token });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      const privateRoutes = ["/account", "/cart"];
      if (privateRoutes.includes(ctx.pathname)) {
        handleRedirect(ctx, "/login");
      }
    } else {
      // get account info from api
      try {
        const config = { headers: { Authorization: token } };

        const url = `${baseUrl}/api/account`;

        const res = await axios.get(url, config);

        const user = res.data;

        pageProps.user = user;
      } catch (e) {
        console.error(`Error getting current user`, e);
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
