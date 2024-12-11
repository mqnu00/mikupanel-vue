<template>
  <el-menu
    class="sidebar"
    default-active="/"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#409EFF"
    router
  >
    <!-- 概览 -->
    <el-menu-item index="/">
      <el-icon style="vertical-align: middle">
        <House />
      </el-icon>
      <span>概览</span>
    </el-menu-item>

    <!-- 应用商店 -->
    <el-menu-item index="/app-store">
      <el-icon style="vertical-align: middle">
        <Grid />
      </el-icon>
      <span>应用商店</span>
    </el-menu-item>

    <!-- 网站 -->
    <el-sub-menu index="3">
      <template #title>
        <el-icon style="vertical-align: middle">
          <Grid />
        </el-icon>
        <span>网站</span>
      </template>
      <el-menu-item index="/website/option1">选项 1</el-menu-item>
      <el-menu-item index="/website/option2">选项 2</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { House, Grid } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'SideBar',
  components: {
    House,
    Grid,
  },
});
</script>

<style scoped>


.sidebar {
  height: 100vh;
  width: 220px;
  background-color: #001529;
  color: white;
}

.el-icon {
  font-size: 16px; /* 控制图标大小 */
  margin-right: 10px; /* 图标和文字间距 */
}

.el-menu-item.is-active > .el-icon {
  color: #409EFF; /* 选中状态的
  图标颜色 */
}

/* span {
  font-family: 'Roboto', sans-serif;
} */

</style>
