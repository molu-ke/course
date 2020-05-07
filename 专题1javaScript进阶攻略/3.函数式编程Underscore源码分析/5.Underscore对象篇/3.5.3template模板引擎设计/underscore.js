(function (root) {
    var _ = {}

    // 默认风格   <%= %>插值   <%- %>字符串逃逸  <% %> javaScript代码
    _.template = function(templateString,settings){
        // 默认配置
        var RLUS = {
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g,
            expression: /<%([\s\S]+?)%>/g,
        }
        // extend ES6
        settings = Object.assign({},RLUS,settings)

        var matcher = new RegExp([
            settings.interpolate.source, // 正则转字符串
            settings.escape.source,
            settings.expression.source

        ].join("|"),"g")
        console.log("matcher:",matcher,"templateString:",templateString)

        var index = 0,
            source = "_p+='"
        templateString.replace(matcher,function(match,interpolate,escape,expression,offset){
            console.log(match,interpolate,escape,expression,offset)

            source += templateString.slice(index,offset).replace(/\n/g,function(){
                return "\\n" // 在浏览器渲染的时候才进行换行，拼接的时候不换行
            })
            index = offset + match.length
            // console.log(interpolate)
            // 字符串的拼接
            if(interpolate){
                source+="'+\n((_t=("+interpolate+")) == null ? '':_t)+\n'"
            } else if(escape){
                
            } else if(expression){
                source+="';\n"+expression+"\n_p+='"
            }
        })
        source+="';"
        source = "with(obj){\n"+source+"}"
        source = "var _t,_p='';"+source+"return _p;\n"
        console.log(source)
        /*
        渲染函数
        function render(){
            var _t,_p='';
            with(obj){
                _p+='hello '+((_t=( name )) == null ? '':_t)+'';
            }
            return _p;
        }
        */
        var render = new Function("obj",source)

        var compile = function(data){
            return render.call(null,data)
        }
        return compile
    }

    root._ = _
})(this)