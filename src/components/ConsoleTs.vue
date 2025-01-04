<template>
  <el-tabs v-model="activeTab" type="card" tab-position="top" style="width: 100%; height: 100%;">
    <!-- 默认有一个 Terminal，后续可以动态增加 -->
    <el-tab-pane
      v-for="(term, label) in terminals"
      :key="label"
      :label="label"
      :name="label"
      class="console"
      style="height: 100%; width: 100%;"
    >
      <!-- 动态绑定 ref 到每个终端容器 -->
      <div class="console" :ref="(el) => consoleContainers[label] = el" style="height: 100%; width: 100%;"></div>
    </el-tab-pane>
  </el-tabs>
  <!-- 删除按钮 -->
  <el-button
        type="danger"
        @click="removeTerminal(activeTab)"
        class="delete-btn"
      >
        删除
      </el-button>
  <el-button type="primary" @click="addTerminal">添加终端</el-button>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, toRaw, watch } from 'vue';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ElTabs, ElTabPane, ElButton } from 'element-plus';
import 'xterm/css/xterm.css';
import 'element-plus/dist/index.css';

export default {
  name: 'ConsoleT',
  components: {
    ElTabs,
    ElTabPane,
    ElButton
  },
  setup() {
    const activeTab = ref<string>('');  // 当前选中的标签
    const terminals = ref<Record<string, Terminal>>({});  // 存储 terminal 对象和标签名
    const terminalSockets = ref<Record<string, any>>({});  // 存储 WebSocket 实例
    const fitAddons = ref<Record<string, any>>({});  // 存储 FitAddon 实例

    // 存储每个终端的容器 DOM
    const consoleContainers = ref<Record<string, HTMLElement | null>>({});

    // 生成随机字符串的函数
    const generateRandomString = (length: number) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // 初始化一个 Terminal 实例
    const initTerm = (label: string) => {
      terminals.value[label] = null
      nextTick(() => {
        // 确保 DOM 渲染完成后再创建 terminal
        const term = new Terminal({
          fontSize: 20,
          cursorBlink: true,
          scrollback: 5000,
          allowProposedApi: true,
          disableStdin: false,
          convertEol: true,
          fontFamily: 'my-font-family',
          theme: {
            foreground: '#58a6ff',
            background: '#2B2B2B',
            cursor: 'Orange'
          },
          cols: 80,  // 给定合适的列数
          rows: 24,  // 给定合适的行数
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddons.value[label] = fitAddon;
        terminals.value[label] = term;

        // 获取通过 ref 动态存储的终端容器并打开终端
        const terminalContainer = toRaw(consoleContainers.value)[label];
        console.log(label)
        console.log(consoleContainers.value[label])
        console.log(toRaw(consoleContainers.value))
        if (terminalContainer) {
          term.open(terminalContainer);
          fitAddon.fit(); // 调整终端适配
        }

        // 监听终端输入并通过 WebSocket 发送数据
        term.onData((data) => {
          terminalSockets.value[label].send(
            JSON.stringify({
              type: 'cmd',
              msg: data
            })
          );
        });

        // 调整终端大小时重新适配
        window.addEventListener('resize', () => {
          fitAddon.fit();
          terminalSockets.value[label].send(
            JSON.stringify({
              type: 'resize',
              cols: term.cols,
              rows: term.rows
            })
          );
        });
      });
    };

    // WebSocket 和终端连接
    const setupTerminalSocket = (label: string) => {
      const socket = new WebSocket('ws://127.0.0.1:8000');
      terminalSockets.value[label] = socket;

      socket.onopen = () => {
        console.log('WebSocket is open!');
        terminalSockets.value[label].send(
          JSON.stringify({
            type: 'run',
            dir: 'core.message.action',
            module: 'run',
            component: 'terminal'
          })
        );
        fitAddons.value[label].fit();  // 确保 fitAddon 被初始化并正确调用
        socket.send(
          JSON.stringify({
            type: 'resize',
            cols: terminals.value[label].cols,
            rows: terminals.value[label].rows
          })
        );
      };

      socket.onerror = (error: any) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('WebSocket closed for terminal-' + label);
      };

      socket.onmessage = (event: any) => {
        console.log('Received data from server:', event.data);
        if (event.data) {
          terminals.value[label].write(event.data);  // 将数据写入终端
        }
      };
    };

    // 默认初始化一个终端
    onMounted(() => {
      const label = `terminal-${generateRandomString(6)}`;
      initTerm(label);
      setupTerminalSocket(label);
      activeTab.value = label;  // 激活默认的 terminal
    });

    // 动态添加终端
    const addTerminal = () => {
      const label = `terminal-${generateRandomString(6)}`;
      initTerm(label);
      setupTerminalSocket(label);
      activeTab.value = label; // 激活新创建的 terminal 标签
    };

    // 删除指定的终端
    const removeTerminal = (label: string) => {
      terminals.value[label].dispose()  // 销毁终端实例
      terminalSockets.value[label].close();  // 关闭 WebSocket 连接
      delete terminals.value[label];  // 移除终端
      delete terminalSockets.value[label];  // 移除 WebSocket
      delete fitAddons.value[label];  // 移除 FitAddon

      // 如果删除的是当前选中的终端，需要激活其他终端
      if (activeTab.value === label) {
        if (Object.keys(terminals.value).length > 0) {
          activeTab.value = Object.keys(terminals.value)[0];  // 激活第一个 terminal
        } else {
          activeTab.value = '';  // 如果没有终端，清空选中的 tab
        }
      }
    };

    onBeforeUnmount(() => {
      // 清理 WebSocket 和终端实例
      Object.keys(terminalSockets.value).forEach((label) => terminalSockets.value[label].close());
      Object.keys(terminals.value).forEach((label) => terminals.value[label].destroy());
    });

    return {
      activeTab,
      terminals,
      addTerminal,
      removeTerminal,
      consoleContainers  // 不再需要直接返回，$refs 存储的动态 ref 会管理容器
    };
  }
};
</script>
