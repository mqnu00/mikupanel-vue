<template>
    <n-layout v-if="dataLoaded" style="width: 100%; height: 100%; position: relative;">
        <!-- 固定在顶部的 n-layout-header -->
        <n-layout-header class="file-header" style="position: absolute; top: 0; left: 0; right: 0; height: 60px;">
            <n-space>
                <el-button @click="dirBack" circle>
                    <i-ep-Back />
                </el-button>


            </n-space>
            <n-space>
                <div style="display:flex;position: relative; height: 50px; align-items: center;">
                    <el-breadcrumb class="bread" separator=">" @click="activateInput">
                        <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
                            {{ item }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>

                    <!-- 输入框 -->
                    <el-input class="path-input" v-if="isInputActive" v-model="nowInputPath" placeholder="请输入路径"
                        @keyup.enter="handleEnter" @blur="handleBlur" clearable ref="inputRef" />
                </div>
            </n-space>
        </n-layout-header>

        <!-- 内容区域 -->
        <div style="position: absolute; top: 60px; left: 0; right: 0; bottom: 0; overflow: auto;">
            <n-layout>
                <el-table ref="multipleTableRef" :data="tableData" row-key="id" style="width: 100%">
                    <el-table-column type="selection" width="50" />
                    <el-table-column label="名称">
                        <template #default="scope">
                            <span class="clickable-text" @click="dirnameClick(scope.row)">
                                {{ scope.row.dirname }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column property="dirtype" label="文件类型" />
                    <el-table-column property="owner" label="所有者" />
                    <el-table-column property="group" label="用户组" />
                    <el-table-column property="permission" label="权限" />
                    <el-table-column property="size" label="文件大小" :formatter="formatSize" />
                    <el-table-column property="modify_timestamp" label="文件修改时间" :formatter="formatTimestamp" />
                </el-table>
            </n-layout>
        </div>

        <!-- 弹出框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50vw" :before-close="dialogClose">
            <FileEditor @update:value="updateVisible"
             :path="fileToOpen" :fileContent="fileContent"
                :file-manager-client="fileManagerClient as FileManagerClient" />
        </el-dialog>
    </n-layout>
</template>

<script lang="ts">
import { ref, defineComponent, computed, onMounted, onUnmounted } from 'vue';
import type { TableInstance } from 'element-plus';
import { FileManagerClient, Path, path_concat, get_path_parent } from './models/FileManagerClient';
import FileEditor from './models/FileEditor.vue';

export default defineComponent({
    name: 'FileManager',
    components: {
        FileEditor
    },
    setup() {
        const breadcrumbItems = ref(['/']); // 面包屑导航项
        const isInputActive = ref(false)
        const multipleTableRef = ref<TableInstance>();
        const multipleSelection = ref<Path[]>([]);
        const fileManagerClient = ref<FileManagerClient | null>(null);
        const tableData = ref<Path[]>([]);
        const nowPath = ref<string>('/');
        const nowInputPath = ref<string>('/');
        const dialogVisible = ref(false);
        const fileContent = ref('');
        const fileToOpen = ref<any>({
            id: 0,
            parent: '/',
            dirname: '/',
            dirtype: 'file'
        });
        const inputRef = ref<HTMLElement | null>(null)
        const dataLoaded = ref(false)

        const formatTimestamp = (row: any, column: any) => {
            const timestamp = row[column.property];
            const date = new Date(timestamp * 1000); // 转换为毫秒
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        function formatSize(row: any, column: any) {
            if (row[column.property]) {
                return formatBytes(row[column.property]);
            } else {
                return ''
            }
            
        }
        function formatBytes(bytes: number): string {
            if (bytes < 1024) {
                return `${bytes} B`;
            } else if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(2)} KB`;
            } else if (bytes < 1024 * 1024 * 1024) {
                return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
            } else {
                return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
            }
        }

        const handleEnter = () => {
            nowPath.value = nowInputPath.value
            fileManagerClient.value?.getDirList('')
            handleBlur()
        }

        const updateVisible = (value: boolean) => {
            console.log('update')
            dialogVisible.value = value
        }

        const handleBlur = () => {
            isInputActive.value = false;
            nowInputPath.value = nowPath.value
            console.log(nowPath.value)
        }

        const activateInput = () => {
            isInputActive.value = true;
            nextTick(() => {
                inputRef.value?.focus()
            })
        }

        const dialogTitle = computed(() =>
            `编辑 ${path_concat(fileToOpen.value?.parent as string, fileToOpen.value?.dirname as string)}`
        );

        fileManagerClient.value = new FileManagerClient();
        fileManagerClient.value?.init(tableData, nowPath, nowInputPath, fileContent, breadcrumbItems, dataLoaded);

        const dirnameClick = (p: Path) => {
            if (p.dirtype === 'file') {
                fileToOpen.value = p;
                fileManagerClient.value?.openFile(p.dirname);
                dialogVisible.value = true;
            } else if (p.dirtype === 'dir') {
                fileManagerClient.value?.getDirList(p.dirname);
            }
        };

        const dirBack = () => {
            nowPath.value = get_path_parent(nowPath.value);
            fileManagerClient.value?.getDirList('');
        };

        const dialogClose = () => {
            dialogVisible.value = false;
        };

        onMounted(() => {
            console.log(inputRef.value)
            fileManagerClient.value?.getDirList(nowPath.value);
        });

        onUnmounted(() => {
            fileManagerClient.value?.closeFileManager();
        });

        return {
            multipleTableRef,
            multipleSelection,
            tableData,
            dialogVisible,
            fileContent,
            fileManagerClient,
            fileToOpen,
            dialogTitle,
            nowPath,
            isInputActive,
            breadcrumbItems,
            inputRef,
            nowInputPath,
            dataLoaded,
            dirnameClick,
            dirBack,
            dialogClose,
            handleEnter,
            handleBlur,
            activateInput,
            formatTimestamp,
            formatSize,
            updateVisible
        };
    }
});
</script>

<style scoped>
.clickable-text {
    color: #409eff;
    /* 蓝色文本 */
    cursor: pointer;
    /* 鼠标悬停时显示手型 */
    text-decoration: none;
    /* 去掉下划线 */
    position: relative;
    /* 相对定位 */
}

.clickable-text::after {
    content: "▼";
    /* 下滑箭头 */
    position: absolute;
    right: -20px;
    /* 箭头位置 */
    top: 0;
    transition: opacity 0.3s;
    /* 动画效果 */
    opacity: 0;
    /* 默认不显示 */
}

.clickable-text:hover::after {
    opacity: 1;
    /* 悬停时显示箭头 */
}

.file-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
}

.bread {
    cursor: pointer;
    padding: 0 16px;
    width: 50vw;
}

.path-input {
    border: none;
    background-color: transparent;
    color: #409eff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.path-input__inner {
    border-radius: 4px;
}
</style>