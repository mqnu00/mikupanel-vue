import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"

export class SSHInfo {
    public host: string
    public port: number
    public username: string
    public password: string

    constructor(
        host: string,
        port: number,
        username: string,
        password: string
    ) {
        this.host = host
        this.port = port
        this.username = username
        this.password = password
    }
}

export class TerminalClient {
    public socket: WebSocket
    private uid: string
    private messageQueue: any[] = []
    public term: Terminal | null = null
    public fitAtton: FitAddon | null = null
    public sshInfoList: any

    constructor() {
        this.socket = new WebSocket(import.meta.env.VITE_API_BASE_WS_URL)
        this.uid = ''
    }

    public setSSHInfoList(sshInfoList: any) {
        this.sshInfoList = sshInfoList
    }

    private wsSend = (msg: any) => {
        
        if (this.socket.readyState != WebSocket.OPEN) {
           
        } else {
            console.log(this.uid)
            this.socket.send(msg)
        }
    }

    public init(id: number, term: Terminal, fitAtton: FitAddon): void {

        this.term = term
        this.fitAtton = fitAtton
        this.socket.onopen = () => {
            console.log("terminal on create")
            this.socket.send(
                JSON.stringify({
                    type: 'run',
                    dir: 'core.message.action',
                    module: 'run',
                    component: 'terminal'
                })
            );
            this.addTerminal(id)
        }
        this.socket.onmessage = (ev: any) => {
            if (ev.data) {
                let info = JSON.parse(ev.data)
                if (info["do_return"] === 'create') {
                    this.uid = info["data"]["uid"]
                    console.log(this.uid)
                    setTimeout(() => {
                        this.resizeTerminal()
                      }, 100)
                    
                  } else if (info["do_return"] === 'send') {
                    let msg = info["data"]["msg"]
                    let uid = info["data"]["uid"]
                    term.write(msg)
                    // 将数据写入终端
                  } else if (info["do_return"] === 'delete') {
                    let uid = info["data"]["uid"]
                    // 销毁终端实例
        
                    // 关闭 WebSocket 连接
                    this.socket.close()
                    // 移除终端
                    // 移除 FitAddon
        
                    // 如果删除的是当前选中的终端，需要激活其他终端
                    // 激活第一个 terminal
                    // 如果没有终端，清空选中的 tab
                } 
            }
        }
        this.socket.onerror = (error: any) => {
            console.log(error)
        }
        this.socket.onclose = () => {
            console.log('ws close')
        }
    }

    private addTerminal = (id: number) => {
        console.log("create terminal")
        this.wsSend(
            JSON.stringify({
                do: "create",
                data: {
                  sshInfoId: id
                }
              })
        )
    }

    public removeTerminal = () => {
        this.wsSend(
            JSON.stringify({
                do: "delete",
                data: {
                  uid: this.uid
                }
              })
            )
    }

    public sendToTerminal = (msg: any) => {
        this.wsSend(
            JSON.stringify({
                do: "send",
                data: {
                  uid: this.uid,
                  msg: {
                    type: 'cmd',
                    msg: msg
                  }
                }
              })
        )
    }

    public resizeTerminal = () => {
        if (this.uid === "") return ;
        this.fitAtton?.fit()
        this.wsSend(
            JSON.stringify({
                do: "send",
                data: {
                  uid: this.uid,
                  msg: {
                    type: 'resize',
                    cols: this.term?.cols,
                    rows: this.term?.rows
                  }
                }
              })
        )
    }

    public getSSHInfoById = (id: number) => {
        this.wsSend({
            do: "getSSHById",
            id: id
        })
    }
    
}