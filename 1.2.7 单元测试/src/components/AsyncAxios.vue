<template>
  <button @click="fetchResults">{{ value }}</button>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        value:'点击'
      }
    },

    methods: {
      async fetchResults() {
        const response = await axios.post('https://jy.xixi.top/schoolservice/api/v1/schoolAdmin/common/listRegion')
        console.log("_______+++++++++++",response.data.errcode)
        this.value = response.data.errcode
      }
    }
  }
</script>