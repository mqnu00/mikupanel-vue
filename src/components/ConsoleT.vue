<template>
  <div class="console" id="terminal"></div>
</template>
<script>
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'
export default {
name: 'ConsoleT',
data () {
  return {
    term: null,
    terminal: null,
    terminalSocket: null
  }
},
methods: {
  runRealTerminal () {
    console.log('webSocket is finished')
  },
  errorRealTerminal () {
    console.log('error')
  },
  closeRealTerminal () {
    console.log('close')
  }
},
mounted () {
  this.terminal = new Terminal({
    fontSize: 14,
    cursorBlink: true,
    allowProposedApi: true,
    disableStdin: false,
    convertEol: true,
    scrollback: 5000,
    theme: {
      foreground: "#58a6ff", //字体,LightGreen,Orange,SlateBlue,Magenta Purple Red Violet White Yellow
      background: "#2B2B2B", //背景色
      cursor: "Orange" //设置光标
    }
  })
  console.log('pid : ' + this.terminal.pid + ' is on ready')
  let terminalContainer = document.getElementById('terminal')
  this.term = new Terminal()
  this.term.open(terminalContainer)
  // open websocket
  this.terminalSocket = new WebSocket('ws://127.0.0.1:8000/terminals/')
  this.terminalSocket.onopen = this.runRealTerminal
  this.terminalSocket.onclose = this.closeRealTerminal
  this.terminalSocket.onerror = this.errorRealTerminal
  const attachAddon = new AttachAddon(this.terminalSocket);
  this.term.loadAddon(attachAddon)
  const fitAddon = new FitAddon();
  this.term.loadAddon(fitAddon);
  this.term._initialized = true
  fitAddon.fit();
  console.log('mounted is going on')
  window.addEventListener('resize', () => {
  fitAddon.fit();
});
},
beforeUnmount () {
  this.terminalSocket.close()
  this.term.destroy()
}
}
</script>