<template>
    <n-layout style="width: 100%; height: 100%; position: relative;">
        <n-layout-header class="header">
            <n-space>
                <el-button>
                    创建容器
                </el-button>
            </n-space>
        </n-layout-header>
        <div class="image-content">
            <el-table :data="containerList">
                <el-table-column prop="name" label="名称" />
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
                        <el-button type="text" @click="">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </n-layout>

    <el-drawer title="拉取镜像" v-model="pullImageVisible" direction="rtl">
        <PullImage :docker-manager-client="dockerManagerClient as DockerManagerClient"></PullImage>
    </el-drawer>

</template>
<script lang="ts">
import { DockerManagerClient } from './DockerManagerClient';
import PullImage from './PullImage.vue';

export default defineComponent({
    name: "DockerContainer",
    props: {
        dockerManagerClient: {
            type: DockerManagerClient
        }
    },
    components: {
        PullImage
    },
    methods: {
        getMountTagType(mountType: any) {
            switch (mountType) {
                case 'volume': return 'success'
                case 'bind': return 'warning'
                case 'tmpfs': return 'danger'
                default: return 'info'
            }
        }
    },
    setup(props) {
        // 示例镜像数据
        const containerList = ref([]);
        const pullImageVisible = ref(false);

        onMounted(() => {
            props.dockerManagerClient?.setContainerList(containerList)
            props.dockerManagerClient?.getDockerContainerList()
        })
        return {
            containerList,
            pullImageVisible,
        }
    }
})
</script>
<style>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 10px 0;
}

.image-content {
    padding: 20px;
    border: 1px solid #ebeef5;
    border-top: none;
}
</style>