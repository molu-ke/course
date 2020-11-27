module.exports = {
    entry:{
        // app:['babel-polyfill','./app.js']
        app:'./app.js'
    },

    output:{
        filename:'[name].js'
    },

    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    // 该配置可以由.babelrc文件统一管理，详情请看.babelrc文件
                    // options:{
                    //     presets:[
                    //         ['@babel/preset-env',{
                    //             targets:{
                    //                 browsers:['>1%']
                    //                 // node:'10'
                    //                 // chrome:'59'
                    //             }
                    //         }]
                    //     ]
                    // }
                }
            },
            {
                test:/\.tsx?$/,
                use:{
                    loader:'ts-loader', // 注意ts-loader跟webpack版本是否一致
                }
            }
        ]
    }
}