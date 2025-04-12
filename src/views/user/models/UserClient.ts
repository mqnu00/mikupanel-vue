import { useUserStore } from "@/store/useUserStore";
import { BaseWebsocket } from "@/utils/BackendConnect";

export class UserClient extends BaseWebsocket {

    constructor() {
        super()
    }

    public init() {
        const userStore = useUserStore()
        this.socket.onopen = () => {
            this.wsSend({
                type: 'run',
                dir: 'core.message.action',
                module: 'run',
                component: 'user'
            })
        }
        this.socket.onmessage = (ev: any) => {
            if (ev) {
                const info = ev.data
                userStore.setToken(info)
            }
        }
    }

    public login(username: string, password: string) {
        this.wsSend({
            username: username,
            password: password
        })
    }
}