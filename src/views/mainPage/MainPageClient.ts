import { BaseWebsocket } from "@/utils/BackendConnect";

export class SysInfoMainClient extends BaseWebsocket {

    public init = (systemInfo: any) => {
        this.socket.onopen = () => {
            this.wsSend({
                type: "run",
                component: "sysInfo"
            })
        }
        this.socket.onmessage = (ev: any) => {
            if (ev.data) {
                let info = JSON.parse(ev.data)
                if (info["do_return"] === 'get_system_info') {
                    systemInfo.value = info["data"]
                }
            }
        }
    }

    public getSysInfo = () => {
        this.wsSend({
            do: "get_system_info"
        })
    }
}