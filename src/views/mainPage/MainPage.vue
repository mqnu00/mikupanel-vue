<template>
    <n-space vertical>
        <div class="system-info">
            <!-- <h1>系统信息</h1> -->
            <div v-for="(value, key) in systemInfo" :key="key" class="info-item">
                <div class="info-label">{{ key }}</div>
                <div class="info-value">{{ value }}</div>
            </div>
        </div>
    </n-space>
    
  </template>
  
  <script lang="ts">
import { SysInfoMainClient } from './MainPageClient';

  
  export default defineComponent({
    name: 'MainPage',
    setup() {
      const systemInfo = ref({
      });

      const sysInfoMainClient = ref(new SysInfoMainClient())
  
      onMounted(() => {
        // 这里可以执行组件挂载后的逻辑，如果需要的话

        sysInfoMainClient.value.init(systemInfo)
        sysInfoMainClient.value.getSysInfo()
      });

      onUnmounted(() => {
        sysInfoMainClient.value.close()
      })
  
      return {
        systemInfo,
      };
    },
  });
  </script>
  
  <style scoped>
  .system-info {
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .info-label {
    font-weight: bold;
  }
  
  .info-value {
    color: #555;
  }
  </style>