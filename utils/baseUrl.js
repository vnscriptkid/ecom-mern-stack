const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://www.prod-url.com"
    : "http://localhost:3000";

export default baseUrl;
