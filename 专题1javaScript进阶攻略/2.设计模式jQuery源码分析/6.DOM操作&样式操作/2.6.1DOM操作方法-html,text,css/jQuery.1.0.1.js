(function(root){
    var testExp = /^\s*(<[\w\W]+>)[^>]*$/
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
    var version = "1.0.1" 
    var optionscache = {}  // callbacks  临时

    var jQuery = function(selector,context){
        return new jQuery.prototype.init(selector,context)
    }

    jQuery.fn = jQuery.prototype = {
        length:0,
        jquery:version,
        selector:"",
        init: function(selector,context){
            context = context || document
            var match,elem,index = 0
            // $()  $(undefined)   $(null)  $(false)
            if(!selector){
               return this
            }

            if(typeof selector === 'string'){
                if( selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3 ){
                    match = [selector]
                }
                // 创建DOM
                if(match){
                    // 合并数组  object  [DOM节点]
                    jQuery.merge(this, jQuery.parseHTML(selector,context))
                } else {
                // 查询DOM节点
                    elem = document.querySelectorAll(selector) // 类数组
                    // Array.prototype.slice.call(arguments)能将具有length属性的对象(key值为数字)转成数组  类数组 ==> 数组
                    var elems = Array.prototype.slice.call(elem)
                    this.length = elems.length
                   for(;index < elems.length;index++){
                       this[index] = elems[index]
                   }
                   this.context = context
                   this.selector = selector
                }
                
            } else if(selector.nodeType){ // 对象(document this  windows)
                this.context = this[0] = selector
                this.length = 1
                return this
            } else  if( jQuery.isFunction(selector)){
                // 自己写的代码  参考jquery1.7.2  还缺ready和bindReady函数  2019-11-26
                var root = jQuery(context)
                return root.ready !== undefined?root(selector):selector(jQuery)
            } 
        },
        css: function(){

        }
    }

    // 共享原型对象
    jQuery.fn.init.prototype = jQuery.fn

    // extend
    jQuery.fn.extend = jQuery.extend = function(){
        var target = arguments[0] || {}
        var length = arguments.length
        var i = 1
        var deep = false
        var option , name , copy , src , copyIsArray , clone
        if( typeof target === "boolean"){
            deep = target
            target = arguments[1]
            i = 2
        }
        if( typeof target !== "object"){
            target = {}
        }
        // 参数的个数
        if(length === i){
            target = this
            i--
        }

        // 浅拷贝 深拷贝
        for(; i < length ; i++){
           if((option =  arguments[i]) != null){
            for( name in option){
                // console.log('key:',name,'----','value:',option[name])∫
                copy = option[name]
                src = target[name]
                if(deep && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) )){
                    if(copyIsArray){
                        copyIsArray = false
                        clone = src && jQuery.isArray(src)?src:[]
                    } else {
                        clone = src && jQuery.isPlainObject(src)?src:{}
                    }
                    target[name] = jQuery.extend(deep,clone,copy)
                }else if(copy != undefined){
                    target[name] = option[name]
                }
            }
           }  
        }
        return target
    }

    // 调用extend方法
    jQuery.extend({
        // 类型检测
        isPlainObject:function(obj){
            return toString.call(obj) === '[object Object]'
        },
        isArray:function(obj){
            return toString.call(obj) === '[object Array]'
        },
        isFunction:function(fn){
            return toString.call(fn) === '[object Function]'
        },

        // 类数组转化成正真的数组
        markArray:function(arr,results) {
            var ret = results || []
            if(arr != null) {
                jQuery.merge(ret,typeof arr === 'string'?[arr]:arr)
            }
            return ret
        },

        // 合并数组     this [dom节点]
        merge:function(first,second){
            var l = second.length, // 1
                i = first.length, // 0
                j = 0

            if(typeof l === 'number') {
                for(;j<l;j++){
                    first[i++] = second[j]
                }
            } else {
                while (second[j] !== undefined ) {
                    first[i++] = second[j++]
                }
            }
            first.length = i
            return first
        },

        // 创建HTML节点     <a>    document
        parseHTML:function(data,context){
            if(!data || typeof data != 'string'){
                return null
            }
            // 过滤掉 '<a>' => 'a'
            var parse = rejectExp.exec(data)
            return [context.createElement(parse[1])]
        },

        access:function(elems,callback,key,value){
            var len = elems.length
            var testing = key === null
            var cache,chain  // chain是否开启链式调用
            if(jQuery.isPlainObject(key) && key !== null){
                chain = true
                for(var name in key ){
                    jQuery.access(elems,callback,name,key[name])
                }
            }
            if( value !== undefined ){
                chain = true
                // 如何去处理
                if(testing){
                    cache = callback
                    callback = function(key,value){
                        // 增强
                        cache.call(this,value)
                    }
                }
                for(var i = 0;i<len;i++){
                    callback.call(elems[i],key,value)
                }
            }
            return  chain?elems:testing ? callback.call(elems[0],value):callback.call(elems[0],key,value)
        },

        text:function(elem){
           var nodeType = elem.nodeType
           if(nodeType===1 || nodeType === 9 || nodeType === 11){
               return elem.textContent
           }
        },

        content:function(elem,value){
            var nodeType = elem.nodeType
            if(nodeType===1 || nodeType === 9 || nodeType === 11){
               elem.textContent = value
            }
        },

        style:function(elem,key,value){
            if(!elem || elem.nodeType===3 || !elem.style){
                return
             }
            elem.style[key] =value
        }

    })

    jQuery.fn.extend({
        text:function(value){
            // 假设
            return jQuery.access(this,function(value){
                return value === undefined ? jQuery.text(this) : jQuery.content(this,value)
            },null,value)
        },
        css:function(key,value){
            return jQuery.access(this,function(key,value){
                var CSSStyleDeclaration , len ,map = {}
                if(jQuery.isArray(key)){
                    CSSStyleDeclaration = window.getComputedStyle(this)
                    len = key.length
                    for(var i = 0;i<len;i++){
                        map[key[i]] = CSSStyleDeclaration.getPropertyValue(key[i])
                    }
                    return map
                }

                return value !== undefined ? jQuery.style(this,key,value):
                                             window.getComputedStyle(this).getPropertyValue(key)||undefined
            },key,value)
        }
    })

    root.$ = root.jQuery = jQuery // 既能用$调用，也能用JQuery调用

})(this)    