<template>
  <div class="hello">
    <Deeper/>
  </div>
</template>

<script>
import Deeper from './Deeper'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted(){
    // 访问父级组件实例
    this.$parent.getApp();
  },
  methods:{
    getHelloWorld(){
      console.log('访问子组件实例或子元素')
    }
  },
   components: {
    Deeper
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>