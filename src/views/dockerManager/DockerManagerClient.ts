import { useComponentConfigStore } from "@/store/useComponentConfigStore";
import { BaseWebsocket } from "@/utils/BackendConnect";
import { ElMessage } from "element-plus";

export class DockerManagerClient extends BaseWebsocket {
    
    imageList: any
    sourcesList: any
    containerList: any
    networkList: any

    constructor() {
        super()
    }

    public setImageList = (imageList: any) => {
        this.imageList = imageList
    }

    public setSoucesList = (sourcesList: any) => {
        this.sourcesList = sourcesList
    }

    public setContainerList = (containerList: any) => {
        this.containerList = containerList
    }

    public setNetworkList = (networkList: any) => {
        this.networkList = networkList
    }

    public getSourceList = () => {
        return this.sourcesList
    }

    public init = () => {
        const dockerConfig = useComponentConfigStore().componentConfig.filter(o => {
            return o.name === 'dockerManager'
        })[0];
        console.log(dockerConfig)
        this.socket.onopen = () => {
            console.log('docker open')
            this.wsSend({
                type: 'run',
                component: dockerConfig.name
            })
        }

        this.socket.onmessage = async (ev: any) => {
            if (ev.data) {
                let info = JSON.parse(ev.data)
                console.log(info)
                if (info["do_return"] === 'check_docker') {
                    if (!info.result) {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'error',
                            showClose: true,
                            duration: 5000
                        });
                        this.socket.close()
                    }
                } else if (info["do_return"] === 'get_docker_images') {
                    this.imageList.value = info["images"]
                    console.log(this.imageList)
                } else if (info["do_return"] === 'get_docker_sources') {
                    this.sourcesList.value = info["sources"]

                    for (let i in this.sourcesList.value) {
                        this.testSource(this.sourcesList.value[i].downloadUrl)
                    }

                } else if (info["do_return"] === 'list_all_containers') {
                    this.containerList.value = info["containers"]

                    

                } else if (info["do_return"] === 'get_docker_networks') {
                    this.networkList.value = info["data"]

                    

                } else if (info["do_return"] === 'test_source') {
                    for (let i in this.sourcesList.value) {
                        if (this.sourcesList.value[i].downloadUrl === info["sourceUrl"]) {
                            this.sourcesList.value[i].status = info["status"]
                            this.sourcesList.value[i].msg = info["msg"]
                        }
                    }
                } else if (info["do_return"] === 'add_docker_source') {
                    if (info["result"]) {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'success',
                            showClose: true,
                            duration: 5000
                        })
                    } else {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'error',
                            showClose: true,
                            duration: 5000
                        })
                    }
                    this.getDockerSourcesList()
                } else if (info["do_return"] === 'remove_docker_source') {
                    if (info["result"]) {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'success',
                            showClose: true,
                            duration: 5000
                        })
                    } else {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'error',
                            showClose: true,
                            duration: 5000
                        })
                    }
                    this.getDockerSourcesList()
                }  else if (info["do_return"] === 'remove_image') {
                    if (info["result"]) {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'success',
                            showClose: true,
                            duration: 5000
                        })
                    } else {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'error',
                            showClose: true,
                            duration: 5000
                        })
                    }
                    this.getDockerImageList()
                }  else if (info["do_return"] === 'pull_docker_image') {
                    if (info["result"]) {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'success',
                            showClose: true,
                            duration: 5000
                        })
                    } else {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'error',
                            showClose: true,
                            duration: 5000
                        })
                    }
                    this.getDockerImageList()
                } else if (info["do_return"] === 'create_network') {
                    if (info["result"]) {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'success',
                            showClose: true,
                            duration: 5000
                        })
                    } else {
                        ElMessage({
                            message: `${info.msg}`,
                            type: 'error',
                            showClose: true,
                            duration: 5000
                        })
                    }
                    this.getDockerNetworkList()
                } 
            } 
        }
    }

    public removeImage = (imageId: string) => {
        this.wsSend({
            do: "remove_image",
            data: {
                "image_id": imageId
            }
        })
    }

    public dockerCheck = () => {
        this.wsSend({
            "do": "check_docker"
        })
    }

    public getDockerImageList = () => {
        this.wsSend({
            "do": "get_docker_images"
        })
    }

    public getDockerSourcesList = () => {
        console.log("do-sources")
        this.wsSend({
            "do": "get_docker_sources"
        })
    }

    public testSource = (sourceUrl: string) => {
        this.wsSend({
            do: "test_source",
            data: {
                source_url: sourceUrl
            }
        })
    }

    public addImage = (sourceUrl: string, imageName: string) => {
        this.wsSend({
            do: "pull_docker_image",
            data: {
                repository: sourceUrl,
                image_name: imageName
            }
        })
    }

    public addSource = (sourceUrl: string) => {
        this.wsSend({
            do: "add_docker_source",
            data: {
                source_url: sourceUrl
            }
        })
    }

    public removeSource = (sourceUrl: string) => {
        this.wsSend({
            do: "remove_docker_source",
            data: {
                source_url: sourceUrl
            }
        })
    }

    public getDockerContainerList = () => {
        this.wsSend({
            do: "list_all_containers"
        })
    }

    public getDockerNetworkList = () => {
        this.wsSend({
            do: "get_docker_networks"
        })
    }

    public createNetwork(config: any) {
        this.wsSend({
            do: "create_network",
            "data": {
                network_config: config
            }
        })
    }
}