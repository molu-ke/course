<template>
  <div class='mixin'>
    
  </div>
</template>

<script>
import mixin from "@/mixin";

/**
 * 这是混入的钩子函数
 * 这是组件的钩子函数
 * 混入 组件 共同数据--组件
 * 混入函数
 * 组件函数
 * 共同函数--组件
 */

export default {
  mixins: [mixin],

  data() {
    return {
      componentData: "组件",
      common: "共同数据--组件"
    };
  },

  created() {
    console.log("这是组件的钩子函数");
    console.log(this.mixinData, this.componentData, this.common);

    this.mixinFun();
    this.componenFun();
    this.commonFun();
  },

  methods: {
    componenFun() {
      console.log("组件函数");
    },
    commonFun() {
      console.log("共同函数--组件");
    }
  }
};
</script>

<style>
</style>