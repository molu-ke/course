function Transform(element,attr,val){
    let units = {}, // 单 位
        transform = "", 
        transforms = {},// 默认值
        attrs = ['scale','scaleX','rotate','translate'];
        attrs.forEach( attr => {
            if( attr.indexOf('scale') >= 0 ){
                units[attr] = ''
                transforms[attr] = 1
            }else{
                units[attr] = attr.indexOf('translate') >= 0 ? 'px':'deg';
                transforms[attr] = 0;
            }
    
            Object.defineProperty(element,attr,{
                get:function(){
                    return transforms[attr]
                },
                set:function(value){
                    transform = '';
                    transforms[attr] = value;
                    attrs.forEach( attr => {
                        transform +=attr + "(" + transforms[attr] + units[attr] + ")";
                    })
                   
                    element.style.transform = transform
                }
            })
        })
    if(val){
       return  element[attr] = val
    } else {
        return element[attr]
    }    
}