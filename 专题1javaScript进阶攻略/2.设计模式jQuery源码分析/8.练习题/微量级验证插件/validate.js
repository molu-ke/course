(function(root,plugName){

    // 校验规则  微引擎
    var RULES = {
        "email":function(){
            var regRex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
            return regRex.test(this.val())
        },
        "mobile":function(){
            var regRex = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/
            return regRex.test(this.val())
        },
        "landline":function(){
            var regRex = /^([0-9]{3,4}-?)?[0-9]{7,8}$/
            return regRex.test(this.val())
        },
    }

    $.fn[plugName] = function(options) {
        if (!this.is('form')) {
            return;
        }
        var __def__ = {
            initEvent:'input',
            sign:'dv',
            error:'输入不合法，请认真检查'
        }

        var settings = $.extend({}, __def__ , options)

        var keynote = this.find('input');
        keynote.on(settings.initEvent, function(){
            var _this = $(this),
                e;
            _this.next("span").remove()
            $.each(RULES, function(key,func){
                var configName = _this.data(settings.sign + "-" + key)
                if(configName){
                    var result = func.call(_this)
                    if(!result){
                        e = _this.data(settings.sign + "-" + key + "-error") || settings.error
                        _this.after("<span style='color:red'>*"+e+"</span>")
                    } else {
                        console.log('success')
                    }
                }
            })


        })

    }

    $.fn[plugName]['expand'] = function(options){
        $.extend(RULES,options)
    }

})(this,'validata')