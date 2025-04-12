import { BaseWebsocket } from "@/utils/BackendConnect";
import { RouterLink } from "vue-router";
import { NIcon } from "naive-ui";
import {
    BookOutline as BookIcon,
    PersonOutline as PersonIcon,
    WineOutline as WineIcon,
    ChevronForwardOutline as ExpandIcon,
    ChevronBackOutline as CollapseIcon,
    HomeOutline as HomeIcon,
} from "@vicons/ionicons5";
import { generateDynamicRoutes } from "@/router/dynamicRoutes";
import { useComponentConfigStore } from "@/store/useComponentConfigStore";
import router from "@/router";

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export class LayoutClient extends BaseWebsocket {

    public menuOptions: any

    constructor() {

        super()

    }

    public init(menuOptions: any, activeKey: any) {
        const componentConfigStore = useComponentConfigStore()
        this.menuOptions = menuOptions
        this.socket.onopen = () => {
            this.wsSend({
                type: 'menu',
                dir: 'core.message.action',
                module: 'menu_config'
            })
        }
        this.socket.onmessage = (msg: any) => {
            if (msg.data) {
                const info: any[] = JSON.parse(msg.data)
                console.log(info)
                const routerItems = []
                this.menuOptions = [

                ]
                const now_router = router.currentRoute.value.path
                for (const i in info) {
                    console.log(i)
                    if (!("menu" in info[i])) continue
                    this.menuOptions.push({
                        label: () =>
                            h(
                                RouterLink,
                                {
                                    to: {
                                        path: info[i].menu.path
                                    }
                                },
                                { default: () => info[i].menu.label }
                            ),
                        key: info[i].menu.key,
                        // icon: renderIcon(BookIcon)
                    })
                    routerItems.push(info[i].router)
                }
                generateDynamicRoutes(routerItems)
                componentConfigStore.setComponentConfig(info)
                const selected = info.filter(item => {
                    if (!("menu" in item)) return false;
                    return item.menu.path === now_router
                })[0]
                activeKey.value = selected.menu.key
            }
        }
    }

    public close = () => {
        this.wsSend({
            do: "close"
        })
    }
}