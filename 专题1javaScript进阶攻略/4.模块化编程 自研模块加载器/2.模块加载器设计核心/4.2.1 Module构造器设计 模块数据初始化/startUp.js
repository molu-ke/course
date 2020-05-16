(function(global) {
    var startUp = global.startUp = {
        version:'1.0.1'
    }
    var data = {}
    var cache = {}
    // 模块的生命周期
    var status = {
        FETCHED:1, // 正在当前模块获取uri
        SAVED:2, // 缓存中存储模块数据信息
        LOADING:3, // 正在加载当前模块依赖项
        LOADED:4, // 准备执行当前模块
        EXECUTING:5, // 正在执行当前模块
        EXECUTED:6 // 执行完毕接口对象以获取
    }

    var isArray = function(obj) {
        return toString.call(obj === '[object Array]')
    }

    // 构造函数  模块初始化数据
    function Module(uri,deps) {
        this.uri = uri;
        this.deps = deps || []; // [a.js , b.js] 依赖项
        this.exports = null;
        this.status = 0;
        this._waitings = {};
        this._remain = 0;
    }

    // 分析主干(左子树 | 右子树) 上的依赖项
    Module.prototype.load = function() {
        var m = this;
        m.status = status.LOADING;
        // var uri = m.resolve(); // 获取主干上的依赖项
        // var len = m._remain = uri.length;
        // 加载主干上的依赖项（模块）
    }

    // 资源定位
    Module.prototype.resolve = function(){

    }

    // 定义一个模块
    Module.define = function(factory) {

    }

    // 检测缓存对象上是否有当前模块信息
    Module.get = function(uri,deps) {
        return cache[uri] || ( cache[uri] = new Module(uri,deps) )
    }

    Module.use = function(deps,callback,uri) {
        var m = Module.get(uri, isArray(deps) ? deps : [deps] );
        console.log(m)
        // 所有模块都加载完毕
        m.callback = function() {

        }
        m.load();
    }


    var _cid = 0;

    function cid() {
        return _cid ++
    };

    data.preload = [];
    // 获取当前项目文档的URL
    data.cwd = document.URL.match(/[^?]*\//)[0];
    Module.preload = function(callback) {
        var length = data.preload.length;
        if(!length) callback();
        // length !== 0 先加载预先设定模块
    }

    startUp.use = function(list,callback) {
        // 检测有没有预先加载的模块
        Module.preload(function() {
            Module.use(list,callback,data.cwd + "_use_" + cid() ); //虚拟的根目录
        })
    }

    global.define = Module.define
})(this)