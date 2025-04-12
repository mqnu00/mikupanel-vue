<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
     <div style="height: calc(100vh - 80px)">
        <el-row :gutter="20">
    <!-- 使用 v-for 循环生成 2x2 网格，每个网格占据 12 格宽度 -->
    <el-col :span="12" v-for="(group, index) in buttonGroups" :key="'group-' + index">
      <div class="chart-container">
        <div :id="group.chart" style="width: 100%; height: 100%;"></div>
      </div>
    </el-col>
  </el-row>
     </div>
    
    
</template>

<script lang="ts">

//按需引入
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

//引入创建的echarts.ts文件
import * as echarts from "echarts";
import { SysInfoClient } from "./SysInfoClient";
export default defineComponent({

    methods: {
        check(name: string) {
            if (name.includes("cpu")) {
                this.cpuSelected = name
            } else if (name.includes("memory")) {
                this.memorySelected = name
            } else if (name.includes("network")) {
                this.networkSelected = name
            } else {
                this.diskSelected = name
            }
        },

        getActive(name: string) {
            if (name.includes("cpu") && this.cpuSelected === name) {
                return true;
            } else if (name.includes("memory") && this.memorySelected === name) {
                return true;
            } else if (name.includes("network") && this.networkSelected === name) {
                return true;
            } else if (name.includes("disk") && this.diskSelected === name) {
                return true;
            } else return false;
        }
    },

    setup() {

        const cpuInfoChart = shallowRef<echarts.ECharts|null>(null);
        const memoryInfoChart = shallowRef<echarts.ECharts|null>(null);
        const networkInfoChart = shallowRef<echarts.ECharts|null>(null);
        const diskInfoChart = shallowRef<echarts.ECharts|null>(null);
        const sysInfoClient = ref(new SysInfoClient());
        /**
         * 在使用init方法初始化图表之前，确保DOM元素已经被正确加载。在Vue组件中，
         * 可以使用onMounted钩子函数来确保在DOM准备就绪后再执行初始化操作。
         */
        //如果不使用这个钩子可能会报错
        onMounted(() => {
            /**
              !是非空断言运算符，表示确保找到了匹配的元素，如果找不到元素或其值为
          null 或 undefined，会引发错误。
              document.getElementById("cpuChart") 是调用 getElementById 方法，
          传入参数 “cpuChart”，用于获取具有 id 为 “cpuChart” 的元素。
              echarts.init() 方法用于初始化一个 echarts 图表实例。
          */

            // 基于准备好的dom，初始化echarts实例
            var cpuEchart = document.getElementById("cpuChart")!;
            cpuInfoChart.value = echarts.init(cpuEchart);
            cpuInfoChart.value.clear()

            var memoryEchart = document.getElementById("memoryChart")!;
            memoryInfoChart.value = echarts.init(memoryEchart);
            memoryInfoChart.value.clear()

            var networkEchart = document.getElementById("networkChart")!;
            networkInfoChart.value = echarts.init(networkEchart);
            networkInfoChart.value.clear()

            var diskEchart = document.getElementById("diskChart")!;
            diskInfoChart.value = echarts.init(diskEchart);
            diskInfoChart.value.clear()

            sysInfoClient.value.init(cpuInfoChart, memoryInfoChart, diskInfoChart, networkInfoChart)

            //还可以这样一起写
            // var cpuInfoChart = echarts.init(document.getElementById("cpuChart")!);

            // 指定图表的配置项和数据

            

            try {

                class SysInfoOnMessage {
                    private i = 0;
                    onMessage(option: any, data: any, chart: any) {
                        for (let itr = 0; itr < data.length; itr++) {
                            option.series[itr].data.push(data[itr])
                        }
                        if (this.i == 60) {
                            for (let itr = 0; itr < data.length; itr++) {
                                option.series[itr].data.splice(0, 1)
                            }
                        } else this.i = this.i + 1;
                        return option;
                    }
                }

                let cpuOnMessage = new SysInfoOnMessage();
                let memoryOnMessage = new SysInfoOnMessage();
                let networkOnMessage = new SysInfoOnMessage();
                let diskOnMessage = new SysInfoOnMessage();

                // cpuSocket = getCpuUsage((data) => {
                //     let inputData = [{
                //         value: parseFloat(data)
                //     }]
                //     cpuInfoChart.setOption(cpuOnMessage.onMessage(cpuOption, inputData, cpuInfoChart))
                // })

                // memorySocket = getMemoryUsage((data) => {
                //     let dataP = JSON.parse(data)
                //     let inputData = [{
                //         value: parseFloat(dataP.value),
                //         used: parseFloat(dataP.used),
                //         free: parseFloat(dataP.free)
                //     }]
                //     memoryInfoChart.setOption(memoryOnMessage.onMessage(memoryOption, inputData, memoryInfoChart))
                // })

                // networkSocket = getNetworkUsage((data) => {
                //     let dataP = JSON.parse(data)
                //     let inputData = [{
                //         value: parseFloat(dataP.send)
                //     }, {
                //         value: parseFloat(dataP.recv)
                //     }]

                //     networkInfoChart.setOption(networkOnMessage.onMessage(networkOption, inputData, networkInfoChart))
                // })

                // diskSocket = getDiskUsage((data) => {
                //     let dataP = JSON.parse(data)
                //     let inputData = [{
                //         value: parseFloat(dataP.read)
                //     }, {
                //         value: parseFloat(dataP.write)
                //     }]

                //     diskInfoChart.value?.setOption(diskOnMessage.onMessage(diskOption, inputData, diskInfoChart))
                // })

            } catch (error) {
                console.log(error)
            }

            // 使用刚指定的配置项option和数据显示图表cpuInfoChart。
            // cpuInfoChart.value.setOption(cpuOption);
            // memoryInfoChart.setOption(memoryOption);
            // networkInfoChart.setOption(networkOption);
            // diskInfoChart.setOption(diskOption);

            const viewElem = document.body;
            const resizeObserver = new ResizeObserver(() => {

                // 此处放 当窗口大小发生变化时，想要让宽高自适应的图表的.resize()，除此处外其余都是固定写法，举例如下
                cpuInfoChart.value?.resize();
                memoryInfoChart.value?.resize();
                networkInfoChart.value?.resize();
                diskInfoChart.value?.resize();

                setTimeout(() => {
                    cpuInfoChart.value?.resize();
                    memoryInfoChart.value?.resize();
                    networkInfoChart.value?.resize();
                    diskInfoChart.value?.resize();
                }, 100);
            });

            resizeObserver.observe(viewElem);

            setInterval(() => {
                sysInfoClient.value.getCpuPer()
            }, 1000)

            setInterval(() => {
                sysInfoClient.value.getMemPer()
            }, 1000)

            setInterval(() => {
                sysInfoClient.value.getDiskPer()
            }, 1000)

            setInterval(() => {
                sysInfoClient.value.getNetworkPer()
            }, 1000)
        });

        onUnmounted(() => {
            sysInfoClient.value.close()
        })

        return {
            cputime: '',
            cpuSelected: ref("cpu1"),
            memorySelected: ref("memory1"),
            networkSelected: ref("network1"),
            diskSelected: ref("disk1"),
            buttonGroups: [
                {
                    buttons: [
                        {
                            id: "cpu1",
                            name: '实时'
                        },
                        {
                            id: "cpu2",
                            name: '过去1周'
                        },
                        {
                            id: "cpu3",
                            name: '过去1个月'
                        }
                    ],
                    chart: 'cpuChart'
                },
                {
                    buttons: [
                        {
                            id: "memory1",
                            name: '实时'
                        },
                        {
                            id: "memory2",
                            name: '过去1周'
                        },
                        {
                            id: "memory3",
                            name: '过去1个月'
                        }
                    ],
                    chart: 'memoryChart'
                },
                {
                    buttons: [
                        {
                            id: "network1",
                            name: '实时'
                        },
                        {
                            id: "network2",
                            name: '过去1周'
                        },
                        {
                            id: "network3",
                            name: '过去1个月'
                        }
                    ],
                    chart: 'networkChart'
                },
                {
                    buttons: [
                        {
                            id: "disk1",
                            name: '实时==='
                        },
                        {
                            id: "disk2",
                            name: '过去1周'
                        },
                        {
                            id: "disk3",
                            name: '过去1个月'
                        }
                    ],
                    chart: 'diskChart'
                },
            ]
        };
    },
});
</script>

<style scoped>
.chart-container {
  height: calc((100vh - 80px) / 2 - 10px); /* 高度可以根据需要调整 */
  width: 100%;
}
</style>