(function (root) {

    var _ = {}

    _.now = Date.now


    // 节流函数
    _.throttle = function (func, wait, options) {
        var args,
            lastTime = 0,
            timeout = null

        if (!options) {
            options = {}
        }

        var later = function () {
            lastTime = options.leading === false ? 0 : _.now()
            timeout = null
            func.apply(null, args)
        }

        return function () {
            var now = _.now()
            args = arguments
            // 禁用：立即调用
            if (!lastTime && options.leading === false) {
                lastTime = now
            }
            // 立即执行
            var remaning = wait - (now - lastTime)
            // remaning > 0 不能执行    remaning <= 0  能执行
            if (remaning <= 0) {
                if (timeout) {
                    clearTimeout(timeout)
                    timeout = null
                }
                lastTime = now
                console.log(1)
                func.apply(null, args)
            } else if (!timeout && options.trailing !== false) {
                console.log(2)
                timeout = setTimeout(later, remaning)
            }

        }
    }

    // 防抖函数
    _.debounce = function (func, wait, immediate) {
        var args, timeout, lastTime
        var later = function () {
            var last = _.now() - lastTime
            console.log(last)
            if (last < wait) {
                timeout = setTimeout(later, wait - last)
            } else {
                timeout = null
                if (!immediate) {
                    func.apply(null, args)
                }
            }
        }


        return function () {
            var args = arguments
            lastTime = _.now()

            var callNow = immediate && !timeout
            if (!timeout) {
                timeout = setTimeout(later, wait)
            }


            if (callNow) {
                func.apply(null, args)
                args = null
            }
        }
    }



    root._ = _
})(this)