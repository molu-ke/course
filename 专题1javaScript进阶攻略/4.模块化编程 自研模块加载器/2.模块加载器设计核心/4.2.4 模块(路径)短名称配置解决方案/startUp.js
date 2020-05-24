(function(global) {
    var startUp = global.startUp = {
        version:'1.0.1'
    }
    var data = {};
    var cache = {};
    var anonymousMeta = {};
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
        return toString.call(obj) === '[object Array]'
    }

    var isString = function(obj) {
        return toString.call(obj) === '[object String]'
    }
    
    var isFunction = function(obj) {
        return toString.call(obj) === '[object Function]'
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
        child = parseAlias(child); // 检测是否有别名  a === common/js/a   b === common/js/b
        child = parsePaths(child); // 检测是否有路径别名  依赖模块中引包的模块路径地址 require("app/c")
        child = normalize(child); //检测是否添加后缀 a === common/js/a.js   b === common/js/b.js
        return addBase(child,parent); // 添加根目录 项目的绝对路径为基准  data.cwd + common/js/a.js
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
        this.uri = uri; // 资源地址
        this.deps = deps || []; // [a.js , b.js] 依赖项
        this.exports = null; // 接口对象
        this.status = 0; // 状态码
        this._waitings = {}; // 谁依赖于我
        this._remain = 0; // 还有多少个依赖项未加载
    }

    // 分析主干(左子树 | 右子树) 上的依赖项
    Module.prototype.load = function() {
        var m = this;
        m.status = status.LOADING; // LOADING == 3 正在加载当前模块依赖项
        var uris = m.resolve(); // 获取主干上的依赖项
        // console.log(uris)
        var len = m._remain = uris.length;

        // 加载主干上的依赖项（模块）
        var seed;
        // console.log(m)
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
            m.onload();
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

    Module.prototype.onload = function() {
        // console.log(mod)
        // console.log(cache)
        var mod = this; // a.js   b.js
        mod.status = status.LOADED;// LOADED:4 准备执行当前模块
        if(mod.callback){ // 获取模块的接口对象
            mod.callback();
        }
        var waitings = mod._waitings;
        var key;
        for( key in waitings ){
            var m = cache[key]; // 主干
            m._remain -= waitings[key];
            if(m._remain == 0 ){
                m.onload();
            }
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
            if (anonymousMeta) { // 模块数据更新
                m.save(uri,anonymousMeta);
            }
            m.load(); // 递归  模块加载策略  deps a.js []  b.js []
        }
    }

    // 更改初始化数据
    Module.prototype.save = function(uri,meta) {
       var mod = Module.get(uri);
       console.log(mod)
       mod.uri = uri;
       mod.deps = meta.deps || [];
       mod.factory = meta.factory;
       mod.status = status.SAVED;
    }

    // 
    Module.prototype.exec = function() {
        var module = this;
        // 防止重复执行
        if (module.status >= status.EXECUTING) {
            console.log(module.exports)
            return module.exports;
        }
        module.status = status.EXECUTING;
        var uri = module.uri;

        function require(id) {
            return  Module.get(require.resolve(id)).exec(); // 获取接口对象
        }

        require.resolve = function(id) {
            return startUp.resolve(id,uri)
        }
        // define中的callback
        var factory = module.factory;
        // 模块中没使用require() --> factory()就返回undefined  --> exports = module.exports;
        var exports = isFunction(factory) ? factory(require, module.exports={}, module) :factory;
        if ( exports === undefined ) {
            exports = module.exports;
        }
        module.exports = exports;
        module.status = status.EXECUTED; // 6
        return exports;
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
        var deps;
        if (isFunction(factory)) {
            // 正则解析依赖项
            deps = parseDependencies(factory.toString());
        }
        // 存储当前模块的信息
        var meta = {
            id:"",
            uri:"",
            deps:deps,
            factory:factory
        }
        anonymousMeta = meta;
    }

    // 检测缓存对象上是否有当前模块信息
    Module.get = function(uri,deps) {
        return cache[uri] || ( cache[uri] = new Module(uri,deps) )
    }

    Module.use = function(deps,callback,uri) {
        var m = Module.get(uri, isArray(deps) ? deps : [deps] );
        // console.log(m)
        // 所有模块都加载完毕
        m.callback = function() {
            var exports = []; // 所有依赖项模块的接口对象
            var uris = m.resolve();
            for (var i = 0;i < uris.length; i++ ) {
                console.log(cache[uris[i]])
                exports[i] = cache[uris[i]].exec(); // 获取模块对外定义的接口对象
            }
            if (callback) {
                callback.apply(global,exports)
            }
        }
        m.load();
    }


    var _cid = 0;

    function cid() {
        return _cid ++
    };


    // 获取当前项目文档的URL
    data.cwd = document.URL.match(/[^?]*\//)[0];
    Module.preload = function(callback) {
        var preloadMods = data.preload || [],
            length = data.preload.length;
        // length !== 0 先加载预先设定模块
        if( length) {
            Module.use(preloadMods,function() {
                preloadMods.splice(0,length); // 置空数组
                callback();

            }, data.cwd + '_preload' + cid() ); //虚拟的根目录
        } else {
            callback();
        }
    }

    startUp.use = function(list,callback) {
        // 检测有没有预先加载的模块
        Module.preload(function() {
            Module.use(list,callback,data.cwd + "_use_" + cid() ); //虚拟的根目录
        })
    }

    startUp.config = function(options){
        for( var key in options ){
            data[key] = options[key]
        }
        
    }

    var REQUIRE_RE =  /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g

    function parseDependencies(code) {
        var ret = []
        code.replace( REQUIRE_RE, function(m,m1,m2) {
            if (m2) ret.push(m2);
        });
        return ret
    }

    global.define = Module.define
})(this)