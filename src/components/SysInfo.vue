<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 600px; height: 400px"></div>
    <div id="main1" style="width: 600px; height: 400px"></div>
</template>

<script lang="ts">

//按需引入
import { defineComponent, onMounted, onUnmounted } from "vue";

//引入创建的echarts.ts文件
import echarts from "../utils/echarts";
import { getCpuUsage } from "../client/sysInfo";

export default defineComponent({
    setup() {

        let socket: WebSocket | null = null;
        const cpuinfo: number[] = [];
        const cputime: number[] = [];
        /**
         * 在使用init方法初始化图表之前，确保DOM元素已经被正确加载。在Vue组件中，
         * 可以使用onMounted钩子函数来确保在DOM准备就绪后再执行初始化操作。
         */
        //如果不使用这个钩子可能会报错
        onMounted(() => {
            /**
              !是非空断言运算符，表示确保找到了匹配的元素，如果找不到元素或其值为
          null 或 undefined，会引发错误。
              document.getElementById("main") 是调用 getElementById 方法，
          传入参数 “main”，用于获取具有 id 为 “main” 的元素。
              echarts.init() 方法用于初始化一个 echarts 图表实例。
          */

            // 基于准备好的dom，初始化echarts实例
            var chartDom = document.getElementById("main")!;
            var myChart = echarts.init(chartDom);

            var chartDom1 = document.getElementById("main1")!;
            var myChart1 = echarts.init(chartDom1);

            //还可以这样一起写
            // var myChart = echarts.init(document.getElementById("main")!);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: "第一个 ECharts 实例",
                },
                tooltip: {},
                legend: {
                    data: ["销量"],
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
                },
                yAxis: {},
                series: [
                    {
                        name: "销量",
                        type: "bar",
                        data: [5, 20, 36, 10, 10, 20],
                    },
                ],
            };

            var option1 = {
                title: {
                    text: "第二个 ECharts 实例",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#6a7985",
                        },
                    },
                },
                legend: {
                    data: ["CPU"],
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                    },
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
                    data: cputime
                },
                yAxis: {
                    max: 100,
                    min: 0,
                    interval: 20,
                    type: "value",
                },
                series: [
                    {
                        name: "Email",
                        type: "line",
                        stack: "Total",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                        data: cpuinfo
                    }
                ],
            };

            try {

                let i = 0

                socket = getCpuUsage((data) => {
                    cpuinfo.push(parseFloat(data))
                    if (i != 10) {
                        i = i + 1
                        cputime.push(i)
                    } else {
                        cpuinfo.splice(0, 1)
                    }
                    option1.xAxis.data = cputime
                    option1.series[0].data = cpuinfo
                    myChart1.setOption(option1);
                })
            } catch (error) {
                console.log(error)
            }

            // 使用刚指定的配置项option和数据显示图表myChart。
            myChart.setOption(option);
            // 使用刚指定的配置项option和数据显示图表myChart。
            myChart1.setOption(option1);
        });

        onUnmounted(() => {
            if (socket) {
                socket.close();
            }
        })

        return {};
    },
});
</script>

<style scoped></style>