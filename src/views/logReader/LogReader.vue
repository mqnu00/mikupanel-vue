<template>
    <el-table :data="logData" style="width: 100%">
        <el-table-column prop="timestamp" label="时间" width="180"></el-table-column>
        <el-table-column prop="level" label="日志级别" width="100"></el-table-column>
        <el-table-column label="详细信息" width="200">
            <template #default="scope">
                <el-popover placement="top" trigger="hover">
                    <template #reference>
                        <el-tag>{{ scope.row.thread }}</el-tag>
                    </template>
                    <n-space justify="center" vertical>
                        <p v-for="(value, key) in getDetail(scope.row)" :key="key">
                            {{ key }}: {{ value }}
                        </p>
                    </n-space>
                </el-popover>
            </template>
        </el-table-column>
        <el-table-column prop="message" label="日志内容"></el-table-column>
        <el-table-column prop="errorStack" label="错误信息"></el-table-column>
    </el-table>
</template>

<script lang="ts">
import { LogReaderClient } from './LogReaderClient';

export default defineComponent({
    props: {

    },
    methods: {


        getDetail(row: any) {
            return {
                '进程': row.process,
                '线程': row.thread,
                'PID': row.pid,
                'TID': row.tid,
                '文件': row.file,
                '函数': row.function,
                '行号': row.line
            };
        }
    },
    setup() {
        const logData = ref([
            {
                timestamp: '2025-04-10 00:43:51.680',
                level: 'INFO',
                process: 'MainProcess',
                thread: 'MainThread',
                pid: '19150',
                tid: '139379635765248',
                file: 'server.py',
                function: 'check_end',
                line: '115',
                message: '进程运行完毕：True'
            },
            {
                timestamp: '2025-04-10 00:44:00.000',
                level: 'ERROR',
                process: 'MainProcess',
                thread: 'MainThread',
                pid: '19150',
                tid: '139379635765248',
                file: 'server.py',
                function: 'check_end',
                line: '120',
                message: '进程运行失败：False'
            }
        ]);

        const logReaderClient = ref(new LogReaderClient())
        logReaderClient.value.init(logData)
        logReaderClient.value.getLog()

        onMounted(() => {

        })

        onUnmounted(() => {
            logReaderClient.value.close()
        })

        return {
            logData
        }
    }

})


</script>

<style scoped>
.el-row {
    display: flex;
    justify-content: space-between;
}

.el-col {
    margin-right: 10px;
}
</style>