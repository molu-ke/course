// mocha默认会执行test目录下的所有测试  跟目录
const assert = require('assert') // 引入assert断言库
const sum = require('../sync')

describe('mocha同步的使用法', () => {

    // 钩子函数
    before( () => {
        console.log('before')
    })

    after( () => {
        console.log('after')
    })

    beforeEach( () => {
        console.log('beforeEach')
    })

    afterEach( () => {
        console.log('afterEach')
    })



    it('测试0', () => {
        assert.strictEqual( sum() , 0 )
    })

    it('测试1', () => {
        assert.strictEqual( sum(1) , 1 )
    })

    it('测试3', () => {
        assert.strictEqual( sum(1,2) , 3 )
    })

    it('测试6', () => {
        assert.strictEqual( sum(1,2,3) , 10 )
    })


})