import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon",
        }),
      ],
    }),
    Components({
      resolvers: [
        NaiveUiResolver(),
        ElementPlusResolver(),
        IconsResolver(
          {
            enabledCollections: ["ep"],
          }
        )
      ],
      dts: 'src/types/components.d.ts', // 生成类型声明文件
      
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3'
    }),

  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env': process.env
  },
})
