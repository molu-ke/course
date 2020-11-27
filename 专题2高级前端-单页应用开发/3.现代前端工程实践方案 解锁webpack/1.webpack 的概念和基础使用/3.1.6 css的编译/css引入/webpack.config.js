module.exports = {
    entry:{
        app:'./app.js'
    },
    output:{
        path:__dirname + '/src/dist',
        filename:'./[name].bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    {
                        loader:'style-loader',
                        options:{
                            // insert: '#mydiv'

                        }
                    },
                    {
                        loader:'css-loader',
                        options:{
                            modules:{
                                // 指定编码名字
                                localIdentName:'[path][name]_[local]_[hash:4]'
                            }
                        }
                    }
                ]
            }
        ]
    }

}