<template>
    <n-layout style="width: 100%; height: 100%; position: relative;">
        <n-layout-header class="header">
            <n-space>
                <el-button @click="pullImage">
                    拉取镜像
                </el-button>
                <el-button>
                    删除镜像
                </el-button>
            </n-space>
        </n-layout-header>
        <div class="image-content">
            <el-table :data="imageList">
                <el-table-column  label="标签">
                    <template #default="scope">
                        <el-popover effect="light"
                            trigger="hover" placement="top" width="auto">
                                    {{ scope.row.RepoTags[0] }}
                            <template #reference>
                                <el-tag>{{ scope.row.RepoTags[0] }}</el-tag>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="Created" label="创建时间" :formatter="formatDate" />
                <el-table-column prop="Size" label="大小" :formatter="formatSize" />
                <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="text" @click="deleteImage(scope.row)">删除</el-button>
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
    name: "DockerImage",
    props: {
        dockerManagerClient: {
            type: DockerManagerClient
        }
    },
    components: {
        PullImage
    },
    methods: {
        formatDate(row: any, column: any, value: number) {
            // 将时间戳转换为 Date 对象
            const date = new Date(value * 1000); // 时间戳需要乘以 1000，因为 Date 构造函数需要毫秒单位
            return new Intl.DateTimeFormat('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(date);
        },
        formatSize(row: any, column: any, value: number): string {
            if (!value) return '0 B';
            const unit = value < 1024 ? 'B' : value < 1048576 ? 'KB' : value < 1073741824 ? 'MB' : 'GB';
            const size = value / Math.pow(1024, unit === 'GB' ? 3 : unit === 'MB' ? 2 : unit === 'KB' ? 1 : 0);
            return size.toFixed(2) + ' ' + unit;
        },
        pullImage() {
            this.pullImageVisible = true
        },
        deleteImage(row: any) {
            this.dockerManagerClient?.removeImage(row.Id)
        }
    },
    setup(props) {
        // 示例镜像数据
        const imageList = ref([]);
        const pullImageVisible = ref(false);

        onMounted(() => {
            props.dockerManagerClient?.setImageList(imageList)
            props.dockerManagerClient?.getDockerImageList()
        })
        return {
            imageList,
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