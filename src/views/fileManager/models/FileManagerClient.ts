import { ElMessage, ElMessageBox } from "element-plus"
import { AnyAaaaRecord } from "node:dns"
import internal from "node:stream"
import path from "path-browserify"

export interface Path {
    id: number
    parent: string
    dirname: string
    dirtype: string
    size: number | null
    permission: string
    modify_timestamp: number
    owner: string
    group: string
}

export function path_concat(parent: string, name: string) {
    return path.join(parent, name)
}

export function get_path_parent(p: string) {
    return path.dirname(p)
}

export class FileManagerClient {
    public socket: WebSocket
    public tableData: any
    public nowPath: any = '/'
    public fileContent: any
    public breadcrumbItems: any
    public nowInputPath: any
    public dataLoaded: any

    constructor() {
        this.socket = new WebSocket(import.meta.env.VITE_API_BASE_WS_URL)
    }

    private wsSend = (msg: any) => {
        
        if (this.socket.readyState != WebSocket.OPEN) {
            
           if (this.socket.readyState === WebSocket.CONNECTING) {
            setTimeout(() => {
                this.wsSend(msg)
               }, 500)
           }
        } else {
            console.log(msg)
            this.socket.send(JSON.stringify(msg))
        }
    }

    public init(tableData: any, nowPath: any, nowInputPath: any, fileContent: any, breadcrumbItems: any, dataLoaded: any): void {
        this.tableData = tableData
        this.nowPath = nowPath
        this.nowInputPath = nowInputPath
        this.fileContent = fileContent
        this.breadcrumbItems = breadcrumbItems
        this.dataLoaded = dataLoaded
        this.socket.onopen = () => {
            console.log('file create')
            this.wsSend({
                type: 'run',
                dir: 'core.message.action',
                module: 'run',
                component: 'fileManager'
            })
        }

        this.socket.onmessage = (ev: any) => {
            console.log(JSON.parse(ev.data))
            if (ev.data) {
                let info = JSON.parse(ev.data)
                if (info["do_return"] === 'list') {
                    this.tableData = info["data"]["list"]
                    this.nowPath = info["data"]["nowPath"]
                    this.nowInputPath = this.nowPath
                    this.breadcrumbItems = ['/'].concat(
                        (this.nowPath as string).split('/').filter((part) => part.length > 0)
                    )
                    this.dataLoaded = true
                } else if (info["do_return"] === 'openFile') {
                    this.fileContent = info["data"]["content"]
                } else if (info["do_return"] === 'saveFile') {
                    if (info["data"]["isDone"]) {
                        console.log("save file success")
                        ElMessage({
                            message: 'save file success',
                            type: 'success'
                        })
                    } else {
                        ElMessage.error("save file failed")
                    }
                    
                }
            }
        }

        this.socket.onerror = (error: any) => {
            console.log(error)
        }
        this.socket.onclose = () => {

        }
    }

    public getDirList = (currentDir: string) => {
        this.wsSend({
            do: "list",
            data: {
                dir: path_concat(this.nowPath.value, currentDir)
            }
        })
    }

    public closeFileManager = () => {
        console.log(this.socket.readyState)
        this.wsSend({
            do: "close"
        })
    }

    public openFile = (currentDir: string) => {
        this.wsSend({
            do: 'openFile',
            data: {
                dir: path_concat(this.nowPath.value, currentDir)
            }
        })
    }

    public saveFile = (dirname: string, fileContent: string) => {
        this.wsSend({
            do: 'saveFile',
            data: {
                dir: dirname,
                fileContent: fileContent
            }
        })
    }
}