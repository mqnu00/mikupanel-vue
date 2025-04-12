import { useComponentConfigStore } from "@/store/useComponentConfigStore";
import { BaseWebsocket } from "@/utils/BackendConnect";
import { ElMessage } from "element-plus";

export class DockerManagerClient extends BaseWebsocket {
    
    imageList: any
    sourcesList: any
    containerList: any
    networkList: any
    containerLog: any

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

    public setContainerLog = (containerLog: any) => {
        this.containerLog = containerLog
    }

    public setNetworkList = (networkList: any) => {
        this.networkList = networkList
    }

    public getSourceList = () => {
        return this.sourcesList
    }

    public getImageList = () => {
        return this.imageList
    }

    public getNetworkList = () => {
        return this.networkList
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
                let info = JSON.parse(ev.data);
                console.log(info);
        
                const handleResult = (result: boolean, msg: string, successMsg: string, errorMsg: string) => {
                    if (result) {
                        ElMessage({
                            message: `${msg}`,
                            type: 'success',
                            showClose: true,
                            duration: 5000
                        });
                    } else {
                        ElMessage({
                            message: `${msg}`,
                            type: 'error',
                            showClose: true,
                            duration: 5000
                        });
                    }
                };
        
                switch (info["do_return"]) {
                    case 'check_docker':
                        if (!info.result) {
                            ElMessage({
                                message: `${info.msg}`,
                                type: 'error',
                                showClose: true,
                                duration: 5000
                            });
                            this.socket.close();
                        }
                        break;
        
                    case 'get_docker_images':
                        this.imageList.value = info["images"];
                        break;
        
                    case 'get_docker_sources':
                        this.sourcesList.value = info["sources"];
                        for (let i in this.sourcesList.value) {
                            this.testSource(this.sourcesList.value[i].downloadUrl);
                        }
                        break;
        
                    case 'list_all_containers':
                        this.containerList.value = info["containers"];
                        break;
        
                    case 'get_docker_networks':
                        this.networkList.value = info["data"];
                        break;

                    case 'get_container_logs':
                        handleResult(info.result, info.msg, '操作成功', '操作失败');
                        this.containerLog.value = info["data"]["logs"]
                        break;
        
                    case 'test_source':
                        for (let i in this.sourcesList.value) {
                            if (this.sourcesList.value[i].downloadUrl === info["sourceUrl"]) {
                                this.sourcesList.value[i].status = info["status"];
                                this.sourcesList.value[i].msg = info["msg"];
                            }
                        }
                        break;
        
                    case 'add_docker_source':
                    case 'remove_docker_source':
                    case 'remove_image':
                    case 'pull_docker_image':
                    case 'create_network':
                    case 'delete_network':
                    case 'create_container':
                    case 'start_container':
                    case 'stop_container':
                    case '':
                        handleResult(info.result, info.msg, '操作成功', '操作失败');
                        this.getDockerSourcesList();
                        this.getDockerImageList();
                        this.getDockerNetworkList();
                        this.getDockerContainerList();
                        break;
        
                    default:
                        console.warn(`未知的返回类型: ${info["do_return"]}`);
                        break;
                }
            }
        };
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

    public deleteNetwork(ident: string) {
        this.wsSend({
            do: "delete_network",
            data: {
                network_identifier: ident
            }
        })
    }

    public createContainer(config: any) {
        this.wsSend({
            do: "create_container",
            data: {
                config: config
            }
        })
    }

    public startContainer(containerId: string) {
        this.wsSend({
            do: "start_container",
            data: {
                container_id: containerId
            }
        })
    }

    public stopContainer(containerId: string) {
        this.wsSend({
            do: "stop_container",
            data: {
                container_id: containerId
            }
        })
    }

    public getContainerLog(containerId: string) {
        this.wsSend({
            do: "get_container_logs",
            data: {
                container_id: containerId
            }
        })
    }
}