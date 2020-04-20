(function (root) {
    var _ = {}


    _.pick = function(object,oiteratee,context) {
        var result = {}
        var iteratee,keys

        if (object == null){
            return result
        }

        if (_.isFunction(oiteratee)) {
            keys = Object.keys(object)
            // 生成一个迭代器
            iteratee = optimizeCb(oiteratee,context)
        } else {
            keys = [].slice.call(arguments,1)
            iteratee = function(value,key,object) {
                return key in object // 判断对象是否为数组/对象的元素/属性
            }
        }

        for(var i = 0; i<keys.length;i++){
            var key = keys[i],
                value = object[key]
            if(iteratee(value,key,object)) {
                result[key] = value
            }
        }

        return result
    }



    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function (value) {
                return func.call(context, value);
            };
            case 3: return function (value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    _.each = _.forEach = function(obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (toString.call(obj) === "[object Array]") {
          for (i = 0, length = obj.length; i < length; i++) {
            iteratee(obj[i], i, obj);
          }
        } else {
          var keys = _.keys(obj);
          for (i = 0, length = keys.length; i < length; i++) {
            iteratee(obj[keys[i]], keys[i], obj);
          }
        }
        return obj;
      };

     // 类型检测
     _.each(["Function","String","Object","Array","Number","Boolean","Arguments"],function(name){
        _["is"+name] = function(obj) {
            return toString.call(obj) === "[object " + name + "]"
        }
    })

    root._ = _
})(this)