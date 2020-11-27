const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        app: './app.js'
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
        new MiniCssExtractPlugin({ filename: '[name].min.css' })
    ]

}