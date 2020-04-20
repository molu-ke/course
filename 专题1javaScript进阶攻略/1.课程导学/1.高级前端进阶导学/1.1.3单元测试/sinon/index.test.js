const sinon = require('sinon')
const { assert } = require('chai')

// 在Node中使用jq
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);


function getData(user, callback){
    $.post('https://jy.xixi.top/schoolservice/api/v1/schoolAdmin/common/listRegion',user,callback)
 }  

 describe('sinon',() => {

    // 一、spy  提供了函数调用的信息，但不会改变其行为(记录每次被调用信息
    // it('spy', () => {

    //     let ajax = sinon.spy($,'post')

    //     getData({user:'ke'} , data => {
    //         console.log(data)
    //         assert.equal( data.errcode , 402)
    //     })

    //     console.log(ajax.callCount)

    //     // 判断是否回调了一次
    //     sinon.assert.calledOnce(ajax)

    //     ajax.restore()

    // })

    // 二、stub
    // 监听+模拟返回
    // it('stub 1', () => {

    //     const obj={
    //         func: num => {
    //            return num
    //         }
    //     }

    //     sinon.stub(obj,'func').returns(42)
    
    //     const result=obj.func(3); // 42

    //     assert.equal(result,43);

    // })

    // 替换ajax调用
    it('stub 2', () => {

    //     let ajax = sinon.stub($,'post')

    //     getData({user:'ke'} , () => {}) 

    //     ajax.restore()

    })

    // spu + stub  替换ajax调用并且模拟返回
    it('stub 3', () => {

        let ajax = sinon.stub($,'post')
        ajax.yields()

        // 使用间谍作为callback
        let callback = sinon.spy( () => {
            console.log('-----')
        } )

        getData({user:'ke'} , callback) 

        ajax.restore()
        
        sinon.assert.calledOnce(callback)
    })

    // 验证一个函数是否使用特定的参数
    // it('stub 4', () => {

    //     let ajax = sinon.stub($,'post')

    //     let url = 'https://jy.xixi.top/schoolservice/api/v1/schoolAdmin/common/listRegion'

    //     let params = {
    //         user:'ke'
    //     }

    //     getData({user:params.use},function(){})
        
    //     ajax.restore()

    //     sinon.assert.calledWith(ajax, url, params)

    // })


    // 三、mock
    // it('mock', () => {

    //     let API = { 
    //         method: function () {
    //             console.info("运行method")
    //         },
    //         func: function () {
    //             console.info("运行method")
    //         }
    //     };

    //     const mock = sinon.mock(API)

    //     mock.expects('method').once().returns(2)
    //     mock.expects('func').twice()

    //     API.method()
    //     API.func() 
    //     API.func() 

    //     mock.verify()
        
    // })
 })