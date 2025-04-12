<template>
 <!--  todo: 修改布局为absolute，出现了一些bug -->
  <n-layout has-sider style="width: 100vw; height: 100vh; position: relative;">
    <n-layout-sider
      bordered
      :width="240"
      style="height: 100vh; position: absolute; left: 0; top: 0;"
    >
      <n-menu
        v-model:value="activeKey"
        :options="menuOptions"
      />
    </n-layout-sider>

    <n-layout style="position: absolute; top: 0; left: 240px; right: 0; bottom: 0;">
      <!-- 固定在顶部的 n-layout-header -->
      <n-layout-header class="header" style="position: absolute; top: 0; left: 0; right: 0; height: 60px;">
        <n-space justify="space-between" style="width: 100%">
          <!-- 左侧按钮 -->
          <n-space>
            <n-button>左侧按钮1</n-button>
            <n-button>左侧按钮2</n-button>
          </n-space>
          <!-- 右侧按钮 -->
          <n-space>
            <n-button>右侧按钮1</n-button>
            <n-button>右侧按钮2</n-button>
          </n-space>
        </n-space>
      </n-layout-header>

      <!-- 内容区域 -->
      <div style="padding: 10px; position: absolute; top: 60px; left: 0; right: 0; bottom: 0; overflow: auto;">
        <router-view></router-view>
      </div>
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import "../../../plugins/test.js"
import { RouterLink } from 'vue-router';
import type { MenuOption } from "naive-ui";
import type { Component } from "vue";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
  ChevronForwardOutline as ExpandIcon,
  ChevronBackOutline as CollapseIcon,
  HomeOutline as HomeIcon,
} from "@vicons/ionicons5";
import { NIcon } from "naive-ui";
import { defineComponent, h, ref } from "vue";
import {LayoutClient} from "./LayoutClient"
import router from "@/router/index.js";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  methods: {
    
  },
  setup() {
    const activeKey = ref<string | null>(null);
    const menuOptions = ref<MenuOption[]>([])
    const layoutClient = ref<LayoutClient>(new LayoutClient())

    layoutClient.value.init(menuOptions, activeKey)

    function goHome() {
      console.log("返回首页");
      // 可以在这里添加路由跳转逻辑，例如：
      // this.$router.push("/");
    }

    onMounted(() => {
    })

    onUnmounted(() => {

      

      layoutClient.value.close()
    })

    return {
      activeKey,
      menuOptions,
      renderIcon,
      goHome,
      ExpandIcon,
      CollapseIcon,
      HomeIcon,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eaeaea;
}
</style>