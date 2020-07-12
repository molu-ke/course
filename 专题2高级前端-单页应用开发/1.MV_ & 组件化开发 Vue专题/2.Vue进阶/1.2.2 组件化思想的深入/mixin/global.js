// 全局混入
import Vue from 'vue'

let global = {
    data(){
        return {
            mixinData:'全局混入'
        }
    },

    created(){
        console.log('全局混入钩子函数')
    }
}

Vue.mixin(global)