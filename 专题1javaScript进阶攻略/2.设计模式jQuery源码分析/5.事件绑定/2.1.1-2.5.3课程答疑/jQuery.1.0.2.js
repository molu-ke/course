(function (root) {
    var testExp = /^\s*(<[\w\W]+>)[^>]*$/
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
    var version = "1.0.2"
    var optionscache = {}  // callbacks  临时

    function returnFalse() {
        return false
    }

    // activeElement属性返回文档中当前获得焦点的元素
    function safeActiveElement() {
        try {
            return document.activeElement
        } catch (err) { }
    }

    var jQuery = function (selector, context) {
        return new jQuery.prototype.init(selector, context)
    }

    jQuery.fn = jQuery.prototype = {
        length: 0,
        jquery: version,
        selector: "",
        init: function (selector, context) {
            context = context || document
            var match, elem, index = 0
            // $()  $(undefined)   $(null)  $(false)
            if (!selector) {
                return this
            }

            if (typeof selector === 'string') {
                if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
                    match = [selector]
                }
                // 创建DOM
                if (match) {
                    // 合并数组  object  [DOM节点]
                    jQuery.merge(this, jQuery.parseHTML(selector, context))
                } else {
                    // 查询DOM节点
                    elem = document.querySelectorAll(selector) // 类数组
                    // Array.prototype.slice.call(arguments)能将具有length属性的对象(key值为数字)转成数组  类数组 ==> 数组
                    var elems = Array.prototype.slice.call(elem)
                    this.length = elems.length
                    for (; index < elems.length; index++) {
                        this[index] = elems[index]
                    }
                    this.context = context
                    this.selector = selector
                }

            } else if (selector.nodeType) { // 对象(document this  windows)
                this.context = this[0] = selector
                this.length = 1
                return this
            } else if (jQuery.isFunction(selector)) {
                // 自己写的代码  参考jquery1.7.2  还缺ready和bindReady函数  2019-11-26
                var root = jQuery(context)
                return root.ready !== undefined ? root(selector) : selector(jQuery)
            }
        },
        css: function () {

        }
    }

    // extend
    jQuery.fn.extend = jQuery.extend = function () {
        var target = arguments[0] || {}
        var length = arguments.length
        var i = 1
        var deep = false
        var option, name, copy, src, copyIsArray, clone
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1]
            i = 2
        }
        if (typeof target !== "object") {
            target = {}
        }
        // 参数的个数
        if (length === i) {
            target = this
            i--
        }

        // 浅拷贝 深拷贝
        for (; i < length; i++) {
            if ((option = arguments[i]) != null) {
                for (name in option) {
                    // console.log('key:',name,'----','value:',option[name])∫
                    copy = option[name]
                    src = target[name]
                    if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && jQuery.isArray(src) ? src : []
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {}
                        }
                        target[name] = jQuery.extend(deep, clone, copy)
                    } else if (copy != undefined) {
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
        expando: 'jQuery' + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ''),
        guid: 1,//计数器 
        now: Date.now, // 返回当前时间距离时间零点(1970年1月1日 00:00:00 UTC)的毫秒数
        // 类型检测
        isPlainObject: function (obj) {
            return toString.call(obj) === '[object Object]'
        },
        isArray: function (obj) {
            return toString.call(obj) === '[object Array]'
        },
        isFunction: function (fn) {
            return toString.call(fn) === '[object Function]'
        },

        // 类数组转化成正真的数组
        markArray: function (arr, results) {
            var ret = results || []
            if (arr != null) {
                jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr)
            }
            return ret
        },

        // 合并数组     this [dom节点]
        merge: function (first, second) {
            var l = second.length, // 1
                i = first.length, // 0
                j = 0

            if (typeof l === 'number') {
                for (; j < l; j++) {
                    first[i++] = second[j]
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++]
                }
            }
            first.length = i
            return first
        },

        // 创建HTML节点     <a>    document
        parseHTML: function (data, context) {
            if (!data || typeof data != 'string') {
                return null
            }
            // 过滤掉 '<a>' => 'a'
            var parse = rejectExp.exec(data)
            return [context.createElement(parse[1])]
        },

        // $.callbacks用于管理函数队列
        callbacks: function (options) {

            // 先判断options是不是字符串，是的再判断在缓存中有木有，没的创建它     
            // options = { once:true,unique:true,stopOnFalse:true,memory:true }  
            options = typeof options === 'string' ? (optionscache[options] || createOptions(options)) : {}
            var list = []
            var index, length, testting, memory, start, starts
            var fire = function (data) {
                memory = options.memory && data
                index = starts || 0
                start = 0
                testting = true
                length = list.length
                for (; index < length; index++) {
                    if (list[index].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        break
                    }
                }
            }
            var self = {
                add: function () {
                    // 将类数组转为数组
                    var args = Array.prototype.slice.call(arguments)
                    start = list.length
                    args.forEach(function (fn) {
                        if (toString.call(fn) === '[object Function]') {
                            if (!options.unique || !self.has(fn)) {
                                list.push(fn)
                            }
                        }
                    })

                    if (memory) {
                        starts = start
                        fire(memory)
                    }
                    return this
                },
                // 判断两个函数是否相等
                has: function (fn) {
                    if (list) {
                        var i = 0,
                            length = list.length
                        for (; i < length; i++) {
                            if (fn === list[i]) {
                                return true
                            }
                        }
                    }
                    return false
                },
                // 指定上下文对象  this
                fireWith: function (context, arguments) {
                    var args = [context, arguments]
                    if (!options.once || !testting) {
                        fire(args)
                    }
                },
                // 参数传递
                fire: function () {
                    self.fireWith(this, arguments)
                }
            }
            return self
        },

        // 异步回调解决方案
        Deferred: function (func) {
            // 延迟对象的三种不同状态信息描述
            var tuples = [
                    //状态  往队列中添加处理函数       创建队列       最终的状态信息描述
                    ['resolve', 'done', jQuery.callbacks('once memory'), 'resolved'],
                    ['reject', 'fail', jQuery.callbacks('once memory'), 'rejected'],
                    ['notify', 'progress', jQuery.callbacks('emory')]
                ],
                state = 'pending',
                // promise -> state   then  promise 
                //            done   fail  progress  = 对应list.add 添加处理函数 
                // 权限分配只有add  添加callback
                promise = {
                    state: function () {
                        return state
                    },
                    then: function () { // fnDone  fnFail  fnProgress
                        var fns = [].slice.call(arguments)
                        // 创建一个Deferred延迟对象 返回一个promise对象 
                        return jQuery.Deferred(function (newdefer) {
                            tuples.forEach(function (tuple, i) {
                                var fn = jQuery.isFunction(fns[i]) && fns[i]
                                /*
                                  deferred 通过闭包去访问  此处链式接用时指向的deferred对象
                                  newdefer 通过参数传递 指向新创建的deferred对象
                                 */
                                // console.log(fn)
                                deferred[tuple[1]](function () {
                                    var returndefer = fn && fn.apply(this, arguments)
                                    if (returndefer && jQuery.isFunction(returndefer.promise)) {
                                        returndefer.done(newdefer.resolve)
                                            .fail(newdefer.reject)
                                            .progress(newdefer.notify)

                                    }
                                })
                            })
                        }).promise()
                    },
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise
                    }
                },

                // 延迟对象  
                deferred = {}

            tuples.forEach(function (tuple, i) {
                var list = tuple[2], // 创建一个队列  =>3  调用jQuery.callbacks  返回self
                    stateString = tuple[3] // 最终的状态信息描述

                // promise[ done | fail | progress ]  = list.add
                promise[tuple[1]] = list.add

                if (stateString) {
                    list.add(function () { // 添加第一个处理程序
                        // state = [ resolved |  rejected]
                        state = stateString
                    })
                }

                // resolve  reject   notify  
                deferred[tuple[0]] = function () {
                    // console.log(this,deferred,promise)
                    deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments)
                    return this
                }
                // resolveWith  rejectWith  notifyWith  
                // 执行队列 调用队列中的处理函数并且给他们传参  绑定执行时上下文对象
                deferred[tuple[0] + 'With'] = list.fireWith
            })

            // promise(添加 add) + deferred(调用 fire)  对象的合并  12个方法
            promise.promise(deferred)

            // 新创建的deferred对象
            if (func) {
                func.call(deferred, deferred)
            }

            return deferred
        },

        when: function (subordinate) {
            return subordinate.promise()
        },

        /**
         * object 目标源
         * callback  回调函数
         * args   自定义回调函数参数
         */
        each: function (object, callback, args) {
            // console.log(object,callback,args)
            // object   数组对象 || object对象
            var length = object.length
            var name, i = 0

            // 自定义callback参数
            if (args) {
                if (length === undefined) {
                    for (name in object) {
                        callback.apply(object, args)
                    }
                } else {
                    for (; i < length;) {
                        callback.apply(object[i++], args)
                    }
                }
            } else {
                if (length === undefined) {
                    for (name in object) {
                        callback.call(object, name, object[name])
                    }
                } else {
                    for (; i < length;) {
                        callback.call(object[i], i, object[i++])
                    }
                }
            }
        }
    })

    function Data() {
        // jQuery.expando是jQuery的静态属性，对于jQuery的每次加载运行期间时唯一的随机数
        this.expando = jQuery.expando + Math.random()
        // 缓存对象
        this.cache = {}
    }


    Data.uid = 1;

    Data.prototype = {
        key: function (elem) {
            var descriptor = {},
                unlock = elem[this.expando] // <div id="box"></div>[jQuery102093881699983413220.37598373945761576]
            if (!unlock) {
                unlock = Data.uid++ // 1
                descriptor[this.expando] = { // 钥匙 { jQuery102093881699983413220.37598373945761576 : { value:1 } }
                    value: unlock
                }


                // 方法直接在一个对象上定义一个或多个新的属性或修改现有属性，并返回该对象
                // DOM   jQuery102093881699983413220.37598373945761576 = 1
                Object.defineProperties(elem, descriptor)
            }

            // 确保缓存对象记录信息
            if (!this.cache[unlock]) {
                this.cache[unlock] = {} // 数据
            }

            return unlock
        },
        get: function (elem, key) {
            // 找到或者创建缓存
            var cache = this.cache[this.key(elem)] //  { events:{},handle:function(){} }
            // key 有值直接在缓存中取读
            return key === undefined ? cache : cache[key]
        }
    }

    var data_priv = new Data()

    // jQuery 事件模块
    jQuery.event = {
        // 1、利用data_priv数据缓存，分离事件与数据   2、元素与缓存中建立guid的映射关系用于查找
        add: function (elem, type, handler) {
            // console.log(elem,type,handler)
            var eventHandle, events, handlers
            // 事件缓存
            var elemData = data_priv.get(elem)

            // 检测handler是否存在ID(guid)如果没有那么传给他一个ID
            // 添加ID的目的是用来寻找或者删除相应的事件
            if (!handler.guid) {
                handler.guid = jQuery.guid++  // guid == 1
            }

            /**
             * 给缓存增加事件处理句柄
             * elemData = {
             *     events:
             *     handle:
             * }
             */
            // 同一个元素，不同事件，不重复绑定
            if (!(events = elemData.events)) {
                events = elemData.events = {}
            }
            if (!(eventHandle = elemData.handle)) {
                // Event 对象代表事件的状态 通过apply状态
                eventHandle = elemData.handle = function (e) {
                    return jQuery.event.dispatch.apply(eventHandle.elem, arguments)
                }
            }

            eventHandle.elem = elem
            // 通过events存储同一个元素上的多个事件
            if (!(handlers = events[type])) { // {events:{click:[]}}
                handlers = events[type] = []
                handlers.delegateCount = 0 // 有多少事件代理默认0
            }
            handlers.push({
                type: type,
                handler: handler,
                guid: handler.guid,
            })
            //  添加事件
            if (elem.addEventListener) {
                elem.addEventListener(type, eventHandle, false)
            }

        },

        // 修复事件对象event 从缓存体中的events对象取得对应队列
        dispatch: function (event) {
            // IE兼容性处理如：event.target or event.srcElement(扩展阅读)
            // event = jQuery.event.fix(event)

            // 提取当前元素在cache中的events属性值
            var handlers = (data_priv.get(this, 'events') || {})[event.type] || []
            event.delegateTarget = this
            var args = [].slice.call(arguments) // 把类数组转为数组
            // console.log(args)

            // 执行事件处理函数
            jQuery.event.handlers.call(this, handlers, args)
        },

        // 执行事件处理函数
        handlers: function (handlers, args) { //  args = [event,自定义参数]
            handlers[0].handler.apply(this, args)
        },

        fix: function (event) {
            if (event[jQuery.expando]) {
                return event
            }

            var i, prop, copy,
                type = event.type,
                originalEvent = event,
                fixHook = this.fixHooks[type]

            if (!fixHook) {
                this.fixHooks[type] = fixHook =
                    rmouseEvent.test(type) ? this.mouseHooks :
                        rkeyEvent.test(type) ? this.keyHooks : {}
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props

            event = new jQuery.event(originalEvent)

            i = copy.length

            while (i--) {
                prop = copy[i]
            }


        },

        special: {
            load: {
                noBubble: true
            },
            focus: {
                // 执行默认focus方法
                trigger: function () {
                    if (this !== safeActiveElement() && this.focus) {
                        this.focus()
                        return false
                    }
                },
                delegateType: 'focusin'
            },
            blur: {
                trigger: function () {
                    if (this !== safeActiveElement() && this.blur) {
                        this.blur()
                        return false
                    }
                },
                delegateType: 'focusout'
            },
            click: {
                trigger: function () {
                    if (this.type === 'checkbox' && this.click && jQuery.nodeName(this, 'input')) {
                        this.click()
                        return false
                    }
                },
                _default: function (event) {
                    return jQuery.nodeName(event.target, 'a')
                }
            },
            beforeunload: {
                postDispatch: function (event) {
                    if (event.result !== undefined) {
                        event.originalEvent.returnValue = event.result
                    }
                }
            }
        },

        // event 规定指定元素上要触发的事件，可以是自己定义事件，或者任何标准事件
        // data  传递到事件处理程序的额外参数
        // elem  Element对象
        trigger: function (event, data, elem) {
            var i, cur, tmp, bubbleType, ontype, hadnle,
                i = 0,
                eventPath = [elem || document], // 规划冒泡路线
                type = event.type || event,
                cur = tmp = elem = elem || document,
                // 证明是ontype绑定事件
                ontype = /^\w+$/.test(type) && 'on' + type

            // 模拟事件对象   如果有jQuery.expando说明event已经是模拟的事件对象
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === 'object' && event)
            // console.log(event)  { jQuery102029482768751975286: true,timeStamp: 1575526801918,type: "createEvent"} 

            // 定义event.target属性
            if (!event.target) {
                event.target = elem
            }
            // 如果没有传入了参数，就把event存储在数组中  有传递合并数组
            // 如之前所看到：data可选，传递到事件处理程序的额外参数。注意：事件处理程序第一个参数默认是event（此为出处）
            data = data == null ? [event] : jQuery.markArray(data, [event])

            // 事件类型是否需要进行特殊处理
            special = jQuery.event.special[type] || {}
            // 如果事件类型已经有trigger方法，就调用它
            if (special.trigger && special.trigger.apply(elem, data) === false) {
                return
            }
            // 自己已经在冒泡路线中 不重复添加
            cur = cur.parentNode
            // 查找当前元素的父元素 添加到eventPath(规划冒泡路线)数组中
            // 当tmp为document时，cur为空，就退出循环
            for (; cur; cur = cur.parentNode) {
                eventPath.push(cur)
                tmp = cur
            }

            if (tmp === (elem.ownerDocument || document)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window) // 模拟冒泡到window对象
            }
            // console.log(eventPath)

            // 沿着上面规划好的冒泡路线，把经过的元素节点的指定类型事件的回调逐一触发执行
            while ((cur = eventPath[i++])) {
                // 先判断在缓存系统中是否有此元素绑定的此事件类型的回调方法，如果有，就取出来
                handle = (data_priv.get(cur, 'events') || {})[event.type] && data_priv.get(cur, 'handle')
                if (handle) {
                    // console.log(handle ,data)
                    handle.apply(cur, data)
                }
            }

        }

    }

    // 模拟Event对象
    jQuery.Event = function (src, props) {
        // console.log(src,props)  createEvent  false
        // 创建一个jQuery.Event实例对象
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props)
        }
        // 事件类型
        this.type = src
        // 如果传入事件没有时间戳，则创建时间戳
        this.timeStamp = src && src.timeStamp || jQuery.now()
        // jQuery.Event实例对象标记
        this[jQuery.expando] = true
    }

    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        // 取消事件的默认动作
        preventDefault: function () {
            var e = this.originalEvent
            this.isDefaultPrevented = returnTrue
            if (e && e.preventDefault) {
                e.preventDefault()
            }
        },
        // 方法阻止事件冒泡到父元素，阻止任何父事件处理程序被执行
        stopPropagation: function () {
            var e = this.originalEvent
            this.isPropagationStopped = returnTrue
            if (e && e.stopPropagation) {
                e.stopPropagation()
            }
        }
    }

    jQuery.fn.extend({
        each: function (callback, args) {
            return jQuery.each(this, callback, args)
        },

        on: function (types, fn) {
            var type
            if (typeof types === 'object') {
                for (type in types) {
                    this.on(types[type], fn)
                }
            }
            return this.each(function () {
                // this element对象
                jQuery.event.add(this, types, fn)
            })
        },

        // 语法：data可选，传递到事件处理程序的额外参数  注意：事件处理程序第一个参数默认是event
        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this)
            })
        }

    })

    function createOptions(options) {
        var object = optionscache[options] = {}
        options.split(/\s+/).forEach(function (value) {
            object[value] = true // object.once = true
        })
        return object
    }

    root.$ = root.jQuery = jQuery // 既能用$调用，也能用JQuery调用

})(this)    