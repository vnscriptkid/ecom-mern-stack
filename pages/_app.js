import App from "next/app";
import Layout from "../components/_App/Layout";
import { parseCookies } from "nookies";

import {
  handleRedirect,
  authRoutes,
  nonUserRoutes,
  hasUserRole,
} from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import Router from "next/router";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    const { token } = parseCookies(ctx);

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      if (authRoutes.includes(ctx.pathname)) {
        handleRedirect(ctx, "/login");
      }
    } else {
      // user logged in
      // get account info from api
      try {
        const config = { headers: { Authorization: token } };

        const url = `${baseUrl}/api/account`;

        const res = await axios.get(url, config);

        const user = res.data;

        if (nonUserRoutes.includes(ctx.pathname) && hasUserRole(user)) {
          handleRedirect(ctx, "/");
        }

        pageProps.user = user;
      } catch (e) {
        console.error(`Error getting current user`, e);
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener("storage", this.syncLogout);
  }

  syncLogout(e) {
    if (e.key === "logout") {
      console.log("Logged out from storage");
      Router.push("/login");
    }
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
