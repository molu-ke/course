
module.exports = {
  // 字符串写法
  // entry: './app.js'

  // 数组写法
  // 同时指定app.js  app2.js为入口文件   会打包生成一个入口文件
  // entry:['./app.js','./app2.js']

  // 对象写法
  // 多页面的打包方式  会打包生成两个入口文件
  entry:{
    app:'./app.js',
    // app2:'./app2.js'
  },

  output:{
    // 修改打包生成的文件夹
    path: __dirname + '/src' ,
    // 打包生成的文件  name 文件名   hash哈希值  :4 截取哈希前4位
    filename:'./js/[name],[hash:4].js'
  },

  module:{
    rules:[
      {
        // test:/\.js$/, // 要处理什么类型的文件
        // use 处理该类型文件使用什么loader   数组、对象、字符串
        // use:'babel-loader',
        // use:['babel-loader'],
        // use:{
        //   loader:'babel-loader', // loader名字
        //   options:{ } // loader配置
        // }
        // use:[
        //   {
        //       loader:'babel-loader', // loader名字
        //       options:{ } // loader配置
        //   }
        // ]
      }
    ]
  },

//   plugins:[
//     new webpack.HotModuleReplacementPlugin()
//   ]
}