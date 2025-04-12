<script setup lang="ts">
import Home from '@/views/home/index.vue'
</script>

<template>
  <!-- <h1>1123</h1> -->
   <!-- <TerminalView style="height: 100vh; width: 100vw;"></TerminalView> -->
   <Home></Home>
    <!-- <TerminalTest style="height: 1000px; width: 1000px;"></TerminalTest> -->
    <!-- <RouterView></RouterView> -->
</template>

<style lang="scss">
@import "@/styles/global.scss";
html, body{
  margin: 0;
  padding: 0;
  padding-left: 0;
}
#app{
  text-align:left;
  transform-origin: top left;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw
}
</style>
