const webpack = require('webpack');
module.exports = {
    mode:'production',
    entry:{
        vendor:['jquery','vue']
    },
    output:{
        path:__dirname+'/src/dll',
        filename:'./[name].js',
        library:'[name]_library'
    },
    plugins:[
        new webpack.DllPlugin({
            path:__dirname+"/src/dll/[name].json",
            name:'[name]_library' // 要跟output.library  一致
        })
    ]
}