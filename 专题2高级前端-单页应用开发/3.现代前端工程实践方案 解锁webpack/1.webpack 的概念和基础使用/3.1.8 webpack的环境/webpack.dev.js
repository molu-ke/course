const webpack = require('webpack')
module.exports = {
    devtool:'cheap-module-source-map', // 此选项控制是否生成，以及如何生成 source map
    devServer: {
        port:9001, // 指定端口号
        overlay:true, // 出现编译器错误或警告时，在浏览器中显示全屏覆盖
        hot:true, // 启用热更新
        hotOnly:true, // 启用热更新
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(), // 模块热替换插件
        new webpack.NamedModulesPlugin()
    ]
}