(function(window){
    // 对外提供的接口
    function myMobile(selector){
        return myMobile.prototype._init(selector)
    }

    // 库构架设计-- 创建 、使用
    myMobile.prototype = {
        _init:function(selector){
            if(typeof selector === 'string') {
                this.ele = window.document.querySelector(selector)
                // this原型对象
                return this
            }
        },
        // 单击事件
        tap:function(handler){
            this.ele.addEventListener('touchstart',touchFn)
            this.ele.addEventListener('touchend',touchFn)
            // let 一个效率最高
            let startTime, endTime;
            function touchFn(e){
                switch (e.type){
                    case 'touchstart':
                        startTime = new Date().getTime();
                        break
                    case 'touchend':
                        endTime = new Date().getTime();
                        if(endTime - startTime < 200) {
                            handler.call(this,e)
                        }
                        break
                }
            }
        },
        // 长按事件
        longTap:function(handler){
            this.ele.addEventListener('touchstart',touchFn)
            this.ele.addEventListener('touchend',touchFn)
            this.ele.addEventListener('touchmove',touchFn)
            let timerId
            function touchFn(e){
                switch (e.type){
                    case 'touchstart':
                        timerId = setTimeout(function(){
                            handler.call(this,e)
                        },2000)
                        break
                    case 'touchmove':
                        clearTimeout(timerId)
                        break;
                    case 'touchend':
                        clearTimeout(timerId)
                        break
                }
            }
        },
        // 左侧滑动
        slideLeft:function(handler){
            this.ele.addEventListener('touchstart',touchFn)
            this.ele.addEventListener('touchend',touchFn)
            let startX,startY,endX,endY;
            function touchFn(e){
                let firstTouch = e.changedTouches[0];
                switch (e.type){
                    case 'touchstart':
                        startX = firstTouch.pageX
                        startY = firstTouch.pageY
                        break
                    case 'touchend':
                        endX = firstTouch.pageX
                        endY = firstTouch.pageY
                        // 判断是横向滑动还是坚向滑动
                        if( 
                            Math.abs(endX - startX) >= Math.abs(endY - startY)  
                            &&
                            startX - endX >= 25
                        ){
                            handler.call(this,e)
                        }
                        break
                }
            }

        }


    }

    window.$ = window.myMobile = myMobile
})(window)