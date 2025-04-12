<template>
    <div class="create-container">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="150px"
        label-position="left"
      >
        <!-- 基础配置 -->
        <el-card class="form-section">
          <template #header>
            <span>基础配置</span>
          </template>
  
          <el-form-item label="容器名称" prop="name">
            <el-input v-model="form.name" placeholder="my-container" />
          </el-form-item>
  
          <el-form-item label="选择镜像" prop="image">
            <el-select
              v-model="form.image"
              filterable
              remote
              reserve-keyword
              placeholder="输入镜像名称 (如 nginx:latest)"
              :remote-method="searchImages"
              :loading="imageLoading"
            >
              <el-option
                v-for="img in availableImages"
                :key="img.id"
                :label="img.RepoTags[0]"
                :value="img.RepoTags[0]"
              />
            </el-select>
          </el-form-item>
  
          <el-form-item label="自动重启策略">
            <el-select v-model="form.restartPolicy">
              <el-option label="不自动重启" value="no" />
              <el-option label="失败时重启" value="on-failure" />
              <el-option label="总是重启" value="always" />
              <el-option label="除非手动停止" value="unless-stopped" />
            </el-select>
          </el-form-item>
        </el-card>
  
        <!-- 网络配置 -->
        <el-card class="form-section">
          <template #header>
            <span>网络配置</span>
          </template>
  
          <el-form-item label="网络模式">
            <el-select v-model="form.networkMode">
              <el-option 
                v-for="net in availableNetworks"
                :key="net.id"
                :label="net.name"
                :value="net.name"
              />
            </el-select>
          </el-form-item>
  
          <el-form-item label="主机名">
            <el-input v-model="form.hostname" placeholder="container-hostname" />
          </el-form-item>

          <!-- 添加 IP 地址字段 -->
            <el-form-item label="容器 IP 地址">
                <el-input v-model="form.ipAddress" placeholder="192.168.1.10" />
            </el-form-item>
        </el-card>
  
        <!-- 端口映射 -->
        <el-card class="form-section">
          <template #header>
            <div class="flex-between">
              <span>端口映射</span>
              <el-button 
                type="primary" 
                size="small" 
                @click="addPortMapping"
              >
                添加映射
              </el-button>
            </div>
          </template>
  
          <el-form-item 
            v-for="(port, index) in form.portMappings" 
            :key="index"
            :prop="'portMappings.' + index + '.hostPort'"
            :rules="portRules"
          >
            <div class="port-mapping">
              <el-input
                v-model.number="port.hostPort"
                placeholder="主机端口"
                style="width: 120px"
              />
              <span class="mx-2">→</span>
              <el-input
                v-model.number="port.containerPort"
                placeholder="容器端口"
                style="width: 120px"
              />
              <el-select
                v-model="port.protocol"
                style="width: 100px"
                class="ml-2"
              >
                <el-option label="TCP" value="tcp" />
                <el-option label="UDP" value="udp" />
              </el-select>
              <el-button
                type="danger"
                circle
                icon="Delete"
                class="ml-2"
                @click="removePortMapping(index)"
              />
            </div>
          </el-form-item>
        </el-card>
  
        <!-- 环境变量 -->
        <el-card class="form-section">
          <template #header>
            <div class="flex-between">
              <span>环境变量</span>
              <el-button 
                type="primary" 
                size="small" 
                @click="addEnvironmentVar"
              >
                添加变量
              </el-button>
            </div>
          </template>
  
          <el-form-item
            v-for="(env, index) in form.environment"
            :key="index"
            :prop="'environment.' + index + '.key'"
            :rules="envRules"
          >
            <div class="env-var">
              <el-input
                v-model="env.key"
                placeholder="变量名"
                style="width: 200px"
              />
              <span class="mx-2">=</span>
              <el-input
                v-model="env.value"
                placeholder="变量值"
                style="flex: 1"
              />
              <el-button
                type="danger"
                circle
                icon="Delete"
                class="ml-2"
                @click="removeEnvironmentVar(index)"
              />
            </div>
          </el-form-item>
        </el-card>
  
        <!-- 存储卷 -->
        <el-card class="form-section">
          <template #header>
            <div class="flex-between">
              <span>存储卷</span>
              <el-button 
                type="primary" 
                size="small" 
                @click="addVolume"
              >
                添加卷
              </el-button>
            </div>
          </template>
  
          <el-form-item
            v-for="(vol, index) in form.volumes"
            :key="index"
          >
            <div class="volume-mount">
              <el-input
                v-model="vol.hostPath"
                placeholder="主机路径"
                style="width: 250px"
              />
              <span class="mx-2">→</span>
              <el-input
                v-model="vol.containerPath"
                placeholder="容器路径"
                style="width: 250px"
              />
              <el-select
                v-model="vol.mode"
                style="width: 100px"
                class="ml-2"
              >
                <el-option label="读写" value="rw" />
                <el-option label="只读" value="ro" />
              </el-select>
              <el-button
                type="danger"
                circle
                icon="Delete"
                class="ml-2"
                @click="removeVolume(index)"
              />
            </div>
          </el-form-item>
        </el-card>
  
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="submitting"
            @click="submitForm"
          >
            创建容器
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
  
  interface PortMapping {
    hostPort: number | null
    containerPort: number | null
    protocol: string
  }
  
  interface EnvironmentVar {
    key: string
    value: string
  }
  
  interface VolumeMount {
    hostPath: string
    containerPath: string
    mode: string
  }
  
  export default defineComponent({
    name: "CreateContainer",
    props: {
      dockerManagerClient: {
        type: DockerManagerClient,
        required: true
      }
    },
    setup(props) {
      const formRef = ref<FormInstance>()
      const submitting = ref(false)
      const imageLoading = ref(false)
      const availableImages = ref<any[]>(props.dockerManagerClient.getImageList())
      const availableNetworks = ref<any[]>(props.dockerManagerClient.getNetworkList())
  
      const form = reactive({
        name: '',
        image: '',
        restartPolicy: 'no',
        networkMode: 'bridge',
        hostname: '',
        ipAddress: '',
        portMappings: [] as PortMapping[],
        environment: [] as EnvironmentVar[],
        volumes: [] as VolumeMount[]
      })
  
      // 验证规则
      const portRules = {
        hostPort: [
          { required: true, message: '请输入主机端口', trigger: 'blur' },
          { type: 'number', min: 1, max: 65535, message: '端口范围1-65535', trigger: 'blur' }
        ],
        containerPort: [
          { required: true, message: '请输入容器端口', trigger: 'blur' },
          { type: 'number', min: 1, max: 65535, message: '端口范围1-65535', trigger: 'blur' }
        ]
      }
  
      const envRules = {
        key: [
          { required: true, message: '请输入变量名', trigger: 'blur' },
          { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '无效的环境变量名', trigger: 'blur' }
        ]
      }
  
      const rules: FormRules = {
        name: [
          { required: true, message: '请输入容器名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/, message: '无效的容器名称', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请选择镜像', trigger: 'change' }
        ],
        ipAddress: [
            { required: true, message: '请输入容器 IP 地址', trigger: 'blur' },
            { pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '无效的 IP 地址', trigger: 'blur' }
        ]
      }
  
      // 搜索镜像
      const searchImages = async (query: string) => {
        if (!query) return
        try {
          imageLoading.value = true
          const images = await props.dockerManagerClient.searchImages(query)
          availableImages.value = images
        } catch (error) {
          ElMessage.error(`搜索镜像失败: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
          imageLoading.value = false
        }
      }
  
      // 添加端口映射
      const addPortMapping = () => {
        form.portMappings.push({
          hostPort: null,
          containerPort: null,
          protocol: 'tcp'
        })
      }
  
      // 移除端口映射
      const removePortMapping = (index: number) => {
        form.portMappings.splice(index, 1)
      }
  
      // 添加环境变量
      const addEnvironmentVar = () => {
        form.environment.push({
          key: '',
          value: ''
        })
      }
  
      // 移除环境变量
      const removeEnvironmentVar = (index: number) => {
        form.environment.splice(index, 1)
      }
  
      // 添加存储卷
      const addVolume = () => {
        form.volumes.push({
          hostPath: '',
          containerPath: '',
          mode: 'rw'
        })
      }
  
      // 移除存储卷
      const removeVolume = (index: number) => {
        form.volumes.splice(index, 1)
      }
  
      // 提交表单
      const submitForm = async () => {
        if (!formRef.value) return
  
        try {
          await formRef.value.validate()
          submitting.value = true
  
          // 构建创建配置
          const config: any = {
            name: form.name,
            image: form.image,
            hostname: form.hostname || undefined,
            host_config: {
              restart_policy: {
                name: form.restartPolicy,
                maximum_retry_count: form.restartPolicy === 'on-failure' ? 5 : 0
              },
              network_mode: form.networkMode
            },
            ip_address: form.ipAddress,
            exposed_ports: form.portMappings.reduce((acc, port) => {
              acc[`${port.containerPort}/${port.protocol}`] = {}
              return acc
            }, {} as Record<string, any>),
            env: form.environment
              .filter(env => env.key)
              .map(env => `${env.key}=${env.value}`),
            volumes: form.volumes.reduce((acc, vol) => {
              acc[vol.containerPath] = {}
              return acc
            }, {} as Record<string, any>)
          }
  
          // 添加端口绑定
          if (form.portMappings.length > 0) {
            config.host_config.port_bindings = form.portMappings.reduce((acc, port) => {
              acc[`${port.containerPort}/${port.protocol}`] = [
                { HostPort: String(port.hostPort) }
              ]
              return acc
            }, {} as Record<string, any>)
          }
  
          // 添加卷绑定
          if (form.volumes.length > 0) {
            config.host_config.binds = form.volumes.map(vol => 
              `${vol.hostPath}:${vol.containerPath}:${vol.mode}`
            )
          }

          console.log(config)

          props.dockerManagerClient.createContainer(config)
  
          // 调用创建接口
          resetForm()
  
        } catch (error) {
          ElMessage.error(`创建失败: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
          submitting.value = false
        }
      }
  
      // 重置表单
      const resetForm = () => {
        formRef.value?.resetFields()
        form.portMappings = []
        form.environment = []
        form.volumes = []
      }
  
      return {
        formRef,
        form,
        rules,
        portRules,
        envRules,
        submitting,
        imageLoading,
        availableImages,
        availableNetworks,
        searchImages,
        addPortMapping,
        removePortMapping,
        addEnvironmentVar,
        removeEnvironmentVar,
        addVolume,
        removeVolume,
        submitForm,
        resetForm
      }
    }
  })
  </script>
  
  <style scoped>
  .create-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .form-section {
    margin-bottom: 20px;
  }
  
  .port-mapping,
  .env-var,
  .volume-mount {
    display:flex;
    align-items: center;
  }
  
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .mx-2 {
    margin: 0 8px;
  }
  
  .ml-2 {
    margin-left: 8px;
  }
  </style>