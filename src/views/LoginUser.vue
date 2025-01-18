<template>
    <div class="login-container">
      <el-container class="main-container">
        <el-main class="el-main">
          <h2>登录</h2>
          <el-form :model="loginForm" :rules="rules" ref="LoginFormRef" label-width="80px" class="login-form">
            <el-form-item label="用户名:" prop="username">
              <el-input v-model="loginForm.username" />
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input v-model="loginForm.password" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">登录</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  
  export default defineComponent({
    name: 'LoginUser',
    setup() {
      const loginForm = ref({
        username: '',
        password: '',
      });
  
      const rules = ref({
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      });
  
      const ws = new WebSocket('ws://localhost:8000');
  
      const onSubmit = () => {
        console.log('用户名====>', loginForm.value.username);
        console.log('密码====>', loginForm.value.password);
  
        // 发送登录请求
        ws.send(JSON.stringify({
          type: 'login',
          data: {
            username: loginForm.value.username,
            password: loginForm.value.password,
          },
        }));
  
        ws.onmessage = (event) => {
          const response = JSON.parse(event.data);
          if (response.type === 'login' && response.success) {
            ElMessage.success('登录成功');
            // 跳转到主页
            // this.$router.push('/home');
          } else {
            ElMessage.error('登录失败');
          }
        };
  
        ws.onerror = (error) => {
          ElMessage.error('登录失败');
          console.error('WebSocket Error:', error);
        };
      };
  
      return {
        loginForm,
        rules,
        onSubmit,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .login-container {
    //background: url('@/assets/images/login-bg.jpg') no-repeat center center;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  
    .main-container {
      width: 50%;
      max-width: 500px;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
  
      .el-main {
        width: 100%;
        padding: 20px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
  
      .login-form {
        width: 100%;
        max-width: 400px;
      }
    }
  }
  </style>