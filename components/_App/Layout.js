import Head from "next/head";
import { Container } from "semantic-ui-react";

import Header from "./Header";
import HeadContent from "./HeadContent";

function Layout({ children, user }) {
  return (
    <>
      <Head>
        {/* TODO: Uncomment this line, fix issue */}
        {/* <HeadContent /> */}
        {/* Stylesheets */}
        <link rel="stylesheet" type="text/css" href="/static/styles.css" />
        <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
        />
        <title>ReactReserve</title>
      </Head>
      <Header user={Boolean(user)} />
      <Container text style={{ paddingTop: "1em", paddingBottom: "1em" }}>
        {children}
      </Container>
    </>
  );
}

export default Layout;
