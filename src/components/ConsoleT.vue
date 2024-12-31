<template>
    <div class="console" id="terminal"></div>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    name: 'ConsoleT',
    setup() {
        const term = ref(null);  // 使用 ref 管理 term
        const terminalSocket = ref(null);  // 使用 ref 管理 terminalSocket
        const fitAddon = ref(null);  // 管理 fitAddon

        const runRealTerminal = () => {
            console.log('WebSocket is finished');
            terminalSocket.value.send(JSON.stringify(
                {
                    type: "run",
                    dir: "core.message.action",
                    module: "run",
                    component: "terminal"
                }
            ));

            // 使用 setTimeout 延迟确保 fitAddon 在 WebSocket 完全打开后执行
            setTimeout(() => {
                if (fitAddon.value) {
                    fitAddon.value.fit();  // 确保 fitAddon 被初始化并正确调用
                    terminalSocket.value.send(JSON.stringify({
                        type: 'resize',
                        cols: term.value.cols,
                        rows: term.value.rows
                    }));
                }
            }, 0);  // 使用 setTimeout 来延迟执行，确保 fitAddon 先初始化
        };

        const errorRealTerminal = () => {
            console.log('Error');
        };

        const closeRealTerminal = () => {
            console.log('Close');
        };

        onMounted(() => {
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
                cols: 1,
                rows: 1
            });

            // 创建 FitAddon 并加载到终端中
            fitAddon.value = new FitAddon();
            term.value.loadAddon(fitAddon.value);

            // 获取终端容器并打开终端
            const terminalContainer = document.getElementById('terminal');
            term.value.open(terminalContainer);

            // 打开 WebSocket 连接
            terminalSocket.value = new WebSocket('ws://127.0.0.1:8000');
            terminalSocket.value.onopen = runRealTerminal;  // 连接建立时调用 runRealTerminal
            terminalSocket.value.onclose = closeRealTerminal;
            terminalSocket.value.onerror = errorRealTerminal;
            terminalSocket.value.onmessage = ((event) => {
                console.log(event.data);
                term.value.element && term.value.focus();
                term.value.write(event.data);
            });

            // 监听终端输入并通过 WebSocket 发送数据
            term.value.onData((data) => {
                terminalSocket.value.send(JSON.stringify({
                    "type": 'cmd',
                    "msg": data
                }));
            });

            // 调整终端大小时重新适配
            window.addEventListener('resize', () => {
                if (fitAddon.value) {
                    fitAddon.value.fit();
                }
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
            fitAddon
        };
    }
};
</script>

<style lang="scss">
@import "../assets/font.scss";
/* 确保字体被加载 */

.console {
    height: 100%;
    width: 100%;
    display: flex;
}

:deep(.xterm) {
    padding: 5px !important;
}
</style>
