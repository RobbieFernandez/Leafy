var babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
    ],
  }
}

var tsLoader = {
  loader: 'ts-loader',
  options: {
    configFile: 'tsconfig.json',
  }
}

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: babelLoader
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [babelLoader, tsLoader]
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              'sass-loader',
            ],
          },
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.scss', '.tsx', '.ts']
    },
    output: {
      library: 'leafy',
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist'
    }
  };
