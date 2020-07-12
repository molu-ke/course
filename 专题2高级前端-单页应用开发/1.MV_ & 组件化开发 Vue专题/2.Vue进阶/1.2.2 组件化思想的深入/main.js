import Vue from 'vue'
import App from './App.vue'
import globalMixin from '@/mixin/global'

Vue.config.productionTip = false
globalMixin

new Vue({
  data(){
    return {
      foo:'根实例'
    }
  },
  render: h => h(App),
}).$mount('#app')
