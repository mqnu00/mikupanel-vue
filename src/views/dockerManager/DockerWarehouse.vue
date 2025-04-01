<template>
    <n-layout style="width: 100%; height: 100%; position: relative;">
        <n-layout-header class="header">
            <n-space>
                <el-button @click="addRepo">
                    添加仓库
                </el-button>
            </n-space>
        </n-layout-header>

        <el-table :data="dockerRepositories" style="width: 100%">
            <el-table-column prop="downloadUrl" label="下载地址"></el-table-column>
            <el-table-column label="状态">
                <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.msg || '加载中' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="text" @click="editRepository(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteRepository(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </n-layout>
    <el-drawer title="添加仓库" v-model="addRepoVisible" direction="rtl">
        <AddRepo :docker-manager-client="dockerManagerClient"></AddRepo>
    </el-drawer>
</template>
<script lang="ts">
import { DockerManagerClient } from './DockerManagerClient';
import AddRepo from './AddRepo.vue';

export default defineComponent({
    name: "DockerWarehouse",
    components: {
        AddRepo  
    },
    props: {
        dockerManagerClient: {
            type: DockerManagerClient
        }
    },
    methods: {
        editRepository(row: any) {
            console.log('编辑仓库:', row);
            // 在这里实现编辑逻辑
        },
        deleteRepository(row: any) {
            console.log('删除仓库:', row);
            // 在这里实现删除逻辑
            this.dockerManagerClient?.removeSource(row.downloadUrl)
        },
        getStatusType(status: boolean) {
            if (status) {
                return 'success'
            } else if (status === false) {
                return 'danger'
            } else {
                return 'info'
            }
        },
        addRepo() {
            this.addRepoVisible = true
        }
    },
    setup(props) {
        const dockerRepositories = ref<any[]>([]);
        const addRepoVisible = ref(false);

        onMounted(async () => {
            props.dockerManagerClient?.setSoucesList(dockerRepositories)
            console.log("仓库")
            props.dockerManagerClient?.getDockerSourcesList()
        })
        return {
            dockerRepositories,
            addRepoVisible
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
</style>