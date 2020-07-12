<template>
  <div class="todoInput">
    <input type="text" v-model="value" placeholder="请输入课程"> <button @click="add">新增</button>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: 'todoInput',
  props: {
    msg: String
  },
  data(){
    return {
      id:1,
      value:''
    }
  },
  methods:{
    ...mapMutations(['onAddTode']),
    add(){
      let item = {
        value:this.value,
        id:++this.id
      }
      this.value = ''

      // this.$store.dispatch('onAddTode',item)
      this.onAddTode(item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
