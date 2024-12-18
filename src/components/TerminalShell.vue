<template>
    <div class="bg-main">
        <div ref="terminal" v-loading="loading" class="terminal" element-loading-text="拼命连接中"></div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

const terminal = ref(null)
const fitAddon = new FitAddon()
let first = ref(true)
let loading = ref(true)
let terminalSocket = ref(null)
let term = ref(null)

let commandBuffer = "";  // 用于存储用户输入的命令

// 初始化WebSocket连接
const initWS = () => {
    if (!terminalSocket.value) {
        createWS()
    }
    if (terminalSocket.value && terminalSocket.value.readyState > 1) {
        terminalSocket.value.close()
        createWS()
    }
}

// 创建WebSocket连接
const createWS = () => {
    terminalSocket.value = new WebSocket(`ws://localhost:8000/ws`)
    terminalSocket.value.onopen = runRealTerminal
    terminalSocket.value.onmessage = onWSReceive
    terminalSocket.value.onclose = closeRealTerminal
    terminalSocket.value.onerror = errorRealTerminal
}

// WebSocket连接已建立
const runRealTerminal = () => {
    loading.value = false
}

// WebSocket收到服务器消息
const onWSReceive = (message) => {
    if (first.value === true) {
        first.value = false
        resizeRemoteTerminal()
    }
    const data = message.data
    const reader = new FileReader()
    reader.onload = function (e) {
        const base64Content = e.target.result
        term.value.write(base64Content)
    }
    reader.readAsText(data)
    term.value.element && term.value.focus()
}

// WebSocket连接出错
const errorRealTerminal = (ex) => {
    let message = ex.message
    if (!message) message = 'disconnected'
    term.value.write(`\x1b[31m${message}\x1b[m\r\n`)
}

// WebSocket连接已关闭
const closeRealTerminal = () => {
    console.log('close')
}

// 初始化Terminal
const initTerm = () => {
    term.value = new Terminal({
        fontSize: 14,
        fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
        theme: { background: '#181d28' },
        cursorBlink: true,
        cursorStyle: 'underline',
    })
    term.value.open(terminal.value)
    term.value.loadAddon(fitAddon)
    setTimeout(() => { fitAddon.fit() }, 5)
    termData()
}

// 终端输入触发事件
const termData = () => {
    term.value.onData((data) => {
        sendCommandToBackend(data)
    })
    term.value.onResize(() => { resizeRemoteTerminal() })
}

// 发送命令到后端
const sendCommandToBackend = (command) => {
    if (isWsOpen()) {
        terminalSocket.value.send(
            JSON.stringify({
                type: 'terminal',
                data: {
                    base64: btoa(command),
                },
            })
        )
        console.log("Command sent to backend:", command)
    }
}

// 判断WebSocket是否连接
const isWsOpen = () => {
    const readyState = terminalSocket.value && terminalSocket.value.readyState
    return readyState === 1
}

// 尺寸同步
const resizeRemoteTerminal = () => {
    const { cols, rows } = term.value
    if (isWsOpen()) {
        terminalSocket.value.send(
            JSON.stringify({
                type: 'resize',
                data: { rows, cols },
            })
        )
    }
}

// 浏览器窗口变化时调整终端尺寸
const fitTerm = () => { fitAddon.fit() }
const onResize = debounce(() => fitTerm(), 500)
const onTerminalResize = () => { window.addEventListener('resize', onResize) }
const removeResizeListener = () => { window.removeEventListener('resize', onResize) }

onMounted(() => {
    
    initWS()
    initTerm()
    onTerminalResize()
})

onBeforeUnmount(() => {
    removeResizeListener()
    terminalSocket.value && terminalSocket.value.close()
})
</script>
