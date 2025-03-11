<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    editable
    class="demo-tabs"
    @edit="handleTabsEdit"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      style="height: 100%;"
    >
      <!-- {{ item.content }} -->
      
      <Terminal :name="item.name" ></Terminal>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue';
import type { TabPaneName } from 'element-plus';
import Terminal from '@/components/Terminal/Terminal.vue';

export default defineComponent({
  components: {
    Terminal
  },
  setup() {
    let tabIndex = 1;
    const editableTabsValue = ref('1');
    const editableTabs = ref([
      {
        title: 'terminal 1',
        name: '1'
      }
    ]);

    const handleTabsEdit = (
      targetName: TabPaneName | undefined,
      action: 'remove' | 'add'
    ) => {
      if (action === 'add') {
        const newTabName = `${++tabIndex}`;
        editableTabs.value.push({
          title: `terminal ${newTabName}`,
          name: newTabName
        });
        editableTabsValue.value = newTabName;
      } else if (action === 'remove') {
        
        const tabs = editableTabs.value;
        let activeName = editableTabsValue.value;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        editableTabsValue.value = activeName;
        editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
      }
    };

    return {
      editableTabsValue,
      editableTabs,
      handleTabsEdit
    };
  }
});
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 10px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>