const path = require('path')
const fs = require('fs')
const readFileAsync = require('util').promisify(fs.readFile);
const writeFileAsync = require('util').promisify(fs.writeFile);


// class myplugin {
//     constructor(options){

//     }
//     // 当new成功后，会将对象安装到webpack插件池中，然后调用apply()方法
//     apply(compiler){
//         // console.log(compiler.options) // 拿到的是和webpack默认配置合并后的配置文件
//         // console.log(compiler.context)  //路径
//         // 生命周期  所有的webpack插件都是监听生命周期完成的
//         // make  刚开始打包
//         // emit 刚打包完，但是没有输出为dist目录
//         // done 已经输出为dist目录
//         compiler.hooks.make.tap('myplugin',(compilation)=>{
//             console.log('make')
//         })
//         compiler.hooks.emit.tap('myplugin',(compilation)=>{
//             console.log('emit')
//         })
//         compiler.hooks.done.tap('myplugin',(compilation)=>{
//             console.log('done',compilation.toJson().assets)
//         })
//     }
// }

// 需求：在开发过程中用到的都是本地资源文件，上线后要替换为文件服务器的资源文件、
class myplugin {
    constructor(options) {
        this.options = options || {
            serverPath: 'xxxx'
        }
        this.serverPath = this.options.serverPath;
    }
    apply(compiler) {
        compiler.hooks.done.tap('AddstaticServer', (compilation) => {
            let context = compiler.options.context;
            let publicPath = path.resolve(context,'dist');
            compilation.toJson().assets.forEach( ast => {
                let {dir,base,ext} = path.parse(ast.name);
                if(ext === '.ftl'){
                    readFileAsync(path.resolve(publicPath,dir,base)).then( res => {
                        res = res.replace('static',this.serverPath)
                        writeFileAsync(path.resolve(publicPath,dir,base),res)
                    }) 
                }
            })
        })
    }
}

module.exports = myplugin