const assert = require('assert') // 引入assert断言库
const fill = require('../async')

describe('mocha异步的用法', () => {

    it('读取文件', async () => {

        let r  = await fill()

        assert.strictEqual( r , 16 )
    })
    
})