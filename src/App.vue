<template>
  <div class="app">
    <Sidebar /> 
    <div class="content">
      <router-view /> 
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from './components/SideBar.vue';

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
  },
});
</script>

<style>

body, #app {
  background-color: #000; /* 设置背景为黑色 */
  color: white; /* 确保文字颜色为白色可见 */
  margin: 0;
  height: 100vh; /* 占满视口高度 */
}

.app {
  display: flex; /* 设置主布局为flex */
  height: 100vh; /* 让内容填满视口高度 */
  overflow: hidden;
  background-color: black;
}

.content {
  flex: 1; /* 主内容区域占满剩余空间 */
  padding: 20px; /* 内容区域内边距 */
  overflow-y: auto; /* 让内容可以滚动 */
  background-color: #f5f5f5; /* 主内容背景色 */
}
</style>
