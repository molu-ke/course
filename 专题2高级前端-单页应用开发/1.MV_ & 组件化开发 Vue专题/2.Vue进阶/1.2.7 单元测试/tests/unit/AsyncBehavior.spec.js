import { mount } from '@vue/test-utils'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import AsyncBehavior from '@/components/AsyncBehavior.vue'

jest.mock('axios', () => ({
    post: ()=>Promise.resolve({data:{errcode:401}})
 }))


const wrapper = mount(AsyncBehavior)

describe('来自Vue的更新(Vue 会异步的将未生效的 DOM 批量更新)', () => {
    it('await', async () => {
        expect(wrapper.text()).toContain('0')
        const button = wrapper.find('button.add')
        await button.trigger('click')
        expect(wrapper.text()).toContain('1')
    })

    it('await Vue.nextTick()', async () => {
        expect(wrapper.text()).toContain('1')
        const button = wrapper.find('button.add')
        button.trigger('click')
        await Vue.nextTick()
        expect(wrapper.text()).toContain('2')
    })
})

describe('来自外部行为的更新', () => {
    // it('真正的axios请求', async done => {
    //     const button = wrapper.find('button.require')
    //     button.trigger('click')
    //     wrapper.vm.$nextTick( () => {
    //         setTimeout(()=>{
    //             expect(button.text()).toBe(401)
    //         })
    //         done()
    //     })
    // })

    it('jest mock模拟异步', async done => {
        const button = wrapper.find('button.require')
        button.trigger('click')
        wrapper.vm.$nextTick(() => {
            setTimeout(()=>{
                expect(button.text()).toBe(401)
            })
            done()
        })
    })


})