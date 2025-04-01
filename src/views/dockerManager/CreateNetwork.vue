<template>
    <div class="create-network">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="网络名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：my-bridge-network" />
        </el-form-item>
  
        <el-form-item label="网络驱动" prop="driver">
          <el-select v-model="form.driver" placeholder="请选择驱动类型">
            <el-option label="bridge" value="bridge" />
            <el-option label="overlay" value="overlay" />
            <el-option label="macvlan" value="macvlan" />
            <el-option label="host" value="host" />
          </el-select>
        </el-form-item>
  
        <el-form-item label="子网配置" prop="subnet">
          <el-input 
            v-model="form.subnet" 
            placeholder="例如：172.28.0.0/16"
            @change="calculateGateway"
          />
        </el-form-item>
  
        <el-form-item label="网关地址" prop="gateway">
          <el-input v-model="form.gateway" placeholder="例如：172.28.0.1" />
        </el-form-item>
  
        <el-form-item label="是否启用IPv6">
          <el-switch v-model="form.enableIPv6" />
        </el-form-item>
  
        <el-form-item v-if="form.enableIPv6" label="IPv6子网" prop="ipv6Subnet">
          <el-input v-model="form.ipv6Subnet" placeholder="例如：2001:db8::/64" />
        </el-form-item>
  
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading"
            @click="submitForm"
          >
            创建网络
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { DockerManagerClient } from './DockerManagerClient'
  
  export default defineComponent({
    name: "CreateNetwork",
    props: {
      dockerManagerClient: {
        type: DockerManagerClient,
        required: true
      }
    },
    setup(props) {
      const formRef = ref<FormInstance>()
      const loading = ref(false)
  
      const form = reactive({
        name: '',
        driver: 'bridge',
        subnet: '',
        gateway: '',
        enableIPv6: false,
        ipv6Subnet: ''
      })
  
      const validateSubnet = (rule: any, value: string, callback: any) => {
        if (!value) {
          callback(new Error('请输入子网地址'))
        } else if (!/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(value)) {
          callback(new Error('格式应为 IPv4 CIDR (如 172.28.0.0/16)'))
        } else {
          callback()
        }
      }
  
      const validateGateway = (rule: any, value: string, callback: any) => {
        if (!value) {
          callback(new Error('请输入网关地址'))
        } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
          callback(new Error('格式应为 IPv4 地址 (如 172.28.0.1)'))
        } else {
          callback()
        }
      }
  
      const rules = reactive<FormRules>({
        name: [
          { required: true, message: '请输入网络名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        driver: [
          { required: true, message: '请选择网络驱动', trigger: 'change' }
        ],
        subnet: [
          { validator: validateSubnet, trigger: 'blur' }
        ],
        gateway: [
          { validator: validateGateway, trigger: 'blur' }
        ],
        ipv6Subnet: [
          { 
            pattern: /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\/\d{1,3}$/,
            message: '格式应为 IPv6 CIDR (如 2001:db8::/64)',
            trigger: 'blur'
          }
        ]
      })
  
      const calculateGateway = () => {
        if (form.subnet && !form.gateway) {
          // 自动计算网关（假设为子网第一个IP）
          const baseIp = form.subnet.split('/')[0]
          const parts = baseIp.split('.')
          parts[3] = '1' // 将最后一段改为1
          form.gateway = parts.join('.')
        }
      }
  
      const submitForm = async () => {
        if (!formRef.value) return
        
        try {
          await formRef.value.validate()
          loading.value = true
  
          const config: any = {
            Name: form.name,
            Driver: form.driver,
            IPAM: {
              Config: [{
                Subnet: form.subnet,
                Gateway: form.gateway
              }]
            }
          }
  
          if (form.enableIPv6 && form.ipv6Subnet) {
            config.EnableIPv6 = true
            config.IPAM.Config.push({
              Subnet: form.ipv6Subnet,
              Gateway: 'fd00::1' // IPv6默认网关
            })
          }
  
          props.dockerManagerClient.createNetwork(config)

          resetForm()
        } catch (error) {
          ElMessage.error(`创建失败: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
          loading.value = false
        }
      }
  
      const resetForm = () => {
        formRef.value?.resetFields()
        form.enableIPv6 = false
      }
  
      return {
        formRef,
        form,
        rules,
        loading,
        calculateGateway,
        submitForm,
        resetForm
      }
    }
  })
  </script>
  
  <style scoped>
  .create-network {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>