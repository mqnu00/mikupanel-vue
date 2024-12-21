<template>
  <div class="console" id="terminal"></div>
</template>

<script>
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'ConsoleT',
  props: {
    terminal: {
      type: Object,
      required: true
    }
  },
  setup() {
    const term = ref(null);  // 使用 ref 管理 term
    const terminalSocket = ref(null);  // 使用 ref 管理 terminalSocket

    const runRealTerminal = () => {
      console.log('WebSocket is finished');
    };

    const errorRealTerminal = () => {
      console.log('Error');
    };

    const closeRealTerminal = () => {
      console.log('Close');
    };

    const calculateColsRows = () => {
      const width = window.innerWidth - 230;
      const height = window.innerHeight - 140;
      const cols = 170;
      const rows = 35;
      return { cols, rows };
    };

    const updateTerminalSize = () => {
      const { cols, rows } = calculateColsRows();
      if (term.value) {
        term.value.resize(cols, rows);
        console.log(`Resized terminal to ${cols} cols and ${rows} rows.`);
      }
    };

    onMounted(() => {
      const { cols, rows } = calculateColsRows();

      // 初始化终端并赋值给 term.value
      term.value = new Terminal({
        rendererType: "canvas",
        fontSize: 20,
        cursorBlink: true,
        scrollback: 5000,
        allowProposedApi: true,
        disableStdin: false,
        convertEol: true,
        fontFamily: 'my-font-family',
        theme: {
          foreground: "#58a6ff",
          background: "#2B2B2B",
          cursor: "Orange"
        },
        cols: cols,
        rows: rows
      });

      // 获取终端容器
      const terminalContainer = document.getElementById('terminal');
      term.value.open(terminalContainer);

      // 打开 WebSocket
      terminalSocket.value = new WebSocket('ws://127.0.0.1:8000/terminals/');
      terminalSocket.value.onopen = runRealTerminal;
      terminalSocket.value.onclose = closeRealTerminal;
      terminalSocket.value.onerror = errorRealTerminal;
      terminalSocket.value.onmessage = ((event) => {
        console.log(event.data)
        term.value.element && term.value.focus();
        term.value.write(event.data)
      })
 
      term.value.onData((data) => {
        terminalSocket.value.send(JSON.stringify({
          "type": 'cmd',
          "msg": data
        }))
      })

      // const attachAddon = new AttachAddon(terminalSocket.value);
      // term.value.loadAddon(attachAddon);

      const fitAddon = new FitAddon();
      term.value.loadAddon(fitAddon);

      // 初始适配终端
      fitAddon.fit();

      // 调整终端大小
      window.addEventListener('resize', () => {
        fitAddon.fit();
        console.log(term.value.cols);
        console.log(term.value.rows);
        terminalSocket.value.send(JSON.stringify({
          type: 'resize',
          cols: term.value.cols,
          rows: term.value.rows
        }));
      });
    });

    onBeforeUnmount(() => {
      if (terminalSocket.value) {
        terminalSocket.value.close();
      }
      if (term.value) {
        term.value.destroy();
      }
    });

    return {
      term,
      terminalSocket,
      updateTerminalSize
    };
  }
};
</script>

<style lang="scss">
@import "../assets/font.scss";  /* 确保字体被加载 */

.console {
  height: 100%;
  width: 100%;
  display: flex;
}

:deep(.xterm) {
  padding: 5px !important;
}
</style>
