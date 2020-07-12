<template>
  <div id="app">
    <HelloWorld ref='helloWorld'/>
    <mixin/> 
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import mixin from "./components/mixin.vue"

export default {
  name: 'App',
  components: {
    HelloWorld,
    mixin
  },
  // 依赖注入
  provide(){
    return {
      getData:this.getData
    }
  },
  mounted(){
    // 访问根实例
    console.log(this.$root.foo);

    // 访问子组件实例或子元素
    this.$refs.helloWorld.getHelloWorld()
  },
  methods:{
    getApp(){
      console.log('父组件实例')
    },
    getData(){
      console.log('获取数据')
    },
  }
}
</script>

<style>

</style>
