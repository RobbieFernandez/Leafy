var babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "usage",
          "corejs": 3
        }
      ],
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties"
    ]
  }
}

var tsLoader = {
  loader: 'ts-loader',
  options: {
    configFile: 'tsconfig.json',
  }
}

module.exports = {
  entry: __dirname + '/src/app.js',
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
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  devtool: 'source-map',
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
