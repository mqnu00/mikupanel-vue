<template>
  <div class="tabs-container">
    <el-tabs v-model="activeTab" >
    <el-tab-pane name="container" label="容器">
        <DockerContainer :docker-manager-client="dockerManagerClient"></DockerContainer>
    </el-tab-pane>
    <el-tab-pane name="image" label="镜像">
        <div class="tab-content">
        <DockerImage :docker-manager-client="dockerManagerClient"></DockerImage>
      </div>
      
    </el-tab-pane>
    <el-tab-pane name="repository" label="仓库">
      <DockerWarehouse :docker-manager-client="dockerManagerClient"></DockerWarehouse>
    </el-tab-pane>
    <el-tab-pane name="network" label="网络">
      <DockerNetwork :docker-manager-client="dockerManagerClient"></DockerNetwork>
    </el-tab-pane>
  </el-tabs>
  </div>
    
</template>
<script lang="ts">
import DockerContainer from './DockerContainer.vue';
import DockerImage from './DockerImage.vue';
import { DockerManagerClient } from './DockerManagerClient'
import DockerNetwork from './DockerNetwork.vue';
import DockerWarehouse from './DockerWarehouse.vue';

export default defineComponent({
    name: "DockerManager",
    components: {
        DockerImage,
        DockerWarehouse,
        DockerContainer,
        DockerNetwork
    },
    setup(){
        const activeTab = ref('container'); // 默认激活的标签
        const dockerManagerClient = ref<DockerManagerClient>(new DockerManagerClient());
        onMounted(() => {
            dockerManagerClient.value.init()
            dockerManagerClient.value.dockerCheck()
        })
        return {
            activeTab,
            dockerManagerClient
        }
    }
})

</script>

<style>
.tabs-container {
  width: 100%;
}


</style>