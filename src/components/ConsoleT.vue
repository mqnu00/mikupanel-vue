<template>
    <div class="console" id="terminal"></div>
  </template>
  
  <script>
  import { Terminal } from 'xterm';
  import { AttachAddon } from 'xterm-addon-attach';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';
  
  export default {
    name: 'ConsoleT',
    props: {
      terminal: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        term: null,
        terminalSocket: null
      };
    },
    methods: {
      runRealTerminal() {
        console.log('WebSocket is finished');
      },
      errorRealTerminal() {
        console.log('Error');
      },
      closeRealTerminal() {
        console.log('Close');
      },
      // 根据窗口大小动态计算终端的 cols 和 rows
      calculateColsRows() {
        let font = this._configHelper.getFont();
        console.log(font.charWidth)
        const width = window.innerWidth - 230; // 减去左侧边栏的宽度
        const height = window.innerHeight - 140; // 减去顶部的高度
        console.log(width, height)
        // const cols = Math.floor(width / 10);  // 每个字符宽度大约为 9px
        // const rows = Math.floor(height / 24); // 每行高度大约为 20px
        // font-size: 20
        // width-px: 2300 ->170 - 180
        // height-px: 580 -> 35 - 40
        const cols = 170;
        const rows = 35;
        return { cols, rows };
      },
      updateTerminalSize() {
        // 动态调整列数和行数
        const { cols, rows } = this.calculateColsRows();
        this.term.resize(cols, rows);
        console.log(`Resized terminal to ${cols} cols and ${rows} rows.`);
      }
    },
    mounted() {
      // 初始化终端
      const { cols, rows } = this.calculateColsRows();
  
      this.term = new Terminal({
        rendererType: "canvas", // 渲染类型
        fontSize: 20,
        cursorBlink: true,
        allowProposedApi: true,
        disableStdin: false,
        convertEol: true,
        scrollback: 5000,
        fontFamily: 'my-font-family', // 使用自定义字体
        theme: {
          foreground: "#58a6ff", // 字体颜色
          background: "#2B2B2B", // 背景色
          cursor: "Orange"       // 设置光标
        },
        cols: cols,  // 通过计算设置列数
        rows: rows  // 通过计算设置行数
      });
  
      // 获取终端容器
      const terminalContainer = document.getElementById('terminal');
      this.term.open(terminalContainer);
  
      // 打开 WebSocket
      this.terminalSocket = new WebSocket('ws://127.0.0.1:8000/terminals/');
      this.terminalSocket.onopen = this.runRealTerminal;
      this.terminalSocket.onclose = this.closeRealTerminal;
      this.terminalSocket.onerror = this.errorRealTerminal;
  
      const attachAddon = new AttachAddon(this.terminalSocket);
      this.term.loadAddon(attachAddon);
  
      const fitAddon = new FitAddon();
      this.term.loadAddon(fitAddon);
  
      // 初始适配终端
      fitAddon.fit();
  
      // 调整终端大小
      window.addEventListener('resize', () => {
        fitAddon.fit(); // 使用 FitAddon 来自动适配终端尺寸
        this.updateTerminalSize(); // 根据页面大小更新 cols 和 rows
      });
    },
    beforeUnmount() {
      // 清理 WebSocket 和终端实例
      this.terminalSocket.close();
      this.term.destroy();
    }
  };
  </script>
  
  <style lang="scss">
  @import "../assets/font.scss";  /* 确保字体被加载 */
  </style>
  