<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div class="tot">
        <div class="chart-with-button" v-for="(group, index) in buttonGroups" :key="'group-' + index">




            <div class="cpu">
                <button v-for="item in group.buttons" :key="item.id" class="toggle-button">{{ item.name }}
                </button>
            </div>

            <div :id="group.chart" class="chart-container"></div>

        </div>

    </div>
    <!-- 切换图表的按钮组 -->
    <!-- <div class="cpu"></div>
                <button class="toggle-button" 
                :class="{ 'active': radio1 === '流量' }"
                @click="check('流量')"
                >
                    流量
                </button>
                <button class="toggle-button" 
                :class="{ 'active': radio1 === '磁盘IO' }"
                @click="check('磁盘IO')">
                    磁盘IO
                </button>
                <button class="toggle-button"
                :class="{ 'active': radio1 === '测试' }"
                @click="check('测试')">
                测试
                </button>
            </div> -->
</template>

<script lang="ts">

//按需引入
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

//引入创建的echarts.ts文件
import * as echarts from "echarts";
import { getCpuUsage, getMemoryUsage, getNetworkUsage } from "../client/sysInfo";

export default defineComponent({

    methods: {
        check(name: string) {
            this.radio1 = name
            console.log(this.radio1)
        }
    },

    setup() {

        let cpuSocket: WebSocket | null = null;
        let memorySocket: WebSocket | null = null;
        let networkSocket: WebSocket | null = null;
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
                                    <div class="left-text">${item.marker}CPU</div>
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
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: Array.from({ length: 60 }, (_, index) => index),
                    name: '/s',
                    axisLabel: {
                        interval: 4
                    }
                },
                yAxis: {
                    max: 100,
                    min: 0,
                    interval: 20,
                    type: "value",
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: {
                    name: "CPU",
                    type: "line",
                    stack: "Total",
                    areaStyle: {},
                    emphasis: {
                        focus: "series",
                    },
                    symbol: 'none',
                    data: [] as {
                        value: number;
                    }[],
                },

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
                                    <div class="left-text">${item.marker}内存</div>
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
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: Array.from({ length: 60 }, (_, index) => index),
                    name: '/s',
                    axisLabel: {
                        interval: 4
                    }
                },
                yAxis: {
                    max: 100,
                    min: 0,
                    interval: 20,
                    type: "value",
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: {
                    name: "内存",
                    type: "line",
                    stack: "Total",
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
                },

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
                        console.log("???")
                        let result = '';
                        data.map((item, index) => {
                            if (item.data.empty) {
                                result = ''
                            } else {
                                console.log(item.data)
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
                                    <div class="left-text">${item.marker}网络</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data.value}%</div>
                                </div>
                                <div class="container">
                                    <div class="left-text">已使用</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data[0].value.toFixed(2)}G</div>
                                </div>
                                <div class="container">
                                    <div class="left-text">空闲</div>
                                        &emsp; &emsp;
                                    <div class="right-text">${item.data[1].value.toFixed(2)}G</div>
                                </div>`
                            }
                        })
                        return result;
                    }
                },
                legend: {
                    data: ["网络"],
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: Array.from({ length: 60 }, (_, index) => index),
                    name: '/s',
                    axisLabel: {
                        interval: 4
                    }
                },
                yAxis: {
                    max: 100,
                    min: 0,
                    interval: 20,
                    type: "value",
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: {
                    name: "网络",
                    type: "line",
                    stack: "Total",
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
                },

            };

            try {

                class SysInfoOnMessage {
                    private i = 0;
                    onMessage(option: any, data: any, chart: any) {
                        option.series.data.push(data)
                        if (this.i == 60) {
                            option.series.data.splice(0, 1)
                        } else this.i = this.i + 1;
                        chart.setOption(option);
                    }
                }

                let cpuOnMessage = new SysInfoOnMessage();
                let memoryOnMessage = new SysInfoOnMessage();
                let networkOnMessage = new SysInfoOnMessage();

                cpuSocket = getCpuUsage((data) => {
                    let inputData = {
                        value: parseFloat(data)
                    }
                    cpuOnMessage.onMessage(cpuOption, inputData, cpuInfoChart)
                })

                memorySocket = getMemoryUsage((data) => {
                    let dataP = JSON.parse(data)
                    let inputData = {
                        value: parseFloat(dataP.value),
                        used: parseFloat(dataP.used),
                        free: parseFloat(dataP.free)
                    }
                    memoryOnMessage.onMessage(memoryOption, inputData, memoryInfoChart)
                })

                networkSocket = getNetworkUsage((data) => {
                    let dataP = JSON.parse(data)
                    let inputData = 
                        {
                            value: parseFloat(dataP.send)
                        }
                        // {
                        //     value: parseFloat(dataP.recv)
                        // }
                    
                    networkOnMessage.onMessage(networkOption, inputData, networkInfoChart)
                })

            } catch (error) {
                console.log(error)
            }

            // 使用刚指定的配置项option和数据显示图表cpuInfoChart。
            cpuInfoChart.setOption(cpuOption);
            memoryInfoChart.setOption(memoryOption);
            networkInfoChart.setOption(networkOption);

            const viewElem = document.body;
            const resizeObserver = new ResizeObserver(() => {

                // 此处放 当窗口大小发生变化时，想要让宽高自适应的图表的.resize()，除此处外其余都是固定写法，举例如下
                cpuInfoChart.resize();
                memoryInfoChart.resize();
                networkInfoChart.resize();

                setTimeout(() => {
                    cpuInfoChart.resize();
                    memoryInfoChart.resize();
                    networkInfoChart.resize();
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
            radio1: ref("流量"),
            buttonGroups: [
                {
                    buttons: [
                        {
                            id: 1,
                            name: '1'
                        },
                        {
                            id: 1,
                            name: '1'
                        }
                    ],
                    chart: 'cpuChart'
                },
                {
                    buttons: [
                        {
                            id: 1,
                            name: '1'
                        },
                        {
                            id: 1,
                            name: '1'
                        }
                    ],
                    chart: 'memoryChart'
                },
                {
                    buttons: [
                        {
                            id: 1,
                            name: '1'
                        },
                        {
                            id: 1,
                            name: '1'
                        }
                    ],
                    chart: 'networkChart'
                },
                {
                    buttons: [
                        {
                            id: 1,
                            name: '1'
                        },
                        {
                            id: 1,
                            name: '1'
                        }
                    ],
                    chart: 'cpuChart4'
                },
            ]
        };
    },
});
</script>

<style scoped>
.tot {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* 两列布局，每列占屏幕宽度的50% */
    gap: 20px;
    /* 组件之间的间隙 */
    width: 100%;
    /* 容器宽度占满整个视口宽度 */
    height: 100%;
    /* 容器高度占满整个视口高度 */
    place-items: center;
    /* 使内容在容器中居中 */
}

.chart-with-button {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 轻微的阴影效果 */
    gap: 1px;
    /* 按钮之间的间隙 */
    width: 90%;
    /* 按钮组宽度占满容器宽度 */
    height: 90%;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
}

/* 图表容器样式 */
.chart-container {
    width: 100%;
    /* 图表宽度 */
    height: 400px;
    /* 图表高度 */
    margin: 20px auto;
    /* 外边距，居中显示 */
    /* position: relative; */
    /* 设置相对定位，以便按钮组可以绝对定位 */
}

/* 为radio组容器设置绝对定位 */
.cpu {
    position: absolute;
    top: 10px;
    /* 距离顶部10px */
    right: 20px;
    /* 距离右侧10px */
}

/* 按钮样式 */
.toggle-button {
    padding: 5px 10px;
    /* 内边距 */
    width: 100px;
    height: 50px;
    font-size: 14px;
    /* 字体大小 */
    cursor: pointer;
    /* 鼠标悬停时显示指针 */
    background: none;
    /* 背景颜色 */
    color: rgb(0, 0, 0);
    /* 文字颜色 */
    border: none;
    /* 无边框 */
    outline: none;
    /* 点击时无轮廓 */
    margin-right: 0;
    transition: background-color 0.3s;
    /* 背景颜色变化的过渡效果 */
}

/* 按钮悬停时的样式 */
.toggle-button:hover {
    background-color: #d3d8f6;
    /* 悬停时的背景颜色 */
    border-bottom: 2px solid #4e77ea;
    /* 添加底部边框 */
}

.toggle-button.active {
    background-color: #b3bdf2;
    /* 悬停时的背景颜色 */
    border-bottom: 2px solid #4e77ea;
    /* 添加底部边框 */
}
</style>

<style scoped></style>