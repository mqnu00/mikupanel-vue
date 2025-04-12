<template>
    <n-layout style="width: 100%; height: 100%; position: relative;">
        <n-layout-header class="header">
            <n-space>
                <el-button @click="createContainer">
                    创建容器
                </el-button>
            </n-space>
        </n-layout-header>
        <div class="image-content">
            <el-table :data="containerList" class="containerTable">
                <el-table-column fixed prop="name" label="名称" />
                <el-table-column prop="image" label="镜像" />
                <el-table-column prop="state" label="状态" />
                <el-table-column prop="ip" label="ip" />
                <el-table-column label="端口">
                    <template #default="{ row }">
                        <div v-if="row.ports && row.ports.length">
                            <el-tag v-for="(port, index) in row.ports" :key="index" size="small"
                                style="margin-right: 5px; margin-bottom: 3px">
                                {{ port.private_port }}/{{ port.type }} ➔ {{ port.host_ip }}:{{ port.public_port }}
                            </el-tag>
                        </div>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="挂载卷" width="360">
                    <template #default="{ row }">
                        <div v-if="row.mounts && row.mounts.length">
                            <el-tag v-for="(mount, index) in row.mounts" :key="index" size="small"
                                :type="getMountTagType(mount.type)" style="margin-right: 5px; margin-bottom: 3px">
                                {{ mount.destination }} -> {{ mount.source }}
                            </el-tag>
                        </div>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="运行时长" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="text" @click="startContainer(scope.row)">启动</el-button>
                        <el-button type="text" @click="stopContainer(scope.row)">停止</el-button>
                        <el-button type="text" @click="readContainerLog(scope.row)">日志</el-button>
                        <el-button type="text" @click="">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-drawer title="创建容器" v-model="createContainerVisible" direction="rtl">
            <CreateContainer :docker-manager-client="dockerManagerClient as DockerManagerClient"></CreateContainer>
        </el-drawer>

        <el-drawer title="容器日志" v-model="ContainerLogVisible" direction="rtl">
            <LogReader :model="containerLog"></LogReader>
        </el-drawer>
    </n-layout>



</template>
<script lang="ts">
import CreateContainer from './CreateContainer.vue';
import { DockerManagerClient } from './DockerManagerClient';
import LogReader from './LogReader.vue';
import PullImage from './PullImage.vue';

export default defineComponent({
    name: "DockerContainer",
    props: {
        dockerManagerClient: {
            type: DockerManagerClient
        }
    },
    components: {
        CreateContainer,
        LogReader
    },
    methods: {
        getMountTagType(mountType: any) {
            switch (mountType) {
                case 'volume': return 'success'
                case 'bind': return 'warning'
                case 'tmpfs': return 'danger'
                default: return 'info'
            }
        },
        createContainer() {
            this.createContainerVisible = true
        },
        startContainer(row: any) {
            this.dockerManagerClient?.startContainer(row.name)
        },
        stopContainer(row: any) {
            this.dockerManagerClient?.stopContainer(row.name)
        },
        readContainerLog(row: any) {
            this.dockerManagerClient?.getContainerLog(row.name)
            this.ContainerLogVisible = true
        }
    },
    setup(props) {
        // 示例镜像数据
        const containerList = ref([]);
        const createContainerVisible = ref(false);
        const containerLog = ref('')
        const ContainerLogVisible = ref(false)

        onMounted(() => {
            props.dockerManagerClient?.setContainerList(containerList)
            props.dockerManagerClient?.setContainerLog(containerLog)
            props.dockerManagerClient?.getDockerContainerList()
        })
        return {
            containerList,
            containerLog,
            ContainerLogVisible,
            createContainerVisible,
        }
    }
})
</script>
<style scoped>
.el-drawer {
    width: 50% !important;
}

.header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
}

.image-content {
    position: absolute;
    padding: 0;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    height: calc(100vh-60px-30px-30px)
}

.containerTable {
    width: 100%;
    height: 100%
}
</style>