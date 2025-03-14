<template>
  <!-- <p>{{ name }}</p> -->
      <div ref="terminalContainer" class="xterm" style="height: calc(100vh - 80px - 30px - 50px); width: 100%;"></div>
    <!-- <textarea></textarea> -->
  </template>
  
  <script lang="ts">
  import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
  import { TerminalClient } from './TerminalClient';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';
  
  export default defineComponent({
    props : {
        name: {
            type: String,
            required: true
        }
    },
    setup(props) {
      const terminalContainer = ref<any>(null);
      const terminal = ref<Terminal | null>(null);
      const terminalClient = ref<TerminalClient | null>(null);
      const fitAddon = ref<FitAddon | null>(null);
      console.log(props.name)
  
      onMounted(() => {
        console.log("???")
        if (terminalContainer.value) {
          const term = new Terminal({
            fontSize: 14,
            fontFamily: "FiraCode",
            theme: {
              background: '#181d28',
              foreground: '#ffffff',
            },
          });

          const fitA = new FitAddon();
  
          fitAddon.value = fitA;
          term.loadAddon(fitAddon.value);
          term.open(terminalContainer.value);
          
          terminal.value = term
  
          // 示例：通过 WebSocket 连接到服务器
          terminalClient.value = new TerminalClient()
          terminalClient.value.init(term, fitA)
  
          term.onData((data) => {
            terminalClient.value?.sendToTerminal(data);
          });

          term.onResize(() => {
            console.log(term.rows, term.cols)
            terminalClient.value?.resizeTerminal()
          })
        }


        let timeoutId: number | null = null;
    

        window.addEventListener('resize', () => {
          
          // fitAddon.value?.fit()
          fitAddon.value?.fit()
        })

        const resizeObserver = new ResizeObserver(() => {
        try {
          console.log('resize obs')
          console.log(timeoutId)
          if (timeoutId !== null) {
            
            clearTimeout(timeoutId)
          } 
          
            timeoutId = window.setTimeout(() => {
              fitAddon.value?.fit()
            }, 100);
          // fitAddon.value?.fit()
        } catch (e) {
          console.error('调整终端大小失败:', e);
        }
      });

      // 开始监听容器
      resizeObserver.observe(terminalContainer.value);



      });
  
      onBeforeUnmount(() => {
        if (terminalContainer.value) {
          const term = terminal.value as Terminal;
          term.dispose();
        }
        // 清理 WebSocket（如果有的话）
        terminalClient.value?.removeTerminal()
      });
  
      // 如果需要在模板中使用 `terminal`，则返回它
      return {
        terminalContainer,
        terminal
      };
    },
  });
  </script>