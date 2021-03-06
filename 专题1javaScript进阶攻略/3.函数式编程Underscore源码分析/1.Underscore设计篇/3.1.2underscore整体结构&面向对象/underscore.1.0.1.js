(function(root){
    var push = Array.prototype.push;
    
    var _ = function(obj){

        if (obj instanceof _) {
            return obj
        }
        if (!(this instanceof _)) {
            return new _(obj)
        }
        this._wrapped = obj
    }

    _.unique = function(arr,callbacks) {
        var ret = []
        var target ,i = 0
        for(;i < arr.length; i++) {
            target = callbacks?callbacks(arr[i]):arr[i]
            if( ret.indexOf(target) === -1 ) {
                ret.push(target)
            }
        }
        return ret
    }

    // 开启链接式的调用
    _.chain = function(obj) {
        var instance = _(obj)
        instance._chain = true
        return instance
    }

    // 辅助函数
    var result = function(instance,obj) {
        return instance._chain ? _(obj).chain() : obj
    }

    _.prototype.value = function() {
        return this._wrapped
    }

    _.functions = function(obj) {
        var  key , result = []
        for (key in obj) {
            result.push(key)
        }
        return result
    }

    _.map = function(args){
        args.push('max')
        return args
    }

    // 类型检测试
    _.isArray = function(array) {
        return toString.call(array) === '[object Array]'
    }

    _.each = function(target,callback) {
        //  target => ["unique", "chain", "functions", "map", "isArray", "each", "mixin"]
        var key ,i = 0
        if (_.isArray(target)) {
            var length = target.length
            for (;i < length; i++) {
                callback.call(target , target[i] ,i)
            }
        } else {
            for (key in target) {
                callback.call(target,key,target[key])
            }
        }
    }

    // mixin
    _.mixin = function(obj) {
        _.each(_.functions(obj),function(name) { 
            var func = obj[name]
            _.prototype[name] = function() {
                var args = [this._wrapped]
                push.apply(args,arguments) // 数组合并
                // func.apply(this,args)  // 不支持链式调用
                return result(this,func.apply(this,args))
            }
        })
    }

    _.mixin(_)
    root._ = _
})(this)