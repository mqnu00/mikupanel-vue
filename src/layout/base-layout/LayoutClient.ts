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

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }

export class LayoutClient extends BaseWebsocket {

    public menuOptions: any

    constructor () {
        
        super()

    }

    public init(menuOptions: any) {
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
                  {
                    label: () =>
                      h(
                        RouterLink,
                        {
                          to: {
                            path: "/test"
                          }
                        },
                        { default: () => "test" }
                      ),
                    key: "test",
                  },
                  {
                    label: () =>
                      h(
                        RouterLink,
                        {
                          to: {
                            path: "/terminal"
                          }
                        },
                        { default: () => "terminal" }
                      ),
                    key: "terminal",
                  },
                ]
                for (const i in info) {
                    console.log(i)
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
            }
        }
    }

    public close = () => {
      this.wsSend({
        do: "close"
      })
    }
}