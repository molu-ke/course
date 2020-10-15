import Vue from 'vue'
import Counter from '@/components/counter.vue'
import CounterChild from '@/components/CounterChild.vue'
import { expect } from 'chai';
import { mount } from '@vue/test-utils'

describe('网易云例子', () => {
    it('点击按钮后，count的值会+1处理', () => {
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

    it('获取元素并断言值是否一致', () => {
        // 获取元素
        const wrapper = mount(Counter)
        const h3 = wrapper.find('h3')
        expect(h3.text()).to.equal('counter.vue')
    })
})

// describe('Vue Test Utils官方例子', () => {

//     // 现在挂载组件，你便得到了这个包裹器
//     const wrapper = mount(Counter, {
//         // 仿造Prop
//         propsData: {
//             foo: 'some value'
//         },
//         mocks: {
//             // 在挂载组件之前 添加仿造的 `$route` 对象到 Vue 实例中
//             $route: {
//                 path: '/',
//                 hash: '',
//                 params: { id: '123' },
//                 query: { q: 'hello' }
//             }
//         }
//     })

//     it('挂载组件', () => {
//         // 获取Vue 实例
//         const vm = wrapper.vm
//     })

//     it('测试组件渲染出来的 HTML', () => {
//         expect(wrapper.html()).contains('<span>0</span>')
//     })

//     it('检查已存在的元素', () => {
//         const button = wrapper.find('button')
//         expect(button.exists()).to.be.true
//     })

//     it('模拟用户交互', () => {
//         expect(wrapper.vm.count).to.equal(0)
//         const button = wrapper.find('button')
//         button.trigger('click')
//         expect(wrapper.vm.count).to.be.equal(1)
//     })

//     it('使用 nextTick 与 await', async () => {
//         expect(wrapper.vm.count).to.equal(1)
//         const button = wrapper.find('button')
//         await button.trigger('click')
//         expect(wrapper.vm.count).to.be.equal(2)
//     })

//     it('从子组件触发事件', async () => {
//         await wrapper.find(CounterChild).vm.$emit('custom')
//         expect(wrapper.html()).contains('Emitted!')
//     })

//     it('仿造Prop', () => {
//         expect(wrapper.vm.foo).to.be.equal('some value')
//     })

//     it('操作组件状态', async () => {
//         await wrapper.setData({ count: 10 })
//         expect(wrapper.vm.count).to.be.equal(10)

//         await wrapper.setProps({ foo: 'bar' })
//         expect(wrapper.vm.foo).to.be.equal('bar')
//     })

// })