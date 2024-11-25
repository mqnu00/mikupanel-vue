<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div class="chart-with-button">
        <div>
            <div id="cpuChart" class="chart-container">
            </div>

            <!-- 切换图表的按钮组 -->
            <div class="cpu">
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
            </div>
        </div>
    </div>
</template>

<script lang="ts">

//按需引入
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

//引入创建的echarts.ts文件
import echarts from "../utils/echarts";
import { getCpuUsage } from "../client/sysInfo";
import { number } from "echarts";

export default defineComponent({

    methods: {
        check(name: string){
            this.radio1=name
            console.log(this.radio1)
        }
    },

    setup() {

        let socket: WebSocket | null = null;
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
                    data: [] as number[],
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
                    symbol: 'none',
                    data: [] as number[]
                },

            };

            try {

                let i = 0

                socket = getCpuUsage((data) => {
                    option.series.data.push(parseFloat(data))
                    if (i != 60) {
                        i = i + 1
                        option.xAxis.data.push(i)
                    } else {
                        option.series.data.splice(0, 1)
                    }
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
            radio1: ref("流量"),
        };
    },
});
</script>

<style>
.chart-with-button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 轻微的阴影效果 */
    padding: 20px;
    /* 为按钮组留出空间 */
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
  padding: 5px 10px; /* 内边距 */
  width: 100px;
  height: 50px;
  font-size: 14px; /* 字体大小 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  background: none; /* 背景颜色 */
  color: rgb(0, 0, 0); /* 文字颜色 */
  border: none; /* 无边框 */
  outline: none; /* 点击时无轮廓 */
  margin-right: 0;
  transition: background-color 0.3s; /* 背景颜色变化的过渡效果 */
}

/* 按钮悬停时的样式 */
.toggle-button:hover {
  background-color: #d3d8f6; /* 悬停时的背景颜色 */
  border-bottom: 2px solid #4e77ea; /* 添加底部边框 */
}

.toggle-button.active {
    background-color: #b3bdf2; /* 悬停时的背景颜色 */
    border-bottom: 2px solid #4e77ea; /* 添加底部边框 */
}
</style>

<style lang="less" scoped></style>

<style scoped></style>