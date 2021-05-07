import webpack, { Configuration as WebpackConfiguration } from "webpack";
import nodeExternals from "webpack-node-externals";
import * as path from "path";

// Delete env var pointing to `tsconfig.webpack.json` so that `ts-loader`
// will use default file `tsconfig.json` instead
delete process.env.TS_NODE_PROJECT;

//=================================//
// Build Webpack Config For Client //
//=================================//

export const clientWebpackConfig: WebpackConfiguration = {
  entry: [
    // Path to entry file relative to this file
    path.resolve(__dirname, "..", "index.ts"),
  ],

  output: {
    // filename: '[name].[contenthash].js',
    filename: "lambda.js",
    // Path relative to executable launch point
    path: path.resolve("dist-lambda"),
    // Ensure bundle has exportable module
    libraryTarget: "commonjs",
  },

  externals: [
    nodeExternals({
      allowlist: [
        // Include here string names of any node packages you want to include in bundle
        // You do NOT need 'aws-sdk' libraries!
        "tslib",
        "axios",
        "follow-redirects",
        "debug",
        "ms",
        //
        // "aws-sdk/clients/ses",
      ],
    }),
  ],

  target: "node", // See: https://webpack.js.org/concepts/targets/

  // devtool: 'source-map',

  resolve: {
    extensions: [".ts", ".js"],

    alias: {},

    plugins: [],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true, // Don't complain about ts errors, just transpile
              happyPackMode: true,
            },
          },
        ].filter(Boolean) as webpack.RuleSetUse,
        exclude: [/node_modules/],
      },
    ],
  },

  plugins: [].filter(Boolean) as webpack.WebpackPluginInstance[],

  optimization: {
    minimize: false, // Only needed in frontend code
    // minimizer: [ new TerserPlugin( ... ) ]
  },
};

export default clientWebpackConfig;
