var path = require("path");
var webpack = require("webpack");
var nodeExternals = require("webpack-node-externals");
var NodemonPlugin = require("nodemon-webpack-plugin");

var browserConfig = {
  entry: "./src/browser/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: { modules: true, camelCase: true, allowMultiple: true }
          }
        ]
      },
      { test: /\.(js)$/, use: "babel-loader" }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "true"
    })
  ]
};

var serverConfig = {
  entry: "./src/server/index.js",
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: "server.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: { modules: true, camelCase: true, allowMultiple: true }
          }
        ]
      },
      { test: /\.(js)$/, use: "babel-loader" }
    ]
  },
  plugins: [
    new NodemonPlugin(),
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    })
  ]
};

module.exports = [browserConfig, serverConfig];
