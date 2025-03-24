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

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }

export class LayoutClient extends BaseWebsocket {

    public menuOptions: any

    constructor () {

        super()

    }

    public init(menuOptions: any) {
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
                for (const i in info) {
                  console.log(i)
                    this.menuOptions.push({
                        label: () =>
                                  h(
                                    RouterLink,
                                    {
                                      to: {
                                        path: info[i].path
                                      }
                                    },
                                    { default: () => info[i].label }
                                  ),
                                key: info[i].key,
                                icon: renderIcon(BookIcon)
                    })
                }
            }
        }
    }
}