import Vue from 'vue'
import Counter from '@/components/counter.vue'
import { expect } from 'chai';
import { mount  } from '@vue/test-utils'

describe('测试Counter.vue',() => {
    it('点击按钮后，count的值会+1处理',() => {
        // 获取DOM
        const Constructor = Vue.extend(Counter);   // 实例
        const vm = new Constructor().$mount()// vue挂载
        // 获取button元素
        const button = vm.$el.querySelector('button')
        // 摸拟点击事件
        const clickE = new window.Event('click') // 生成点击事件
        button.dispatchEvent(clickE)// 绑定事件
        vm._watcher.run()// 监听事件
        // 断言
        expect(Number(vm.$el.querySelector('span').textContent)).to.equal(1)
    })
})


describe('测试vue-test-unit的用例',() => {
    it('获取元素并断言值是否一致',() => {
        // 获取元素
        const wrapper = mount(Counter)
        const h3 = wrapper.find('h3')
        expect(h3.text()).to.equal('counter.vue')
    })  
})