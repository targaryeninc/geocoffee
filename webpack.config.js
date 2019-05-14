const webpack = require('webpack');
const path = require('path');

module.exports = env => {
  return {
    mode: env.NODE_ENV,
    entry: path.join(__dirname, '/src/index.js'),
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000',
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
            },
          },
        },
        {
          test: /\.(css|scss)$/,
          include: /node_modules/,
          loaders: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
      contentBase: path.join(__dirname),
      publicPath: '/build',
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  };
};
