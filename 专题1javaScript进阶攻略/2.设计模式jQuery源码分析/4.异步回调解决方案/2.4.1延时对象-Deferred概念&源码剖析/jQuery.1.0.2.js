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

    // 共享原型对象
    jQuery.prototype.init.prototype = jQuery.fn

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

        // 类数组转化成正真的数组    还未学
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

        // $.callbacks用于管理函数队列
        callbacks:function(options){   
            
            // 先判断options是不是字符串，是的再判断在缓存中有木有，没的创建它     
            // options = { once:true,unique:true,stopOnFalse:true,memory:true }  
            options  = typeof options === 'string' ? (optionscache[options] || createOptions(options) ) : {}
            var list = []
            var index , length , testting , memory , start , starts
            var fire = function(data){
                memory = options.memory && data
                index = starts || 0
                start = 0
                testting = true
                length = list.length
                for(;index < length;index++){
                    if(list[index].apply(data[0],data[1]) === false && options.stopOnFalse){
                        break
                    }
                }
            }
            var self = {
                add:function(){
                    // 将类数组转为数组
                    var args = Array.prototype.slice.call(arguments)
                    start =  list.length
                    args.forEach( function(fn){
                       if( toString.call(fn) === '[object Function]'){
                            if(!options.unique || !self.has(fn)){
                                list.push(fn)
                            }
                       }
                    })
                    
                    if(memory){
                        starts = start
                        fire(memory)
                    }
                    return this
                },
                // 判断两个函数是否相等
                has:function(fn){
                    if(list){
                        var i = 0 ,
                            length = list.length
                        for( ;i<length;i++){
                            if( fn === list[i]){
                                return true
                            }
                        }
                    }
                    return false
                },
                // 指定上下文对象  this
                fireWith:function(context,arguments){
                    var args = [context,arguments]
                    if(!options.once || !testting ){
                        fire(args)
                    }
                },
                // 参数传递
                fire:function(){
                    self.fireWith(this,arguments)
                }
            }
            return self
        },

        // 异步回调解决方案
        Deferred:function(func){
            // 延迟对象的三种不同状态信息描述
            var tuples = [
                //状态  往队列中添加处理函数       创建队列       最终的状态信息描述
                ['resolve','done',jQuery.callbacks('once memory'),'resolved'],
                ['reject','fail',jQuery.callbacks('once memory'),'rejected'],
                ['notify','progress',jQuery.callbacks('emory')]
            ]
            state = 'pending'
            // promise -> state   then  promise 
            //            done   fail  progress  = list.add 添加处理函数 
            promise = {
                state:function(){
                    return state
                },
                then:function(){

                },
                promise:function(obj){
                    return obj != null ? jQuery.extend(obj,promise) : promise
                }
            }

            // 延迟对象  
            deferred = {}

            tuples.forEach(function(tuple,i){
                var list = tuple[2], // 创建一个队列  =>3  调用jQuery.callbacks  返回self
                    stateString = tuple[3] // 最终的状态信息描述

                // promise[ done | fail | progress ]  = list.add
                promise[tuple[1]] = list.add

                if(stateString){
                    list.add(function(){ // 添加第一个处理程序
                        // state = [ resolved |  rejected]
                        state = stateString
                    })
                }

                // resolve  reject   notify  
                deferred[tuple[0]] = function(){
                    deferred[tuple[0]+'With'](this === deferred ? promise : this , arguments)
                    return this
                }
                // resolveWith  rejectWith  notifyWith  
                // 执行队列 调用队列中的处理函数并且给他们传参  绑定执行时上下文对象
                deferred[tuple[0]+'With'] = list.fireWith
            })

            // promise(添加 add) + deferred(调用 fire)  对象的合并  12个方法
            promise.promise(deferred)

            return deferred
        },

        when:function(subordinate){
            return subordinate.promise()
        }
    })

    function createOptions(options){
        var object = optionscache[options] = {}
        options.split(/\s+/).forEach( function(value){
            object[value] = true // object.once = true
        })
        return object
    }

    root.$ = root.jQuery = jQuery // 既能用$调用，也能用JQuery调用

})(this)    