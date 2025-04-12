import { BaseWebsocket } from "@/utils/BackendConnect";

import { SSHInfo } from "./modules/TerminalClient";

export class TerminalConfigClient extends BaseWebsocket {
    sshInfoList: any;

    public setSSHInfoList(sshInfoList: any) {
        this.sshInfoList = sshInfoList
    }

    public init() {
        this.socket.onopen = () => {
            this.wsSend({
                type: "run",
                component: "terminal"
            })
        }
        this.socket.onmessage = (ev: any) => {
            let info = JSON.parse(ev.data)
            if (info["do_return"] === 'getSSHInfo') {
                this.sshInfoList = info["data"]["SSHInfoList"]
            }
        }
    }

    public getSSHInfoList = () => {
        this.wsSend(
            {
                do: "getSSHInfo",
            })
    }

    public getSSHInfoById = (id: number) => {
        this.wsSend({
            do: "getSSHById",
            id: id
        })
    }
}