<template>
    <n-layout>
        
        <n-layout>
            <div id="container" style="width: 47vw;height:60vh;"></div>
        </n-layout>
        <n-layout-footer class="fileEditorHeader">
            <n-space >
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveFile">保存</el-button>
            </n-space>
        </n-layout-footer>
    </n-layout>
    
</template>

<script lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { onMounted, onBeforeUnmount, defineComponent, PropType } from 'vue';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
import { FileManagerClient, Path, path_concat } from './FileManagerClient';
export default defineComponent({
    name: 'FileEditor',
    props: {
        path: {
            type: Object as PropType<Path>
        },
        fileContent: {
            type: String,
            default: ''
        },
        fileManagerClient: {
            type: FileManagerClient
        }
    },
    setup(props, {emit}) {
        let editor: any = null;

        const saveFile = () => {
            let value = editor.getValue()
            console.log(value)
            props.fileManagerClient?.saveFile(
                path_concat(props.path?.parent as string, props.path?.dirname as string), 
                value
            )
        }

        const cancel = () => {
            console.log('close file')
            emit('update:value', false)
        }

        onMounted(() => {
            // 创建 Monaco Editor 实例
            editor = monaco.editor.create(document.getElementById("container") as HTMLElement, {
                value: props.fileContent,
                language:"javascript",
                automaticLayout: true,
            });

            

            // 确保代码高亮生效
            // const model = editor.getModel();
            // if (model) {
            //     monaco.editor.setModelLanguage(model, 'html'); // 设置模型的语言
            // }
            // 打印初始值
            // console.log(editor.getValue()); 
        });

        onBeforeUnmount(() => {
            // 在组件销毁时释放编辑器资源
            if (editor) {
                editor.dispose();
            }
        });

        // 监听 fileContent 的变化，动态更新编辑器内容
        watch(() => props.fileContent, (newContent) => {
        if (editor) {
            editor.setValue(newContent);
            // 滚动条复位到顶部
            editor.revealLine(1, monaco.editor.ScrollType.Immediate);
        }
        });

        return {
            saveFile,
            cancel
        }
    }
});
</script>
<style>
.fileEditorHeader {
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 0px 16px;
    margin: 10px 0 0 0;
    height: 60px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #eaeaea;
  }
</style>