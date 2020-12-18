import {a} from "./moduleb.js"
import $ from "jquery"
import vue from 'vue'

// 异步加载
// 方法一
// import(/*webpackChunkName:'modulea' */ "./modulea.js").then( res => {
//     res.a();
// })
// 方法二
require.ensure(['jquery','vue'],function($,vue){
    require('./modulea.js')
})

a()

console.log('app.js')
