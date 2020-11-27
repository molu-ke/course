
(function(){
    function $my(classes){
        return document.querySelector(classes);
    }
    // 获取外框
    let list  = $my(".list-wrapper");
    // 右侧导航
    let indexListNav = $my(".index-list-nav");
    // 外部容器
    let indexListContent = $my(".index-list-content");
    // 获取ui所有li
    let indexLists = indexListContent.children[1].children;

    let indexListFixed = $my(".index-list-fixed");
    // li
    let indexListNavs = indexListNav.querySelectorAll("li");


    let indexList = new BScroll(list,{
        // 事件派发
        probeType:3
    })

    indexList.on('scroll',e => {
        let y = -e.y;
        if(y < indexLists[0].offsetTop){
            setNav(0);
            indexListFixed.style.display = 'none'
            return 
        }
        indexListFixed.style.display = 'block'

        // 滚动距离是否大于当前项，并且小于下一项 是的话 就说明在当前项
        for(let i = 0; i < indexLists.length - 1;i++){
            if(y >= indexLists[i].offsetTop &&  y < indexLists[i+1].offsetTop){
                setNav(i);
                indexListFixed.innerHTML = indexLists[i].children[0].innerHTML;
                return
            }
        }

        // 最后一项不满足  i+1 了
        setNav(indexLists.length - 1);
        indexListFixed.innerHTML = indexLists[indexLists.length - 1].children[0].innerHTML;
    })

    indexListNav.addEventListener('touchstart',e => {
        setIndex(e.changedTouches[0].clientY)
        
    })

    indexListNav.addEventListener('touchmove',e => {
        setIndex(e.changedTouches[0].clientY)
    })

    // 设置坐标
    function setIndex(y){
        let index = getIndex(y);
        if(index < 0 || index > 8){
            // 不是我想找的元素
            return
        }
        setNav(index)
        indexList.scrollToElement(indexLists[index],100)
    }

    // 获取坐标  定位当前元素
    function getIndex(y){
        // getBoundingClientRect 用于获取某个元素相对于视窗的位置集合
        let navTop = indexListNav.getBoundingClientRect().top;
        let h = 18;
        let index = parseInt((y-navTop)/h); // 转化0-8
        return index;
    }

    // 设置右侧导航
    function setNav(index){
        indexListNavs.forEach( li => {
            li.classList.remove('active');
        })
        indexListNavs[index].classList.add('active')
    }

})();