<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div class="chart-with-button">
        <div id="cpuChart" class="chart-container">
    </div>
    </div>
        <!-- 切换图表的按钮组 -->
        <el-radio-group v-model="radio1" size="large">
            <el-radio-button label="New York" value="New York" />
            <el-radio-button label="Washington" value="Washington" />
            <el-radio-button label="Los Angeles" value="Los Angeles" />
            <el-radio-button label="Chicago" value="Chicago" />
        </el-radio-group>
</template>

<script lang="ts">

//按需引入
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

//引入创建的echarts.ts文件
import echarts from "../utils/echarts";
import { getCpuUsage } from "../client/sysInfo";

export default defineComponent({
    
    methods: {
    },

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
              document.getElementById("cpuChart") 是调用 getElementById 方法，
          传入参数 “cpuChart”，用于获取具有 id 为 “cpuChart” 的元素。
              echarts.init() 方法用于初始化一个 echarts 图表实例。
          */

            // 基于准备好的dom，初始化echarts实例
            var chartDom = document.getElementById("cpuChart")!;
            var myChart = echarts.init(chartDom);
            myChart.clear()

            //还可以这样一起写
            // var myChart = echarts.init(document.getElementById("cpuChart")!);

            // 指定图表的配置项和数据

            var option = {
                title: {
                    text: "CPU使用率",
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
                    data: cputime,
                    name: '/s',
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
                    data: cpuinfo
                },

            };

            try {

                let i = 0

                socket = getCpuUsage((data) => {
                    cpuinfo.push(parseFloat(data))
                    if (i != 60) {
                        i = i + 1
                        cputime.push(i)
                    } else {
                        cpuinfo.splice(0, 1)
                    }
                    option.xAxis.data = cputime
                    option.series.data = cpuinfo
                    myChart.setOption(option, true);
                })
            } catch (error) {
                console.log(error)
            }

            // 使用刚指定的配置项option和数据显示图表myChart。
            myChart.setOption(option);
            // 使用刚指定的配置项option和数据显示图表myChart。
            myChart.setOption(option);
        });

        onUnmounted(() => {
            if (socket) {
                socket.close();
            }
        })

        return {
            cputime: '',
            radio1: ref("New York"),
        };
    },
});
</script>

<style>

.chart-with-button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 轻微的阴影效果 */
}

/* 图表容器样式 */
.chart-container {
    width: 800px;
    /* 图表宽度 */
    height: 400px;
    /* 图表高度 */
    margin: 20px auto;
    /* 外边距，居中显示 */
    position: relative;
    /* 设置相对定位，以便按钮组可以绝对定位 */
}
</style>

<style scoped></style>