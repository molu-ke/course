// 除了在app.js引入，还能在webpack.config.js 中的entry进入引入
// import 'babel-polyfill'

import './test.ts'

new Promise(setTimeout( () => {
    console.log(1)
},2000))

async function a(){

}