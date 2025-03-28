<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    type="text"
                    id="username"
                    v-model="username"
                    required
                    placeholder="Enter your username"
                />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    v-model="password"
                    required
                    placeholder="Enter your password"
                />
            </div>
            <div class="form-group">
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { UserClient } from './models/UserClient';

export default defineComponent({
    name: 'Login',
    setup() {
        const username = ref<string>('');
        const password = ref<string>('');
        const userClient = ref<UserClient>(new UserClient());

        // 初始化 UserClient
        userClient.value.init();

        // 登录按钮的处理逻辑
        const handleLogin = () => {
            userClient.value.login(username.value, password.value);
        };

        // 在组件挂载时可以执行一些操作（如果需要）
        onMounted(() => {
            console.log('Login component mounted');
        });

        onUnmounted(() => {
            userClient.value.close()
        })

        return {
            username,
            password,
            handleLogin,
        };
    },
});
</script>

<style scoped>
.login-container {
    display: flex; /* 使用 Flexbox */
    flex-direction: column; /* 子元素垂直排列 */
    align-items: center; /* 水平居中 */
    justify-content: center; /* 垂直居中 */
    height: 50vh; /* 设置容器高度为视口高度 */
    max-width: 400px;
    margin: 0 auto; /* 水平居中 */
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
    width: 100%; /* 确保输入框宽度适应容器 */
}

label {
    display: block;
    margin-bottom: 5px;
}

input[type='text'],
input[type='password'] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>