<template>
    <div class="container">
      <my-terminal :terminal="terminal"></my-terminal>
    </div>
  </template>
  
  <script>
  import ConsoleT from './ConsoleT.vue'
  
  export default {
    name: 'WebSSH',
    data () {
      return {
        terminal: {
          pid: 1,
          name: 'terminal',
          cols: 500,
          rows: 40
        }
      }
    },
    components: {
      'my-terminal': ConsoleT
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  