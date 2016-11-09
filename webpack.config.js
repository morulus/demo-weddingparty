var path = require("path");
var webpack = require('webpack');
module.exports = {
	entry: {
		src: './devdemo/deploy.js'
	},
	output: {
		path: path.resolve("./pack"),
		filename: 'pack.js',
		libraryTarget: 'amd',
		library: 'lam',
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.less$/,
				loader: 'style!css!less'
			},
			{
				test: /\.(png|jpg|jpeg|gif|woff)$/,
				loaders: [
					'url-loader?name=[path][name].[ext]'
				]
			},
			{
				test: /\.(html|htm)$/,
				loader: 'html?attrs[]=img:src&attrs[]=figure:data-cartoon-src'
			},
			{
				test: /\.js[x]?$/,
				loader: 'babel-loader',
				query: {
					compact: false,
					presets: [
						require.resolve('babel-preset-es2015')
					],
					plugins: [
						require.resolve('babel-plugin-add-module-exports')
					]
				},
				exclude: /node_modules/
			}
		]
	},
	plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
	extensions: []
};
