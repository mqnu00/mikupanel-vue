<template>
    <n-layout style="width: 100%; height: 100%; position: relative;">
        <n-layout-header class="header">
            <n-space>
                <el-button @click="createNetwork">
                    创建网络
                </el-button>
            </n-space>
        </n-layout-header>
        <div class="image-content">
            <el-table :data="networkList">
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="driver" label="模式" />
                <el-table-column prop="subnet" label="子网" />
                <el-table-column prop="gateway" label="网关" />
                <el-table-column prop="created" label="创建日期" :formatter="formatDockerTime" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="text" @click="">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </n-layout>

    <el-drawer title="创建网络" v-model="createNetworkVisible" direction="rtl">
        <CreateNetwork :docker-manager-client="dockerManagerClient as DockerManagerClient"></CreateNetwork>
    </el-drawer>

</template>
<script lang="ts">
import CreateNetwork from './CreateNetwork.vue';
import { DockerManagerClient } from './DockerManagerClient';
import PullImage from './PullImage.vue';

export default defineComponent({
    name: "DockerNetwork",
    props: {
        dockerManagerClient: {
            type: DockerManagerClient
        }
    },
    components: {
        CreateNetwork
    },
    methods: {
        formatDockerTime(row: any, column: any, timeStr: string) {
            try {
                console.log(timeStr)
                // 处理带时区的时间（如 2025-03-30T12:21:48.395741724-04:00）
                const dt = new Date(timeStr)
                return dt.toLocaleString('zh-CN', {
                    timeZone: 'UTC',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) + ' UTC'
            } catch {
                return timeStr  // 解析失败返回原始字符串
            }
        },
        createNetwork(){
            this.createNetworkVisible = true
        }
    },
    setup(props) {
        // 示例镜像数据
        const networkList = ref([]);
        const createNetworkVisible = ref(false);

        onMounted(() => {
            props.dockerManagerClient?.setNetworkList(networkList)
            props.dockerManagerClient?.getDockerNetworkList()
        })
        return {
            networkList,
            createNetworkVisible,
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