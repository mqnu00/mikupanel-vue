<template>
    <div class="pull-image-container">
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="pullForm" 
        label-width="120px"
        class="pull-form"
      >
        <el-form-item label="Registry" prop="registry">
          <el-select 
            v-model="form.registry" 
            placeholder="Select registry"
            class="registry-select"
          >
            <el-option
              v-for="item in registryOptions"
              :key="item.downloadUrl"
              :label="item.downloadUrl"
              :value="item.downloadUrl"
            />
          </el-select>
        </el-form-item>
  
        <el-form-item label="Custom Registry" v-if="form.registry === 'custom'">
          <el-input 
            v-model="form.customRegistry" 
            placeholder="e.g. localhost:5000"
          />
        </el-form-item>
  
        <el-form-item label="Image Name" prop="imageName">
          <el-input 
            v-model="form.imageName" 
            placeholder="e.g. nginx:latest or library/nginx"
          />
        </el-form-item>
  
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handlePull"
          >
            Pull Image
          </el-button>
        </el-form-item>
      </el-form>
  
      <div class="progress-container" v-if="progressMessages.length > 0">
        <h3>Pull Progress:</h3>
        <div class="progress-messages">
          <div 
            v-for="(msg, index) in progressMessages" 
            :key="index"
            class="progress-message"
          >
            {{ msg }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { DockerManagerClient } from './DockerManagerClient';
  
  export default defineComponent({
    name: "PullImage",
    props: {
      dockerManagerClient: {
        type: Object as () => DockerManagerClient,
        required: true
      }
    },
    setup(props) {
      const form = ref<any>({
        registry: '',
        customRegistry: '',
        imageName: ''
      });

      const registryOptions = ref(props.dockerManagerClient.getSourceList());
  
      const rules = {
        registry: [
          { required: true, message: 'Please select registry', trigger: 'change' }
        ],
        imageName: [
          { required: true, message: 'Image name is required', trigger: 'blur' },
          { 
            pattern: /^[a-z0-9]+([._-][a-z0-9]+)*(\/[a-z0-9]+([._-][a-z0-9]+)*)?(:[a-zA-Z0-9_.-]+)?$/,
            message: 'Invalid image name format',
            trigger: 'blur'
          }
        ]
      };
  
      
  
      const loading = ref(false);
      const progressMessages = ref<string[]>([]);
      const pullForm = ref();
  
      const handlePull = async () => {
          await pullForm.value.validate();
          loading.value = true;
          progressMessages.value = [];
  
          // Call backend to pull image
          props.dockerManagerClient.addImage(form.value.registry, form.value.imageName)
      }
  
      return {
        form,
        rules,
        registryOptions,
        loading,
        progressMessages,
        pullForm,
        handlePull
      };
    }
  });
  </script>
  
  <style scoped>
  .pull-image-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .pull-form {
    margin-top: 30px;
  }
  
  .registry-select {
    width: 100%;
  }
  
  .progress-container {
    margin-top: 30px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 20px;
  }
  
  .progress-messages {
    max-height: 300px;
    overflow-y: auto;
    margin-top: 10px;
  }
  
  .progress-message {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    font-family: monospace;
    font-size: 14px;
  }
  </style>