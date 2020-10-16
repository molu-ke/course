<template>
  <div class="text-align-center">
    <h1>vuex</h1>
    <input type="text" @input="actionInputIfTrue" />
    <button @click="actionClick()">Click</button>

    <p v-if="inputValue">{{inputValue}}</p>
    <p v-if="clicks">{{clicks}}</p>

  </div>
</template>

<script>
  import { mapGetters,mapActions  } from 'vuex'

  export default {
    methods: {
      ...mapActions(['actionClick']),
      actionInputIfTrue: function actionInputIfTrue(event) {
        const value = event.target.value
        if (value === 'input') {
          this.$store.dispatch('actionInput', { value })
        }
      }
    },
    computed: mapGetters(['clicks', 'inputValue'])
  }
</script>