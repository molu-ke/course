<template>
  <div>
    <h3>counter.vue</h3>
    <span>{{ count }}</span>
    <button @click="increase">自增</button>
    <CounterChild @custom="onCustom" />
     <p v-if="emitted">Emitted!</p>
  </div>
</template>

<script>
import CounterChild from "@/components/CounterChild.vue";
export default {
  name: "counter",
  props:['foo'],
  data() {
    return {
      count: 0,
      emitted: false,
    };
  },
  methods: {
    increase() {
      this.count++;
    },
    onCustom() {
      this.emitted = true;
    },
  },
  components: { CounterChild },
};
</script>

<style>
</style>