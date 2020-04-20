(function(root){
    var _ = { }


    _.has = function(obj,key) {
        return obj !== null && obj.hasOwnProperty(key)
    }

    // 兼容IE < 9 
    // 在IE下创建了同名的属性(如list)，将不会被枚举
    var hasEnumbug =  ({toString:null}).propertyIsEnumerable('toString') // 正常会返回true 但ie下不会
    var list = ['constructor','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','toLocaleString','toString','valueOf','','','','','','','','','','','']
    _.keys = function(obj) {
        var result = [],
            name,prop
        if( !_.isObject(obj) ){
            return []
        }
        if(Object.keys){
            return Object.keys(obj)
        }
        for (name in obj) {
            result.push(name)
        }
        if(!hasEnumbug){
            for(var i = 0; i<list.length; i++){
                prop = list[i]
                if(obj[prop] !== Object.prototype[prop]){
                    result.push(prop)
                }
            }
        }
        return result
    }

    _.invert = function(obj){
        var result = {},
            keys = _.keys(obj)
        for(var i = 0; i<keys.length;i++){
            result[obj[keys[i]]] = keys[i]
        }
        return result
    }

    var createAssigner = function(keysFunc, defaults) {
        return function(obj) {
          var length = arguments.length;
          if (defaults) obj = Object(obj);
          if (length < 2 || obj == null) return obj;
          for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
              var key = keys[i];
              if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
          }
          return obj;
        };
    }

    _.extend = createAssigner(_.allKeys)

    _.extendOwn = _.assign = createAssigner(_.keys)

    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };
    
      _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };




    _.isObject = function(obj){
        return toString.call(obj) === "[object Object]"
    }

    root._ = _

})(this)