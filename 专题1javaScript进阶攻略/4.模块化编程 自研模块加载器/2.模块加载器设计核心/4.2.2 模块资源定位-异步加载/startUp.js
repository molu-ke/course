(function(global) {
    var startUp = global.startUp = {
        version:'1.0.1'
    }
    var data = {}
    var cache = {}
    // 模块的生命周期
    var status = {
        FETCHED:1, // 正在获取当前模块获取uri
        SAVED:2, // 缓存中存储模块数据信息
        LOADING:3, // 正在加载当前模块依赖项
        LOADED:4, // 准备执行当前模块
        EXECUTING:5, // 正在执行当前模块
        EXECUTED:6 // 执行完毕接口对象以获取
    }

    var isArray = function(obj) {
        return toString.call(obj === '[object Array]')
    }

    var isArray = function(obj) {
        return toString.call(obj === '[object String]')
    }

    // 是否使用了别名
    function parseAlias(id) {
        var alias = data.alias // 配置
        return alias && isString(alias[id]) ? alias[id] : id;
    }

    // 不能以“/” “:” 开头 结尾必须是一个“/” 后面跟随任意字符至少一个
    var PATHS_RE = /^([^\/:]+)(\/.+)$/; // ([^\/:]+) 路径的短名配置 

    // 检测是否 书写路径短名称
    function parsePaths(id) { // a.js  b.js
        var paths = data.paths; // 配置
        if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
            id = paths[m[1]] + m[2]
        }
        return id;
    }

    // 检测是否添加后缀
    function normalize(path) { // a.js  b.js
        var last = path.length - 1; // 3
        var lastC = path.charAt(last); // s
        return (lastC === "/" || path.substring(last - 2) === '.js' ) ? path : path + ".js";
    }

    // 检测根目录
    function addBase(id,uri) {
        var result;
        // 相对路径
        if(id.charAt(0) === '.') {
            result = realpath((uri ? uri.match(/[^?]*\//)[0] : data.cwd) + id );
        } else {
            result = data.cwd + id
        }
        return result
    }

    var DOT_RE = /\/.\//g; // /a/b/./c/./d ==> /a/b/c/d  ./去掉 
    var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//; // a/b/c/../../d ==> a/b/../d ==> a/d 
    // 规范路径
    function realpath(path) {
        path = path.replace(DOT_RE,'/');
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE,'/')
        }
        return path;
    }

    // 生成绝对路径  parent child
    startUp.resolve = function(child,parent) {
        if(!child) return "";
        child = parseAlias(child); // 检测是否有别名
        child = parsePaths(child); // 检测是否有路径别名  依赖模块中引包的模块路径地址 require("app/c")
        child = normalize(child); //检测是否添加后缀
        return addBase(child,parent); // 添加根目录
    }

    startUp.request = function(url,callback) {
        var node = document.createElement('script');
        node.src = url;
        document.body.appendChild(node);
        node.onload = function(){
            node.onload = null;
            document.body.removeChild(node);
            callback();
        }
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
        m.status = status.LOADING; // LOADING == 3 正在加载当前模块依赖项
        var uris = m.resolve(); // 获取主干上的依赖项
        console.log(uris)
        var len = m._remain = uris.length;

        // 加载主干上的依赖项（模块）
        var seed;
        console.log(m)
        for (var i = 0; i < len; i++) {
            seed = Module.get(uris[i]);
            if (seed.status < status.LOADING ) { // LOADED:4 准备执行当前模块
                seed._waitings[m.uri] = seed._waitings[m.uri] || 1;
            } else {
                seed._remain--;
            }
        }
        // 如果依赖列表模块全都加载完毕
        if( m._remain == 0 ) {
            // 获取模块的接口对象
            // m.onload();
        };
        
        // 准备执行根目录下的依赖列表中的模块
        var requestCache = {};
        for (var i = 0; i < len; i++) {
            seed = Module.get(uris[i]);
            if (seed.status < status.FETCHED ) { // FETCHED:1  正在获取当前模块获取uri 此时seed.status === 0
                seed.fetch(requestCache)
            }
        }

        for ( uri in requestCache ) {
            requestCache[uri]()
        }
    }

    // 加载依赖列表中的模块 a.js b.js
    Module.prototype.fetch = function(requestCache) {
        var m = this;
        m.status = status.FETCHED; // FETCHED:1 1 正在获取当前模块获取uri
        var uri = m.uri;
        requestCache[uri] = sendRequest; // Document.createElement("script")

        function sendRequest() {
            startUp.request(uri,onRequest); // 动态加载script
        }

        function onRequest() { // 事件函数
            // if (anonymousMeta) { // 模块数据更新
            //     m.save(uri,anonymousMeta);
            // }
            m.load(); // 递归  模块加载策略  deps a.js []  b.js []
        }
    }

    // 更改初始化数据
    Module.prototype.save = function(uri,meta) {

    }

    // 资源定位 解析依赖项生成绝对路径
    Module.prototype.resolve = function(){
        var mod = this;
        var ids = mod.deps; // ["a.js", "b.js"]
        var uris = [];
        for (var i = 0 ;i < ids.length; i++) {
            uris[i] = startUp.resolve(ids[i],mod.uri); // 依赖项 （主干|子树）
        }
        return uris
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