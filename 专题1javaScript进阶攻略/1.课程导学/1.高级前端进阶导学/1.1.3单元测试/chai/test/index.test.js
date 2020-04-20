const chai = require('chai')
const sum = require('../index')

describe('chai断言库', () => {

    // 一、BDD
    // expect
    it('expect语法', () => {
        chai.expect( sum(0) ).to.eql(0)
    })

    // should
    it('should语法', () => {
        let should = chai.should()
        sum(1).should.eql(1)
    })

    // 二、TDD
    // assert
    it('assert语法', () => {
        chai.assert.equal( sum(1,2) , 3 )
    })

})