<template>
    <div class="container">
      <my-terminal :terminal="terminal"></my-terminal>
    </div>
  </template>
  
  <script>
  import ConsoleT from './ConsoleT'
  
  export default {
    name: 'WebSSH',
    data () {
      return {
        terminal: {
          pid: 1,
          name: 'terminal',
          cols: 400,
          rows: 400
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
  