<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <el-row :gutter="20">
    <!-- 使用 v-for 循环生成 2x2 网格，每个网格占据 12 格宽度 -->
    <el-col :span="12" v-for="(group, index) in buttonGroups" :key="'group-' + index">
      <div class="chart-container">
        <div :id="group.chart" style="width: 100%; height: 100%;"></div>
      </div>
    </el-col>
  </el-row>
    
</template>

<script lang="ts">

//按需引入
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

//引入创建的echarts.ts文件
import * as echarts from "echarts";
import { getCpuUsage, getDiskUsage, getMemoryUsage, getNetworkUsage } from "../client/sysInfo";

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

        let cpuSocket: WebSocket | null = null;
        let memorySocket: WebSocket | null = null;
        let networkSocket: WebSocket | null = null;
        let diskSocket: WebSocket | null = null;
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
            var cpuInfoChart = echarts.init(cpuEchart);
            cpuInfoChart.clear()

            var memoryEchart = document.getElementById("memoryChart")!;
            var memoryInfoChart = echarts.init(memoryEchart);
            memoryInfoChart.clear()

            var networkEchart = document.getElementById("networkChart")!;
            var networkInfoChart = echarts.init(networkEchart);
            networkInfoChart.clear()

            var diskEchart = document.getElementById("diskChart")!;
            var diskInfoChart = echarts.init(diskEchart);
            diskInfoChart.clear()

            //还可以这样一起写
            // var cpuInfoChart = echarts.init(document.getElementById("cpuChart")!);

            // 指定图表的配置项和数据

            var cpuOption = {
                title: {
                    text: "CPU使用率",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: "line",
                    },
                    formatter: function (data: any[]) {
                        let result = '';
                        data.map((item, index) => {
                            if (item.data.empty) {
                                result = ''
                            } else {
                                result = `
                                <div style="text-align: center;">${item.name}s</div>
                                <style>
                                .container {
                                    display: flex; /* 使用flex布局 */
                                    justify-content: space-between; /* 两端对齐 */
                                }
                                .left-text {
                                    text-align: left; /* 文本靠左 */
                                }
                                .right-text {
                                    text-align: right; /* 文本靠右 */
                                }
                                </style>
                                <div class="container">
                                    <div class="left-text">${item.marker}${item.seriesName}</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data.value}%</div>
                                </div>`
                            }
                        })
                        return result
                    },
                },
                legend: {
                    data: ["CPU"],
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: false,
                    data: Array.from({ length: 60 }, (_, index) => index),
                    name: '/s',
                    axisLabel: {
                        interval: 4
                    }
                }],
                yAxis: [{
                    max: 100,
                    min: 0,
                    interval: 20,
                    type: "value",
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }],
                series: [{
                    name: "CPU",
                    type: "line",
                    areaStyle: {},
                    emphasis: {
                        focus: "series",
                    },
                    symbol: 'none',
                    data: [] as {
                        value: number;
                    }[],
                }],

            };

            var memoryOption = {
                title: {
                    text: "内存使用率",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: "line",
                    },
                    formatter: function (data: any[]) {
                        let result = '';
                        data.map((item, index) => {
                            if (item.data.empty) {
                                result = ''
                            } else {
                                result = `
                                <div style="text-align: center;">${item.name}s</div>
                                <style>
                                .container {
                                    display: flex; /* 使用flex布局 */
                                    justify-content: space-between; /* 两端对齐 */
                                }
                                .left-text {
                                    text-align: left; /* 文本靠左 */
                                }
                                .right-text {
                                    text-align: right; /* 文本靠右 */
                                }
                                </style>
                                <div class="container">
                                    <div class="left-text">${item.marker}${item.seriesName}</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data.value}%</div>
                                </div>
                                <div class="container">
                                    <div class="left-text">已使用</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data.used.toFixed(2)}G</div>
                                </div>
                                <div class="container">
                                    <div class="left-text">空闲</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data.free.toFixed(2)}G</div>
                                </div>`
                            }
                        })
                        return result;
                    }


                },
                legend: {
                    data: ["内存"],
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: false,
                    data: Array.from({ length: 60 }, (_, index) => index),
                    name: '/s',
                    axisLabel: {
                        interval: 4
                    }
                }],
                yAxis: [{
                    max: 100,
                    min: 0,
                    interval: 20,
                    type: "value",
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }],
                series: [{
                    name: "内存",
                    type: "line",
                    emphasis: {
                        focus: "series",
                    },
                    symbol: 'none',
                    data: [] as {
                        value: number;
                        used: number;
                        free: number;
                    }[],
                    itemStyle: {//折线拐点标志的样式
                        borderColor: "#E9CD4B",//拐点的边框颜色
                        borderWidth: 3.5
                    },
                    lineStyle: {//折线的样式
                        color: "rgba(100,100,170,1)"
                    },
                    areaStyle: {//填充的颜色
                        color: {//线性渐变前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                            type: 'linear',
                            x: 0,
                            y: 1,
                            x2: 0,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: 'rgba(255,240,170,0)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(255,240,170,1)' // 100% 处的颜色
                            }],
                            globalCoord: false// 缺省为 false
                        }
                    },
                }],

            };

            var networkOption = {
                title: {
                    text: "网络IO",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: "line",
                    },
                    formatter: function (data: any[]) {
                        let result = '';
                        data.map((item, index) => {
                            if (item.data.empty) {
                                // result = ''
                            } else {
                                if (result == '') {
                                    result = `
                                <div style="text-align: center;">${item.name}s</div>
                                `
                                }
                                result = result + `
                                <style>
                                .container {
                                    display: flex; /* 使用flex布局 */
                                    justify-content: space-between; /* 两端对齐 */
                                }
                                .left-text {
                                    text-align: left; /* 文本靠左 */
                                }
                                .right-text {
                                    text-align: right; /* 文本靠右 */
                                }
                                </style>
                                <div class="container">
                                    <div class="left-text">${item.marker}${item.seriesName}</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data.value.toFixed(2)}MiB/s</div>
                                </div>`


                            }
                        })
                        return result;
                    }
                },
                legend: {
                    data: ["网络上行", "网络下行"],
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: false,
                    data: Array.from({ length: 60 }, (_, index) => index),
                    name: '/s',
                    axisLabel: {
                        interval: 4
                    }
                }],
                yAxis: {
                    show: true,
                    // max: 'auto',
                    // min: 'auto',
                    type: "value",
                    axisLabel: {
                        formatter: '{value}MiB/s'
                    }
                },
                series: [
                    {
                        name: "网络上行",
                        type: "line",
                        emphasis: {
                            focus: "series",
                        },
                        symbol: 'none',
                        data: [] as {
                            value: number;
                        }[],
                        itemStyle: {//折线拐点标志的样式
                            borderColor: "#E9CD4B",//拐点的边框颜色
                            borderWidth: 3.5
                        },
                        lineStyle: {//折线的样式
                            color: "rgba(100,100,170,1)"
                        },
                        areaStyle: {//填充的颜色
                            color: {//线性渐变前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                                type: 'linear',
                                x: 0,
                                y: 1,
                                x2: 0,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: 'rgba(100,100,170,1)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(255,240,170,1)' // 100% 处的颜色
                                }],
                                globalCoord: false// 缺省为 false
                            }
                        },
                    }, {
                        name: "网络下行",
                        type: "line",
                        emphasis: {
                            focus: "series",
                        },
                        symbol: 'none',
                        data: [] as {
                            value: number;
                        }[],
                        itemStyle: {//折线拐点标志的样式
                            borderColor: "#E9CD4B",//拐点的边框颜色
                            borderWidth: 3.5
                        },
                        lineStyle: {//折线的样式
                            color: "rgba(10,240,10,0)"
                        },
                        areaStyle: {//填充的颜色
                            color: {//线性渐变前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                                type: 'linear',
                                x: 0,
                                y: 1,
                                x2: 0,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: 'rgba(10,240,10,0)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(255,240,170,1)' // 100% 处的颜色
                                }],
                                globalCoord: false// 缺省为 false
                            }
                        },
                    }],

            };

            var diskOption = {
                title: {
                    text: "磁盘IO",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: "line",
                    },
                    formatter: function (data: any[]) {
                        let result = '';
                        data.map((item, index) => {
                            if (item.data.empty) {
                                // result = ''
                            } else {
                                if (result == '') {
                                    result = `
                                <div style="text-align: center;">${item.name}s</div>
                                `
                                }
                                result = result + `
                                <style>
                                .container {
                                    display: flex; /* 使用flex布局 */
                                    justify-content: space-between; /* 两端对齐 */
                                }
                                .left-text {
                                    text-align: left; /* 文本靠左 */
                                }
                                .right-text {
                                    text-align: right; /* 文本靠右 */
                                }
                                </style>
                                <div class="container">
                                    <div class="left-text">${item.marker}${item.seriesName}</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data.value.toFixed(2)}MiB/s</div>
                                </div>`


                            }
                        })
                        return result;
                    }
                },
                legend: {
                    data: ["磁盘读取", "磁盘写入"],
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: false,
                    data: Array.from({ length: 60 }, (_, index) => index),
                    name: '/s',
                    axisLabel: {
                        interval: 4
                    }
                }],
                yAxis: {
                    show: true,
                    // max: 'auto',
                    // min: 'auto',
                    type: "value",
                    axisLabel: {
                        formatter: '{value}MiB/s'
                    }
                },
                series: [
                    {
                        name: "磁盘读取",
                        type: "line",
                        emphasis: {
                            focus: "series",
                        },
                        symbol: 'none',
                        data: [] as {
                            value: number;
                        }[],
                        itemStyle: {//折线拐点标志的样式
                            borderColor: "#E9CD4B",//拐点的边框颜色
                            borderWidth: 3.5
                        },
                        lineStyle: {//折线的样式
                            color: "rgba(100,100,170,1)"
                        },
                        areaStyle: {//填充的颜色
                            color: {//线性渐变前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                                type: 'linear',
                                x: 0,
                                y: 1,
                                x2: 0,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: 'rgba(100,100,170,1)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(255,240,170,1)' // 100% 处的颜色
                                }],
                                globalCoord: false// 缺省为 false
                            }
                        },
                    }, {
                        name: "磁盘写入",
                        type: "line",
                        emphasis: {
                            focus: "series",
                        },
                        symbol: 'none',
                        data: [] as {
                            value: number;
                        }[],
                        itemStyle: {//折线拐点标志的样式
                            borderColor: "#E9CD4B",//拐点的边框颜色
                            borderWidth: 3.5
                        },
                        lineStyle: {//折线的样式
                            color: "rgba(10,240,10,0)"
                        },
                        areaStyle: {//填充的颜色
                            color: {//线性渐变前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                                type: 'linear',
                                x: 0,
                                y: 1,
                                x2: 0,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: 'rgba(10,240,10,0)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(255,240,170,1)' // 100% 处的颜色
                                }],
                                globalCoord: false// 缺省为 false
                            }
                        },
                    }],

            };

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

                cpuSocket = getCpuUsage((data) => {
                    let inputData = [{
                        value: parseFloat(data)
                    }]
                    cpuInfoChart.setOption(cpuOnMessage.onMessage(cpuOption, inputData, cpuInfoChart))
                })

                memorySocket = getMemoryUsage((data) => {
                    let dataP = JSON.parse(data)
                    let inputData = [{
                        value: parseFloat(dataP.value),
                        used: parseFloat(dataP.used),
                        free: parseFloat(dataP.free)
                    }]
                    memoryInfoChart.setOption(memoryOnMessage.onMessage(memoryOption, inputData, memoryInfoChart))
                })

                networkSocket = getNetworkUsage((data) => {
                    let dataP = JSON.parse(data)
                    let inputData = [{
                        value: parseFloat(dataP.send)
                    }, {
                        value: parseFloat(dataP.recv)
                    }]

                    networkInfoChart.setOption(networkOnMessage.onMessage(networkOption, inputData, networkInfoChart))
                })

                diskSocket = getDiskUsage((data) => {
                    let dataP = JSON.parse(data)
                    let inputData = [{
                        value: parseFloat(dataP.read)
                    }, {
                        value: parseFloat(dataP.write)
                    }]

                    diskInfoChart.setOption(diskOnMessage.onMessage(diskOption, inputData, diskInfoChart))
                })

            } catch (error) {
                console.log(error)
            }

            // 使用刚指定的配置项option和数据显示图表cpuInfoChart。
            cpuInfoChart.setOption(cpuOption);
            memoryInfoChart.setOption(memoryOption);
            networkInfoChart.setOption(networkOption);
            diskInfoChart.setOption(diskOption);

            const viewElem = document.body;
            const resizeObserver = new ResizeObserver(() => {

                // 此处放 当窗口大小发生变化时，想要让宽高自适应的图表的.resize()，除此处外其余都是固定写法，举例如下
                cpuInfoChart.resize();
                memoryInfoChart.resize();
                networkInfoChart.resize();
                diskInfoChart.resize();

                setTimeout(() => {
                    cpuInfoChart.resize();
                    memoryInfoChart.resize();
                    networkInfoChart.resize();
                    diskInfoChart.resize();
                }, 100);
            });

            resizeObserver.observe(viewElem);
        });

        onUnmounted(() => {
            if (cpuSocket) {
                cpuSocket.close();
            }
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
  height: 400px; /* 高度可以根据需要调整 */
  width: 100%;
}
</style>