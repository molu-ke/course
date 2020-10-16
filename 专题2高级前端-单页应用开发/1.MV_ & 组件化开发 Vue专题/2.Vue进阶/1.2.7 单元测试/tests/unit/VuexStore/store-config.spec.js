import Vuex from 'vuex'
import { cloneDeep } from 'lodash' // 浅克隆
import { createLocalVue } from '@vue/test-utils'
import storeConfig from '@/components/VuexStore/store-config'

test('increments "count" value when "increment" is committed', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(storeConfig))
  expect(store.state.count).toBe(0)
  store.commit('increment')
  expect(store.state.count).toBe(1)
})

test('updates "evenOrOdd" getter when "increment" is committed', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(storeConfig))
  expect(store.getters.evenOrOdd).toBe('even')
  store.commit('increment')
  expect(store.getters.evenOrOdd).toBe('odd')
})