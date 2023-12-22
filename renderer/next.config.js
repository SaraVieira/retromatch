/** @type {import('next').NextConfig} */
// eslint-disable-next-line
require("dotenv").config();
module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack(config) {
    return config;
  }
};
