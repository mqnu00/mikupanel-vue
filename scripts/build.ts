// scripts/build-plugins.ts
import fs from 'fs'
import path from 'path'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { defineConfig } from 'vite'
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import terser from '@rollup/plugin-terser';
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '../');

console.log(__dirname)

// const PLUGINS_DIR = path.resolve(__dirname, '../plugins')
const PLUGINS_DIR = path.resolve(__dirname, './src/views')
const OUTPUT_DIR = path.resolve(__dirname, './dist/plugins')

// 清空并创建输出目录
function prepareOutputDir() {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 获取所有 Vue 组件文件路径
// function getComponentFiles(): string[] {
//   return fs.readdirSync(PLUGINS_DIR)
//     .filter(file => file.endsWith('.vue'))
//     .map(file => path.join(PLUGINS_DIR, file))
// }

function getComponentFiles(): string[] {
  const results: string[] = []

  // 读取目录内容
  const files = fs.readdirSync(PLUGINS_DIR)

  for (const file of files) {
    console.log(file)
    const filePath = path.join(PLUGINS_DIR, file)
    const stat = fs.statSync(filePath)

    // 如果是目录，检查是否存在与目录同名的 .vue 文件
    if (stat.isDirectory()) {
      console.log('dir')
      const name = file.charAt(0).toUpperCase() + file.slice(1)
      let componentFile = path.join(filePath, `${name}.vue`)
      console.log(componentFile)
      if (fs.existsSync(componentFile)) {
        console.log(componentFile)
        results.push(componentFile)
      }
    }
  }

  return results
}

// 自定义 Rollup 插件
function addImportToComponent(componentName: string) {
  return {
    name: 'add-import-to-compiled-file',
    generateBundle(outputOptions: any, bundle: any) {
      // 遍历生成的文件
      if (`${componentName}.css` in bundle) {
        if (`${componentName}.js` in bundle) {
          const fileName = `${componentName}.js`
          console.log("???")
            // 获取文件内容
            let code = bundle[fileName].code;
            console.log(bundle[fileName])
            // 添加 import 语句
            const newCode = `
              import './${componentName}.css';
              ${code}
            `;
            // 更新文件内容
            bundle[fileName].code = newCode;
        }
      }
    }
  };
}

// 单独编译每个组件
async function buildComponent(inputPath: string) {
  const filename = path.basename(inputPath)
  const componentName = filename.replace(/\.vue$/, '')
  const outputPath = path.join(OUTPUT_DIR, componentName, `${componentName}.js`)

  await build({
    configFile: false,
    plugins: [
      vue(),
      AutoImport({
            imports: ['vue'],
            resolvers: [
              ElementPlusResolver(),
              IconsResolver({
                prefix: "Icon",
              })
            ]
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
            dts: '../src/types/components.d.ts', // 生成类型声明文件
            
          }),
      Icons({
            autoInstall: true,
            compiler: 'vue3'
          }),
          terser({
            compress: {
              // 禁止将变量名压缩为 'h'
              pure_getters: true,
              keep_fargs: false,
              keep_fnames: true,
              keep_classnames: true,
              keep_infinity: true,
              passes: 2,
              // 自定义保留的变量名
            },
            mangle: {
              // 禁止变量名被替换为 'h'
              reserved: ['h']
            }
          }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      
      addImportToComponent(componentName)
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      cssCodeSplit: true, // 禁用 CSS 代码分割
      emptyOutDir: false,
      lib: {
        entry: inputPath,
        name: 'Component',
        formats: ['es'],
        fileName: () => path.basename(outputPath)
      },
      rollupOptions: {
        external: ['vue', 'vue-router', 'pinia'], // 不将 Vue 标记为外部依赖
        output: {
          dir: path.dirname(outputPath),
          // 禁止变量提升到全局
          hoistTransitiveImports: false,
          globals: {
          }
        }
      }
    }
  })

  console.log(`Built: ${filename}`)
}

// 主构建流程
async function main() {
  prepareOutputDir()
  const components = getComponentFiles()

  for (const component of components) {
    await buildComponent(component)
  }

  console.log('All components built successfully!')
}

main().catch(console.error)