const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        app: './app.js',
        app2: './app2.js',
    },
    output: {
        path: __dirname + '/src/dist',
        filename: './[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            postcssOptions:{
                                ident:'postcss',
                                plugins:[
                                    require('autoprefixer')()
                                ]
                            }
                          
                        }
                    }

                ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ 
            filename: '[name].min.css' 
        }),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./index.html',
            chunks:['app'],
            minify:{
                collapseWhitespace:false //是否压缩html文件  默认为true
            },
            inject:true, // 是否开启资源引入
        })
    ]

}