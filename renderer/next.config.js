/** @type {import('next').NextConfig} */
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
