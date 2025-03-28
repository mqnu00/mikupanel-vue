<template>
    <div>
      <el-upload
        ref="upload"
        :on-change="handleFileChange"
        :on-remove="clearFile"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :auto-upload="false"
        :limit="1"
        accept=".zip,.tar,.gz,.rar"
      >
        <template #trigger>
          <el-button type="primary">Select File</el-button>
        </template>
        <div style="margin: 5px 0 0 0;">
            <el-button type="success" @click="uploadFile" :disabled="!file" >Upload</el-button>
        </div>
        
        <template #tip>
          <div class="el-upload__tip">
            Only zip, tar, gz, rar files are allowed.
          </div>
        </template>
      </el-upload>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { ComponentConfigClient } from './ComponentConfigClient';
  import { ElMessage } from 'element-plus';
  
  export default defineComponent({
    name: "InstallPlugin",
    props: {
      componentConfigClient: {
        type: ComponentConfigClient
      }
    },
    setup(props) {
      const file = ref<File | null>(null);
      const fileList = ref<File[]>([]);
      const upload = ref<any>(null);
  
      // 处理文件选择
      const handleFileChange = (fileItem: any, fileList: any) => {
        file.value = fileItem.raw; // 获取文件对象
        fileList.value = [fileItem]; // 更新文件列表
      };
  
      // 上传文件
      const uploadFile = async () => {
        if (file.value) {
          try {
            const response = await props.componentConfigClient?.updateFile(file.value);
            console.log('File uploaded successfully:', response);
            ElMessage.success('File uploaded successfully');
            file.value = null; // 清空文件选择
            fileList.value = []; // 清空文件列表
          } catch (error) {
            console.error('File upload failed:', error);
            ElMessage.error('File upload failed');
          }
        } else {
          ElMessage.warning('Please select a file first');
        }
      };
  
      // 清空文件选择
      const clearFile = () => {
        file.value = null;
        fileList.value = [];
        upload.value.clearFiles(); // 清空上传组件的文件列表
      };
  
      // 文件上传前的钩子
      const beforeUpload = (file: File) => {
        const isValidType = ['application/zip', 'application/x-tar', 'application/gzip', 'application/x-rar-compressed'].includes(file.type);
        if (!isValidType) {
          ElMessage.error('Only zip, tar, gz, rar files are allowed');
          return false;
        }
        return true;
      };
  
      // 在组件挂载时可以执行一些操作（如果需要）
      onMounted(() => {
        console.log('ComponentConfig component mounted');
      });
  
      return {
        file,
        fileList,
        upload,
        handleFileChange,
        uploadFile,
        clearFile,
        beforeUpload
      };
    }
  });
  </script>