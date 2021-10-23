// must restart server whenever you make changes in next.config
module.exports = {
  env: {
    MONGO_SRV: "mongodb://localhost:27017/react-reserve",
    JWT_SECRET: "sdf;ajlksdf;alksdfjlasdkjfswieriw*#(@#*#&*sdjhfjs)",
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/vnscriptkid/image/upload",
    STRIPE_SECRET_KEY: "<insert-stripe-secret-key>",
  },
};
