(function(root){

    var ArrayProto = Array.prototype, 
        ObjProto = Object.prototype;

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
    
    var _ = function(obj){

        if (obj instanceof _) {
            return obj
        }
        if (!(this instanceof _)) {
            return new _(obj)
        }
        this._wrapped = obj
    }

    _.uniq =  _.unique = function(array,isSorted,iteratee,context) {
        // 没有传入 isSorted 参数
        if (!_.isBoolean(isSorted)) {
            context = iteratee
            iteratee = isSorted
            isSorted = false
        }
        if (iteratee != null){
            iteratee = cb(iteratee,context)
        }
        var result = [],
            seen // 用于过滤重复值

        for(var i = 0;i < array.length; i++) {
            var computed = iteratee ? iteratee(value,i,array):array[i]
            // 如果是有序数组，则当前元素只需跟上一个元素对比即可
            // 用 seen 变量保存上一个元素
            if(isSorted) {
                if (!i || seen !== computed ) result.push(computed)
                seen = computed
            } else if(result.indexOf(computed) === -1) {
                result.push(computed)
            }
        }

        return result
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

    _.map = function(obj,iteratee,context){
        // 生成不同功能迭代器
        var iteratee = cb(iteratee,context)
        // var iteratee =  function(value,index,obj) {
        //     return func.call(context,value,index,obj)   func ==> iteratee
        // }
        // 分辨obj是数组对象，还是object对象
        var keys = !_.isArray(obj) && Object.keys(obj)
        var length = (keys || obj).length
        var result = Array(length)
        for (var index = 0;index < length;index++) {
            var currentKey = keys ? keys[index] : index
            result[index] = iteratee(obj[currentKey],index,obj)
        }

        return result
    }

    var cb = function(iteratee,context,count) {
        if (iteratee == null) {
            return _.identity
        }
        if (_.isFunction(iteratee)) {
            return optimizeCb(iteratee,context,count)
        }
    }

    // optimizeCb优化迭代器
    var optimizeCb = function(func,context,count){
        if(context == void 0) {
            return func
        }

        switch (count == null ? 3 :count) {
            case 1:
                return function(value) {
                    return func.call(context,value)
                }
            case 3:
                return function(value,index,obj) {
                    return func.call(context,value,index,obj)
                }
            case 4:
                return function(memo,value,index,obj){
                    return func.call(context,memo,value,index,obj)
                }
        }
    }

    // 默认迭代器
    _.identity = function(value) {
        return value
    }

    _.restArguments = function(func){
        // rest参数位置     
        var startIndex = func.length - 1  //  func.length  获取func函数有多少个参数
        return function() {
            var length = arguments.length - startIndex
                rest = Array(length),
                index = 0
            // rest数组中的成员  rest == [2,3,4]
            for (;index < length;index++) {
                rest[index] = arguments[index + startIndex]
            }
            // 非rest参数成员的值一一对应
            var args = Array(startIndex + 1)
            for(index = 0;index < startIndex;index++){
                args[index] = arguments[index]
            }
            args[startIndex] = rest
            return func.apply(this,args)
        }
    }

    var Ctor = function(){}

    // Object.create polyfill
    var baseCreate = function(prototype) {
        if(!_.isObject(prototype)) return {}
        if(Object.create) return Object.create(prototype)
        Ctor.prototype = prototype
        var result = new Ctor()
        Ctor.prototype = null
        return result
    }

    // dir === 1 => 从前往后找     dir === -1 =>  从后往前找
    function createPredicateIndexFinder(dir) {
        return function(array,predicate,context) {
            // if (iteratee == null) { return function(value) { return value }}
            predicate = cb(predicate,context)
            var length = array.length
            // 根据 dir 变量来确定数组遍历的起始位置
            var index = dir > 0 ? 0 :length - 1
            for(; index >= 0 && index < length; index += dir) {
                // 找到第一个符合条件的元素
                // 并返回下标值
                if (predicate(array[index],index,array)){
                    return index
                }
            }
            return -1
        }
    }

    _.findIndex = createPredicateIndexFinder(1)
    _.findLastIndex = createPredicateIndexFinder(-1)

    _.sortedIndex = function(array,obj,iteratee,context) {
        // if (iteratee == null) { return function(value) { return value }}
        iteratee = cb(iteratee,context,1)
        var value = iteratee(obj)
        var low = 0 ,
            high = array.length
        // 二分查找
        while (low < high) { 
            var mid = Math.floor((low + high) / 2 )
            if(iteratee(array[mid]) < value){ 
                low = mid + 1
            } else {
                high = mid
            }
        }
        return low
    }

    function createIndexFinder(dir , predicateFind , sortedIndex) {
        return function(array,item,idx) {
            var i = 0,
                length = array.length
            // 第三个参数true用二分查找优化  否则  遍历查找
            if(sortedIndex && _.isBoolean(idx) && length ) {
                // 能使用二分查找加速的条件
                // 用 _.sortedIndex 找到有序数组中  item 正好插入的位置
                idx = sortedIndex(array,item)  // 2
                return array[idx] === item ? idx : -1
            }

            // 特殊情况  如果要查找的元素是NaN类型  NaN != NaN
            if(item !== item ) {
                idx = predicateFind(slice.call(array,i,length),_.isNaN)
                return idx >= 0 ? idx + i : -1
            }   

            // 非上述情况正常遍历
            for (idx = dir > 0 ? i:length -1 ;idx >= 0 && idx < length;idx += dir) {
                if (array[idx] === item) return idx
            }
        }
    }


    // _.findIndex 特殊情况下的处理方案   NAN
    // _.sortedIndex  针对排序的数组做二分查找  优化性能
    _.indexOf = createIndexFinder(1,_.findIndex,_.sortedIndex)
    _.lastIndexOf = createIndexFinder(-1,_.findLastIndex)


    // 类型检测试
    _.isArray = function(array) {
        return toString.call(array) === '[object Array]'
    }

    _.isFunction = function(array) {
        return toString.call(array) === '[object Function]'
    }

    _.isObject = function(array) {
        return toString.call(array) === '[object Object]'
    }

    _.isBoolean = function(array) {
        return toString.call(array) === '[object Boolean]'
    }

    _.isNumber = function(array) {
        return toString.call(array) === '[object Number]'
    }

    _.isNaN = function(obj) {
        return _.isNumber(obj) && obj !== obj
    }

    var createReduce = function(dir){
        // 累加
        var reduce = function(obj,iteratee,memo,init) {
            var keys = !_.isArray(obj) && Object.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0:length - 1
            if(!init) {
                memo = obj[keys ? keys[index] : index]
                index += dir // 1
            }
            for(;index >= 0 && index < length; index += dir){
                var currntekey = keys ? keys[index] : index
                memo = iteratee(memo,obj[currntekey],currntekey,obj)
            }
            return memo
        }
        // memo 最终能累加换结果   每一冷累加的过程
        return function(obj,iteratee,memo,context) {
            var init = arguments.length >= 3
            return reduce(obj,optimizeCb(iteratee,context,4),memo,init)
        }
    }

    _.reduce = createReduce(1) // 1  -1

    // 返回一个函数的副本
    _.partial = function(func) {
        // 提取参数
        var args = [].slice.call(arguments,1) // [ 5 ]
        var bound = function() {
            var index = 0
            var length = args.length
            var ret = Array(length)
            for (var i = 0;i<length;i++) {
                ret[i] = args[i]
            }
            while (index < arguments.length) {
                ret.push(arguments[index++])
            }
            return func.apply(this,ret)
        }
        return bound
    }

    // 存储中间运算结果，提高效率   我搞不懂这个。。。。碰到递归就烦 -> _ ->
    // 参数hasher是个function通过返回值来记录key
    // _.memoize(function,[hashFunction])
    // 适用于需要大量重复求值的场景
    // 比如递归求解斐波那契数
    _.memoize = function(func,hasher) {
        var memoize = function(key) {
            // 储存变量，方便使用
            var cache = memoize.cache

            // 求key
            // 如果传入了hasher，则用hasher函数来记录key
            // 否则用参数key（memoize 方法传入的第一个参数）当key
            var address = '' + ( hasher ? hasher.apply(this,arguments) : key )
            // 如果这个key 还没被 求过值 先记录在缓存中
            if (!_.has(cache,address)){
                cache[address] = func.apply(this,arguments)
            }
            return cache[address]
        }

        // cache 对象被当做key-value键值对缓存中间运算结果
        memoize.cache = {}
        return memoize
    }

    var has = function(obj, path) {
        return obj != null && hasOwnProperty.call(obj, path);
    }

    _.has = function(obj, path) {
        if (!_.isArray(path)) {
          return has(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
          var key = path[i];
          if (obj == null || !hasOwnProperty.call(obj, key)) {
            return false;
          }
          obj = obj[key];
        }
        return !!length;
    }



    // predicate  真值检测（重点：返回值）
    _.filter = _.select = function(obj,predicate,context) {
        var results = []
        predicate = cb(predicate,context)
        _.each(obj,function(value,index,list) {
            if(predicate(value,index,list)) results.push(value)
        })
        return results
    }

    //去掉数组中所有的假值  _.identity = function(value){return value}
    _.computed = function(array) {
        return _.filter(array,_.identity)
    }

    // 返回某一个范围内的数值组成的数组
    _.range = function(start,stop,step) {
        if (stop == null) {
            stop = start || 0
            start = 0
        }
        step =step || 1
        // 返回数组的长度  返回大于等于参数x的最小整数  向上取整
        var length = Math.max( Math.ceil((stop - start) / step), 0)
        // 返回的数组
        var range = Array(length)
        for (var index = 0; index < length; index++,start += step){
            range[index] = start
        }
        return range
    }

    // 返回一个[min,max] 范围内的任意整数
    _.random = function(min,max) {
        if(max == null) {
            max = min
            min = 0
        }
        return min + Math.floor(Math.random() * (max - min+1))
    }

    _.clone = function(obj) {
        return _.isArray(obj) ? obj.slice() : _.extend({},obj)
    }

    // 返回乱序之后的数组副本
    _.shuffle = function(array){
        return _.sample(array,Infinity)
    }

    // 抽样函数
    _.sample = function(array,n){
        if(n == null){
            return array[_.random(array.length-1)]
        }
        var sample = _.clone(array),
            length = sample.length,
            last = length -1
        n = Math.max(Math.min(n,length),0)
        for(var index = 0;index < n ;index++){
            // 随机数  index
            var rand = _.random(index,last)
            // 交换
            var  temp = sample[index]
            sample[index] = sample[rand]
            sample[rand] = temp
        }
        return sample.slice(0,n)
    }

    _.flatten = function(array,shallow) {
        return flatten(array,shallow)
    }

    // 摊平数组
    var flatten = function(array,shallow) {
        var ret = [],
            index = 0
        for(var i = 0; i < array.length;i++) {
            var value = array[i] // 展开一次
            // if(_.isArray(value) || _.isArguments(value)) {
            if(_.isArray(value)) {
                // 递归全部展开
                if(!shallow) {
                    value = flatten(value,shallow) 
                }
                var j = 0,
                    len = value.length
                ret.length += len
                while( j < len ) {
                    ret[index++] = value[j++]
                }
            } else {
                ret[index++] = value 
            }
        }
        return ret
    }

    // 返回数组中除了最后一个元素外的其他全部元素，在arguments对象上特别 有用
    _.initial = function(array,n) {
        return [].slice.call(array,0,Math.max(0,array.length - (n == null ? 1: n)))
    }

    // 返回数组中除了第一个元素外的其他全部元素，传递n参数将返回从n开始的剩余所有元素
    _.ret = function(array,n) {
        return [].slice.call(array, n == null ? 1:n)
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