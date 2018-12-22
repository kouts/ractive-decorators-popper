const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	node: false,
	mode: 'production',
    target: 'web',
    context: path.resolve(__dirname, 'src'),
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    },
    entry: {
        'ractive-decorators-popper': path.resolve(__dirname, './src/ractive-decorators-popper.js'),
        'ractive-decorators-popper.min': path.resolve(__dirname, './src/ractive-decorators-popper.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'RactiveDecoratorsPopper',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    externals: {
        'popper.js': {
            commonjs: 'popper.js',
            commonjs2: 'popper.js',
            amd: 'popper.js',
            root: 'Popper'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: ['@babel/preset-env']
                        }                        
                    }
                ]
            }
        ]
    }

}