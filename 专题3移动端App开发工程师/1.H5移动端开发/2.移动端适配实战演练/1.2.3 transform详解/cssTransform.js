/// 元素   属性   具体值
function cssTransform(ele,attr,val){
    if(!ele.transform){
        ele.transform = {}
    }

    // 取值阶段
    if(typeof val === 'undefined'){
        if(typeof ele.transform[attr] === 'undefined' ) {
            switch(attr){
                case 'scale':
                    ele.transform[attr] = 1
                    break;
                default:
                    ele.transform[attr] = 0
            }
        } 
        return ele.transform[attr]
    } else {
        // 赋值阶段
        ele.transform[attr] = val
        let transformVal = ""
        for(let s in ele.transform) {
            switch(s){
                case 'scale':
                case 'scaleX':
                    transformVal += " " + s + "(" + (ele.transform[s]) + ")";
                    break;
                case 'rotate':
                case 'rotateX':
                    transformVal += " " + s + "(" + (ele.transform[s]) + "deg)";
                    break;
                default:
                    transformVal += " " + s + "(" + (ele.transform[s]) + "px)";
                    
            }
        }
        ele.style.transform = ele.style.webkitTransform = transformVal
    }
}