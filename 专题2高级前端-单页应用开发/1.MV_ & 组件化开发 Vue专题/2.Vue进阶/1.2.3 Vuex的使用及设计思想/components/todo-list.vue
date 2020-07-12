<template>
  <div class="todoList">
      <ul>
        <li v-for="(item) of todos" :key = 'item.id'>
          {{item.value}} <button @click="del(item.id)">删除</button>
        </li>
      </ul>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
export default {
  name: 'todoList',
  data(){
    return {
      // todos:this.$store.state.todos
    }
  },
  mounted(){

},
  computed:{
    ...mapState(['todos'])
  },
  methods:{
    ...mapActions(['onDelTodo']),
    del(id){
      // this.$store.dispatch('onDelTodo',id)
      this.onDelTodo(id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
