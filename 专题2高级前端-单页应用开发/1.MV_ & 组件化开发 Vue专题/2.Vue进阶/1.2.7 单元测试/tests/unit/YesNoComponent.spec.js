import { mount } from '@vue/test-utils'
import YesNoComponent from '@/components/YesNoComponent.vue'
import sinon from 'sinon'

describe('鼠标点击示例', () => {
    it('使用yes按钮调用yes', () => {
      const spy = sinon.spy()
      const wrapper = mount(YesNoComponent, {
        propsData: {
          callMe: spy
        }
      })
      wrapper.find('button.yes').trigger('click')
  
    //   spy.should.have.been.calledWith('yes')
    })
  })