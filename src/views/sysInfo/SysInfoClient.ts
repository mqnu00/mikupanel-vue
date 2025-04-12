import { BaseWebsocket } from "@/utils/BackendConnect";
import { AnyNaptrRecord } from "node:dns";
import { run } from "node:test";

export class SysInfoClient extends BaseWebsocket{

    public init = (cpuInfoChart: any, memoryInfoChart: any, diskInfoChart: any, networkInfoChart: any) => {
        let uploadTotal = 0; // 网络上传总量
        let downloadTotal = 0; // 网络下载总量
        let lastUploadTotal = 0; // 上一秒的网络上传总量
        let lastDownloadTotal = 0; // 上一秒的网络下载总量

        let uploadSpeeds: number[] = Array(0).fill(0); // 网络上传速率
        let downloadSpeeds: number[] = Array(0).fill(0); // 网络下载速率
        function formatSize(value: number): string {
            if (value < 1024) {
              return `${value.toFixed(2)} B/s`;
            } else if (value < 1024 * 1024) {
              return `${(value / 1024).toFixed(2)} KB/s`;
            } else {
              return `${(value / (1024 * 1024)).toFixed(2)} MB/s`;
            }
          }
          function updateNetworkData(upload: number, download: number) {
            // 更新总量
            lastUploadTotal = uploadTotal;
            lastDownloadTotal = downloadTotal;
            uploadTotal = upload;
            downloadTotal = download;
          
            // 计算当前速率
            const currentUploadSpeed = lastUploadTotal == 0 ? 0 : uploadTotal - lastUploadTotal;
            const currentDownloadSpeed = lastDownloadTotal == 0 ? 0 : downloadTotal - lastDownloadTotal;
          
            // 更新速率数组
            if (uploadSpeeds.length >= 60) {
                uploadSpeeds.shift();
                downloadSpeeds.shift();
            }
            uploadSpeeds.push(currentUploadSpeed);
            downloadSpeeds.push(currentDownloadSpeed);
          
            // 更新 ECharts 数据
            networkOption.series[0].data = uploadSpeeds.map(speed => ({ value: speed }));
            networkOption.series[1].data = downloadSpeeds.map(speed => ({ value: speed }));
          
            // 更新 ECharts 配置
            networkInfoChart.value.setOption(networkOption);
          }
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
                            console.log(item)
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
                          `;
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
                              <div class="right-text">${formatSize(item.data.value)}</div>
                          </div>`;
                  }
                });
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
              type: "value",
              axisLabel: {
                formatter: formatSize
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
                data: Array(0).fill({ value: 0 }),
                itemStyle: {
                  borderColor: "#E9CD4B",
                  borderWidth: 3.5
                },
                lineStyle: {
                  color: "rgba(100,100,170,1)"
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: 'rgba(100,100,170,1)' },
                      { offset: 1, color: 'rgba(255,240,170,1)' }
                    ],
                    globalCoord: false
                  }
                },
              },
              {
                name: "磁盘写入",
                type: "line",
                emphasis: {
                  focus: "series",
                },
                symbol: 'none',
                data: Array(0).fill({ value: 0 }),
                itemStyle: {
                  borderColor: "#E9CD4B",
                  borderWidth: 3.5
                },
                lineStyle: {
                  color: "rgba(10,240,10,0)"
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: 'rgba(10,240,10,0)' },
                      { offset: 1, color: 'rgba(255,240,170,1)' }
                    ],
                    globalCoord: false
                  }
                },
              }
            ],
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
                          `;
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
                              <div class="right-text">${formatSize(item.data.value)}</div>
                          </div>`;
                  }
                });
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
              type: "value",
              axisLabel: {
                formatter: function (value: number) {
                  return formatSize(value);
                }
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
                data: uploadSpeeds.map(speed => ({ value: speed })),
                itemStyle: {
                  borderColor: "#E9CD4B",
                  borderWidth: 3.5
                },
                lineStyle: {
                  color: "rgba(100,100,170,1)"
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: 'rgba(100,100,170,1)' },
                      { offset: 1, color: 'rgba(255,240,170,1)' }
                    ],
                    globalCoord: false
                  }
                },
              },
              {
                name: "网络下行",
                type: "line",
                emphasis: {
                  focus: "series",
                },
                symbol: 'none',
                data: downloadSpeeds.map(speed => ({ value: speed })),
                itemStyle: {
                  borderColor: "#E9CD4B",
                  borderWidth: 3.5
                },
                lineStyle: {
                  color: "rgba(10,240,10,0)"
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: 'rgba(10,240,10,0)' },
                      { offset: 1, color: 'rgba(255,240,170,1)' }
                    ],
                    globalCoord: false
                  }
                },
              }
            ],
          };
        this.socket.onopen = () => {
            this.wsSend({
                type: 'run',
                component: "sysInfo"
            })
        }
        this.socket.onmessage = (ev: any) => {
            const refreshOption = (option: any, newValue: any) => {
                for (let i = 0; i < option.series.length; i++) {
                    if (option.series[i].data.length >= 60) {
                        option.series[i].data.splice(0, 1)
                    }
                    option.series[i].data.push(newValue[i])
                }
            }
            if (ev.data) {
                let info = JSON.parse(ev.data)
                if (info["do_return"] === 'get_cpu_per') {
                    info["data"].value = info["data"].percent
                    refreshOption(cpuOption, [info["data"]])
                    cpuInfoChart.value.setOption(cpuOption)
                } else if (info["do_return"] === 'get_memory_per') {
                    info["data"].value = info["data"].percent
                    refreshOption(memoryOption, [info["data"]])
                    memoryInfoChart.value.setOption(memoryOption)
                } else if (info["do_return"] === 'get_disk_per') {
                    console.log(info)
                    const newValue = [
                        {value: info.data.read},
                        {value: info.data.write}
                    ]
                    info["data"].value = info["data"].percent
                    refreshOption(diskOption, newValue)
                    diskInfoChart.value.setOption(diskOption)
                } else if (info["do_return"] === 'network_info') {
                    console.log(info)
                    updateNetworkData(info.data.send, info.data.recv)
                }
            }
        }
    }

    public getCpuPer = () => {
        this.wsSend({
            do: "get_cpu_per",
        })
    }

    public getMemPer = () => {
        this.wsSend({
            do: "get_memory_per"
        })
    }

    public getDiskPer = () => {
        this.wsSend({
            do: "get_disk_per"
        })
    }

    public getNetworkPer = () => {
        this.wsSend({
            do: "network_info"
        })
    }

    public close = () => {
        this.wsSend({
            do: "close"
        })
    }
} 