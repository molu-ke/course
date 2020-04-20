(function(root){
    var optionscache = {}
    var _ = {
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
        }
    }

    function createOptions(options){
        var object = optionscache[options] = {}
        options.split(/\s+/).forEach( function(value){
            object[value] = true // object.once = true
        })
        return object
    }

    root._ = _
})(this)