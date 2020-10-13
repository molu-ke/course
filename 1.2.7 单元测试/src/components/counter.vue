<template>
  <div>
      <h3>counter.vue</h3>
      <span>{{count}}</span>
      <button @click="increase">自增</button>
  </div>
</template>

<script>
export default {
    data(){
        return {
            count:0
        }
    },
    methods:{
        increase(){
            this.count++
        }
    }
}
</script>

<style>

</style>