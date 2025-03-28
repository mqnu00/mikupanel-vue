import { BaseWebsocket } from "@/utils/BackendConnect";

export class UserClient extends BaseWebsocket {

    constructor() {
        super()
    }

    public init() {
        this.socket.onopen = () => {
            this.wsSend({
                type: 'run',
                dir: 'core.message.action',
                module: 'run',
                component: 'user'
            })
        }
        this.socket.onmessage = (data: any) => {

        }
    }

    public login(username: string, password: string) {
        this.wsSend({
            username: username,
            password: password
        })
    }

    public close() {
        this.wsSend({
            username: null
        })
    }
}