import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouterTest from '@/components/VueRouterTest.vue'
import VueRouter from 'vue-router'


describe('配合 Vue Router 使用', () => {

    it('在测试中安装 Vue Router', () => {
        const localVue = createLocalVue()
        localVue.use(VueRouter)
        const router = new VueRouter()

        const wrapper = shallowMount(VueRouterTest, {
            localVue,
            router
        })

    })

    it('伪造 $route 和 $router', () => {
        const $route = {
            path: '/some/path'
        }

        const wrapper = shallowMount(VueRouterTest, {
            mocks: {
                $route
            }
        })

        expect(wrapper.vm.$route.path).toBe('/some/path')
    })
})