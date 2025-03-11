<template>
      <n-layout has-sider style="width: 100vw; height: 100vh; ">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
          style="height: 100vh; "
        >
          <n-menu
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>
        
        <n-layout>
          <n-layout-header class="header">
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
          <n-layout >
            
            <router-view></router-view>
          </n-layout>
            
            <!-- <n-card>
              <h1>内容区域1</h1>
            </n-card>
            <n-card>
              <h1>内容区域2</h1>
            </n-card> -->
        </n-layout>
      </n-layout>
  </template>
  
  <script lang="ts">
  import { RouterLink } from 'vue-router'
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
  
  function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }
  
  const menuOptions: MenuOption[] = [
    {
      label: "且听风吟",
      key: "hear-the-wind-sing",
      icon: renderIcon(BookIcon),
    },
    {
      label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/terminal'
          }
        },
        { default: () => '终端' }
      ),
    key: 'go-to-work',
    icon: renderIcon(BookIcon)
    },
    {
      label: "1973年的弹珠玩具",
      key: "pinball-1973",
      icon: renderIcon(BookIcon),
      disabled: true,
      children: [
        {
          label: "鼠",
          key: "rat",
        },
      ],
    },
    {
      label: "寻羊冒险记",
      key: "a-wild-sheep-chase",
      disabled: true,
      icon: renderIcon(BookIcon),
    },
    {
      label: "舞，舞，舞",
      key: "dance-dance-dance",
      icon: renderIcon(BookIcon),
      children: [
        {
          type: "group",
          label: "人物",
          key: "people",
          children: [
            {
              label: "叙事者",
              key: "narrator",
              icon: renderIcon(PersonIcon),
            },
            {
              label: "羊男",
              key: "sheep-man",
              icon: renderIcon(PersonIcon),
            },
          ],
        },
        {
          label: "饮品",
          key: "beverage",
          icon: renderIcon(WineIcon),
          children: [
            {
              label: "威士忌",
              key: "whisky",
            },
          ],
        },
        {
          label: "食物",
          key: "food",
          children: [
            {
              label: "三明治",
              key: "sandwich",
            },
          ],
        },
        {
          label: "过去增多，未来减少",
          key: "the-past-increases-the-future-recedes",
        },
      ],
    },
  ];
  
  export default defineComponent({
    setup() {
      const collapsed = ref(false);
      const activeKey = ref<string | null>(null);
  
      // 切换侧边栏的展开/折叠
      function toggleCollapsed() {
        collapsed.value = !collapsed.value;
      }
  
      // 返回首页
      function goHome() {
        console.log("返回首页");
        // 可以在这里添加路由跳转逻辑，例如：
        // this.$router.push("/");
      }
  
      return {
        collapsed,
        activeKey,
        menuOptions,
        renderIcon,
        toggleCollapsed,
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
    height: 60px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #eaeaea;
  }
  </style>