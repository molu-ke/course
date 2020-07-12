<template>
  <div id="app">
    <todoInput></todoInput>
    <todoList></todoList>
    <div>我想学的课程数量:{{getTodosLength}}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import todoInput from './components/todo-input.vue'
import todoList from './components/todo-list.vue'

export default {
  name: 'App',
  components: {
    todoInput,
    todoList
  },
  computed:{
    ...mapGetters(['getTodosLength'])
  }
}
</script>

<style>

</style>
