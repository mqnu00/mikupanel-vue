<template>
  <!-- <InstallPlugin :component-config-client="componentConfigClient as ComponentConfigClient"></InstallPlugin> -->
  <!-- 内容区域 -->
  <n-layout style="width: 100%; height: 100%; position: relative;">
    <n-layout-header class="header" style="position: absolute; top: 0; left: 0; right: 0; height: 60px;">
      <n-space>
        <el-button @click="installPluginOpen">
          加载组件
        </el-button>
        <el-button :disabled="isUninstallDisabled" @click="uninstallComponent">
          卸载组件
        </el-button>
      </n-space>
    </n-layout-header>
    <div style="position: absolute; top: 60px; left: 0; right: 0; bottom: 0; overflow: auto;">
      <n-layout>
        <el-table 
        ref="multipleTableRef" 
        :data="componentConfigStore.componentConfig" 
        row-key="name"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          >
          <el-table-column type="selection" width="50" />
          <el-table-column label="插件名称">
            <template #default="scope">
              <span class="clickable-text">
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column property="version" label="插件版本" />
          <el-table-column property="type" label="插件类型" />
        </el-table>
      </n-layout>
    </div>
  </n-layout>
  <el-dialog v-model="installPluginVisible" title="加载插件" width="50vw" :before-close="installPluginClose">
    <InstallPlugin :component-config-client="componentConfigClient as ComponentConfigClient"></InstallPlugin>
  </el-dialog>
  
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { ComponentConfigClient } from './ComponentConfigClient';
import InstallPlugin from './InstallPlugin.vue';
import { useComponentConfigStore } from '@/store/useComponentConfigStore';

export default defineComponent({
  name: 'ComponentConfig',
  components: {
    InstallPlugin,
  },
  setup() {
    const componentConfigClient = ref(new ComponentConfigClient());
    const componentConfigStore = useComponentConfigStore()
    const multipleTableRef = ref<any>(null);
    const isUninstallDisabled = ref(true);
    const selectedRows = ref([]);
    const installPluginVisible = ref(false);
    // 初始化客户端
    componentConfigClient.value.init();

    // 处理选中状态变化
    const handleSelectionChange = (selection: any) => {
      selectedRows.value = selection
      if (selectedRows.value.length == 0) {
        isUninstallDisabled.value = true
      } else {
        isUninstallDisabled.value = false
      }
      console.log(selectedRows.value.length)
      console.log(isUninstallDisabled.value)
    };

    const uninstallComponent = () => {
      componentConfigClient.value.uninstallComponent(selectedRows.value)
    }

    const installPluginClose = () => {
      installPluginVisible.value = false
    }

    const installPluginOpen = () => {
      installPluginVisible.value = true
    }

    // 在组件挂载时可以执行一些操作（如果需要）
    onMounted(() => {
      console.log('ComponentConfig component mounted');
    });

    onUnmounted(() => {
      componentConfigClient.value.close()
    })

    return {
      multipleTableRef,
      componentConfigClient,
      componentConfigStore,
      isUninstallDisabled,
      installPluginVisible,
      handleSelectionChange,
      uninstallComponent,
      installPluginClose,
      installPluginOpen
    };
  }
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

button {
  margin-top: 10px;
  margin-right: 10px;
}
</style>