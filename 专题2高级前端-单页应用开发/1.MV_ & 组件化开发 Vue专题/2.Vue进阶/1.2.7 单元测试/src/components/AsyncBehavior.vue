<template>
  <div>
    <span>{{ count }}</span>
    <button class="add" @click="increase">自增</button>
    <button class="require" @click="fetchResults">{{ value }}</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      count:0,
      value: "点击",
    };
  },

  methods: {
    increase() {
      this.count++;
    },
    async fetchResults() {
      const response = await axios.post( "https://jy.xixi.top/schoolservice/api/v1/schoolAdmin/common/listRegion");
      this.value = response.data.errcode;
      console.log('请求回来数据',this.value)
    },
  },
};
</script>

