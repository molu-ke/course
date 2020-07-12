import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 隔离变化  约定优于配置
export default new Vuex.Store({
    state:{
        todos:[
            {id:0,value:'vuejs开发'}
        ]
    },
    getters:{
        getTodosLength(state){
            return state.todos.length
        }
    },
    mutations:{
        onDelTodo(state,id){
           state.todos = state.todos.filter( item => item.id !== id)
        },
        onAddTode(state,item){
            state.todos.push(item)
        }
    },
    actions:{
        onDelTodo(context,id){
            context.commit('onDelTodo',id)
        },
        onAddTode(context,item){
            context.commit('onAddTode',item)
        }
    }
})