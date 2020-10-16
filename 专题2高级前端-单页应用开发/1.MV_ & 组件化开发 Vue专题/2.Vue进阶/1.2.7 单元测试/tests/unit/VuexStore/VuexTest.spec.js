import { shallowMount, createLocalVue } from '@vue/test-utils'
import VuexTest from '@/components/VuexStore/VuexTest.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

// 
describe('配合 Vuex 使用', () => {
    let actions
    let getters
    let store

    // mocha 的钩子，会在每项测试it之前被调用
    beforeEach(() => {
        actions = {
            actionClick: jest.fn(),
            actionInput: jest.fn()
        }
        getters = {
            clicks: () => 2,
            inputValue: () => 'input'
        },
        store = new Vuex.Store({
            state: {},
            actions,
            getters
        })
    })

    // 伪造 Action 
    it('当输入事件值为input时，调度actionInput', () => {
        const wrapper = shallowMount(VuexTest, { store, localVue })
        const input = wrapper.find('input')
        input.element.value = 'input'
        input.trigger('input')
        expect(actions.actionInput).toHaveBeenCalled()
    })

    it('事件值不是input时不调度actionInput', () => {
        const wrapper = shallowMount(VuexTest, { store, localVue })
        const input = wrapper.find('input')
        input.element.value = 'not input'
        input.trigger('input')
        expect(actions.actionInput).not.toHaveBeenCalled()
    })

    it('单击按钮时调用存储操作actionClick', () => {
        const wrapper = shallowMount(VuexTest, { store, localVue })
        const button = wrapper.find('button')
        button.trigger('click')
        expect(actions.actionClick).toHaveBeenCalled()
    })

    // 伪造 Getter
    it('渲染”store.getters.inputValue“在第一个p标记中', () => {
        const wrapper = shallowMount(VuexTest, { store, localVue })
        const p = wrapper.find('p')
        expect(p.text()).toBe(getters.inputValue())
    })

    it('渲染”store.getters.clicks“在第二个p标记中', () => {
        const wrapper = shallowMount(VuexTest, { store, localVue })
        const p = wrapper.findAll('p').at(1)
        expect(p.text()).toBe(getters.clicks().toString())
    })
})

