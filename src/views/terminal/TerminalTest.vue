<template>
  <el-container style="height: 100%; width: 100%;">
    <el-aside width="200px" class="fixed-aside">
      <h2>232</h2>
    </el-aside>
    <el-container>
      <el-header class="fixed-header">Header</el-header>
      <el-main class="scrollable-main">
        <h1>123</h1>
        <TerminalView></TerminalView>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.fixed-header {
  position: fixed;
  top: 0;
  left: 200px;
  width: calc(100% - 200px);
  z-index: 1000;
}

.fixed-aside {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
}

.scrollable-main {
  margin-top: 60px;
  margin-left: 200px;
  overflow-y: auto;
  height: calc(100% - 60px);
}
</style>

<script lang="ts">
import TerminalView from './TerminalView.vue';


</script>