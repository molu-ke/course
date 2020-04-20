// 测试责任链
import api from './js/async.js'

mocha.setup('bdd')

let expect = chai.expect

describe('测试异步代码', () => {

    it('callback' , () => {
        
        api.getDataCallback( data => {
            expect(data.errcode).to.eql(500)
        })
        
    })

    it('promise' , () => {
      
        api.getDataAaync().then( data => {
            expect(data.errcode).to.eql(500)
        })

    })

    it('async/await' ,async () => {
      
        let data = await api.getDataAaync()
        expect(data.errcode).to.eql(500)

    })
})


describe('mock接口', () => {

    it('使用spy获取接口调用信息' , () => {

        let ajaxSpy = sinon.spy($,'ajax')

        api.getDataCallback( data => {
            expect( data.errcode ).to.eql(500)
        })

        console.log(ajaxSpy.callCount)

        sinon.assert.calledOnce(ajaxSpy)
        ajaxSpy.restore()

    })

    it('使用stub替换接口调用方法' , () => {
        
        let ajaxStub = sinon.stub($,'ajax')

        api.getDataCallback()

        console.log(ajaxStub.callCount)

        ajaxStub.restore()
    })

    it('使用spy+stub替换接口调用方法' , () => {

        let ajaxStub = sinon.stub($,'post')
        ajaxStub.yields()

        let callback = sinon.spy( () => {
            console.log('mock的回调')
        })
        api.getDataPost(callback)

        console.log(ajaxStub.callCount)
        console.log(callback.callCount)

        ajaxStub.restore()

    })

})


mocha.run()