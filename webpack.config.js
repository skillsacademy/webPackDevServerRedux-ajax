    // dev server webpack.config example
    // npm run dev

    var ExtractTextPlugin = require("extract-text-webpack-plugin");
    
    // dependencies
    var webpack = require('webpack');
    var path = require('path');   

    // paths
    var paths = {
        src:path.resolve(__dirname, 'www/assets/js/myreact'),
        bundleOutput:path.resolve(__dirname, 'www/dist'),
        devServer:path.resolve(__dirname, 'www')
    };

    var config = {
        entry: {
            'app': paths.src + '/index.jsx'
        },        
        output: {
            path: paths.bundleOutput,        
            publicPath:'/dist/', // Alias path to access javascript files from html page: /dist/bundle.js
            filename: '/bundle.js'
        },
        resolve: {
            root: [paths.src]
        }, 
        devtool:'cheap-module-source-map',
		devServer: {
            contentBase: paths.devServer, 
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            stats: 'errors-only',
            host: process.env.HOST,
            port: process.env.PORT
        },        
        module : {
            loaders : [{
		        test : /\.jsx?/,
		        include : paths.src,
		        exclude: /(node_modules|bower_components)/,
		        loaders: ['react-hot', 'babel']
    		},
            {
              test: /\.scss$/,
              loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap' ]
            }]
        },
        plugins:[
            new webpack.HotModuleReplacementPlugin(),
            new ExtractTextPlugin('bundle.css', {
                allChunks: true // if true - ensures that the css for each component is bundled into one file, not separate files.
            })                       
        ]
    };

    module.exports = config;