import { BaseHttp, BaseWebsocket } from "@/utils/BackendConnect";
import { AxiosRequestConfig } from "axios";

export class ComponentConfigHttp extends BaseHttp {
    constructor() {
        super('http://192.168.177.129:8000')
    }

    // 封装文件上传方法
    public async uploadFile(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);

        const config: AxiosRequestConfig = {
            method: 'post',
            url: '/install_component',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            const response = await this.instance.request<any>(config);
            console.log(response)
            return response.data; // 返回响应数据
        } catch (error) {
            throw error; // 抛出错误
        }
    }
}

export class ComponentConfigClient extends BaseWebsocket {

    componentConfigHttp: ComponentConfigHttp

    constructor() {
        super()
        this.componentConfigHttp = new ComponentConfigHttp()
    }

    public init = () => {
        this.socket.onopen = () => {
            this.wsSend({
                type: "component-config",
            })
        }
        this.socket.onmessage = (ev: any) => {
            if (ev) {
                let info = JSON.parse(ev.data)
                if (info["do_return"] === 'install') {
                    console.log(info)
                }
            }
        }
    }

    private installComponent = (compressFile: string) => {
        console.log("install")
        this.wsSend({
            do: "install",
            compressFile: compressFile
        })
    }

    public uninstallComponent = (components: any[]) => {
        for (const i in components) {
            this.wsSend({
                do: "uninstall",
                component: components[i].name
            })
        }
    }

    public updateFile = (file: any) => {
        console.log(file)
        const response = this.componentConfigHttp.uploadFile(file)
        console.log(response)
        response.then((result) => {
            if (result.status) {
                this.installComponent(result.compressFile)
            }
        })
        return response 
    }

    public close = () => {
        this.wsSend({
            do: "close"
        })
    }
}