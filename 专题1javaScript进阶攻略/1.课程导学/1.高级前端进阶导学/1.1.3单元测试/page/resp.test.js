// 测试责任链
import { approve } from './js/resp.js'

mocha.setup('bdd')

let expect = chai.expect
chai.should()
let assert = chai.assert

describe('测试责任链', () => {

    it('amount < 5' , () => {
        
        expect( approve({amount:3}) ).to.eql('主任审批通过')
        approve({amount:3}).should.eql('主任审批通过')
        assert.equal( approve({amount:3}),'主任审批通过' )

    })

    it('amount < 10' , () => {
        approve({amount:8}).should.eql('副董事长审批通过') 
    })

    it('amount < 50' , () => {
        approve({amount:30}).should.eql('董事长审批通过') 
    })

    it('amount >= 80' , () => {
        approve({amount:100}).should.eql('董事会审批通过') 
    })

    it('amount no' , () => {
        approve({amount:'ok'}).should.eql('无人可审批此金额[ok]采购单') 
    })
})


mocha.run()