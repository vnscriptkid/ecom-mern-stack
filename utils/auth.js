import Cookie from "js-cookie";
import Router from "next/router";

export const handleLogin = (token) => {
  Cookie.set("token", token);

  Router.push("/");
};

export const handleRedirect = (ctx, destRoute) => {
  // Run on server?
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: destRoute });
    ctx.res.end();
  } else {
    Router.push(destRoute);
  }
};
