<template>
    <n-space justify="end">
        <el-popover :width="200">
            <n-space wrap vertical :align="'center'" :justify="'center'">
                <el-button v-for="sshInfo in sshInfoList" :key="sshInfo.id" @click="addTerminal(sshInfo.id)">
                    {{ sshInfo.host }}
                </el-button>
                <el-button size="small" type="primary">
                    添加连接信息
                </el-button>
            </n-space>
            <template #reference>
                <el-button>添加终端</el-button>
            </template>
        </el-popover>
    </n-space>
    <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="handleTabsEdit">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name"
            style="height: 100%;">
            <!-- {{ item.content }} -->

            <Terminal :name="item.name" :id="item.id"></Terminal>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue';
import type { TabPaneName } from 'element-plus';
import Terminal from '@/views/terminal/modules/Terminal.vue';
import { TerminalClient } from './modules/TerminalClient';
import { TerminalConfigClient } from './TerminalConfigClient';

export default defineComponent({
    components: {
        Terminal
    },
    methods: {
        addTerminal(id: number) {
            console.log(id)
            console.log(typeof id)
            const newTabName = `${++this.tabIndex}`;
            this.editableTabs.push({
                title: `terminal ${newTabName}`,
                name: newTabName,
                id: id
            });
            this.editableTabsValue = newTabName;
        }
    },
    setup() {
        const tabIndex = ref(1);
        const editableTabsValue = ref('1');
        const editableTabs = ref<any[]>([
            
        ]);
        const sshInfoList = ref<any[]>([])
        const terminalConfigClient = ref<TerminalConfigClient>(new TerminalConfigClient());
        terminalConfigClient.value.init()
        terminalConfigClient.value.setSSHInfoList(sshInfoList)

        const handleTabsEdit = (targetName: any) => {
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

        };

        onMounted(() => {
            terminalConfigClient.value.getSSHInfoList()
        })


        return {
            editableTabsValue,
            editableTabs,
            sshInfoList,
            tabIndex,
            handleTabsEdit
        };
    }
});
</script>

<style>
.demo-tabs>.el-tabs__content {
    padding: 10px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>