<template>
  <div>
    <button @click="onLeft">A</button>
    <button @click="onRotateLeft">W</button>
    <button @click="onRotateRight">S</button>
    <button @click="onRight" accesskey="D">D</button>
    <button @click="onNextPiece" accesskey=" ">Space</button>
    <button @click="onDebug">Debug</button>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Controls',
    props: {
      onDebug: {},
      onLeft: {},
      onNextPiece: {},
      onRight: {},
      onRotateLeft: {},
      onRotateRight: {}
    }
  });
</script>
<style scoped>
</style>
