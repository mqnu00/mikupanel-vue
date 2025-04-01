<template>
    <div class="form-container">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="仓库地址" prop="repositoryUrl">
            <el-input v-model="form.repositoryUrl" placeholder="请输入仓库地址"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(form)">提交</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>
<script lang="ts">
import { DockerManagerClient } from './DockerManagerClient';

export default defineComponent({
    name: "AddRepo",
    props: {
        dockerManagerClient: {
            type: DockerManagerClient
        }
    },
    methods: {
        submitForm(form: any) {
            console.log(form.repositoryUrl)
            this.dockerManagerClient?.addSource(form.repositoryUrl)
        }
    },
    setup(props) {
        const form = ref({
            repositoryUrl: ''
        });
        const rules = {
            repositoryUrl: [
                { required: true, message: '仓库地址不能为空', trigger: 'blur' },
                { type: 'url', message: '请输入有效的仓库地址', trigger: 'blur' }
            ]
        };
        return {
            form,
            rules
        }
    }
})
</script>
<style>
/* 表单容器居中 */
.form-container {
  justify-content: center;
  align-items: center;
}
</style>