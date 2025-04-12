<template>
  <div ref="editorContainer" class="monaco-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, onUnmounted } from 'vue';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/shell/shell.contribution.js';

export default defineComponent({
  name: 'LogReader',
  props: {
    model: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'shell'
    }
  },
  setup(props) {
    const editorContainer = ref<HTMLElement | null>(null);
    let editor: monaco.editor.IStandaloneCodeEditor | null = null;

    onMounted(() => {
      if (editorContainer.value) {
        editor = monaco.editor.create(editorContainer.value, {
          value: props.model,
          language: props.language,
          readOnly: true,
          automaticLayout: true // Add this for better resize handling
        });

        // Scroll to top initially
        editor.revealLine(1);
      }
    });

    watch(() => props.model, (newContent) => {
      if (editor) {
        if (newContent) {
          editor.setValue(newContent);
        } else {
          editor.setValue('');
        }
        // Use setValue to completely replace content
        
        // Scroll to top after update
        editor.revealLine(1);
      }
    });

    onUnmounted(() => {
      if (editor) {
        editor.dispose();
      }
    });

    return {
      editorContainer
    };
  }
});
</script>

<style scoped>
.monaco-container {
  height: 100%;
  width: 100%;
  min-height: 300px; /* Ensure it has some minimum height */
}
</style>