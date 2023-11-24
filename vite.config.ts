import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import fs from "fs";
import path from "path"; // console高亮
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite"; // 组件自动引入
import tailwindCss from "tailwindcss";

const pages: string[] = [];

function getEntryPath() {
  const map: any = {}; //最后生成的多页面配置项
  const PAGE_PATH = path.resolve(__dirname, "./src/views/project"); //指定要查询的目录
  const entryFiles = pages.length === 0 ? fs.readdirSync(PAGE_PATH) : pages; //获取到指定目录下的所有文件名或指定文件名
  entryFiles.forEach((filePath) => {
    //遍历处理每个子页面的入口
    map[filePath] = path.resolve(
      __dirname,
      `src/views/project/${filePath}/index.html`
    );
  });
  return map;
}

const entryMap = getEntryPath();

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],
      dts: path.resolve(__dirname, "src/types/auto-import.d.ts"),
      eslintrc: {
        enabled: false, // 是否自动生成 eslint 规则，建议生成之后设置 false
        filepath: path.resolve(__dirname, "./.eslintrc-auto-import.json"), // 指定自动导入函数 eslint 规则的文件
        globalsPropValue: true,
      },
    }),
    Components({
      deep: true,
      globalNamespaces: ["global"],
      include: [/\.vue($|\?)/, /\.md($|\?)/],
      directoryAsNamespace: true,
      // include: [/\.vue($|\?)/, /\.tsx($|\?)/],
      globs: [
        path.resolve(__dirname, "src/views/components/**/*.vue"),
        path.resolve(__dirname, "src/views/components/**/*.tsx"),
      ],
      dts: path.resolve(__dirname, "src/types", "components.d.ts"), // 指定自动导入组件TS类型声明文件路径
    }),
  ],
  root: "./src/views/project",
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
      "@project": path.join(__dirname, "./src/views/project"),
    },
  },
  build: {
    rollupOptions: {
      input: entryMap,
      external: ["vscode", "fs", "path"],
      output: {
        // format: "es",
        chunkFileNames: "js/[name]-[hash].js", //chunk包输出的文件夹名
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "extension") {
            return "[name].js";
          }

          return "js/[name]-[hash].js";
        }, //入口文件输出的文件夹名称
        assetFileNames(assetInfo) {
          const name = assetInfo?.names?.[0]?.split(".")?.at(-1) || "";
          if (
            ["png", "jpg", "jpeg", "svg", "ico", "webp"].some((item) =>
              name.endsWith(item)
            )
          ) {
            return "assets/img/[name]-[hash].[ext]";
          }

          return "[ext]/[name]-[hash].[ext]";
        },
      },
    },
    outDir: path.resolve(__dirname, `dist`), // 指定输出路径
  },
  css: {
    postcss: {
      plugins: [tailwindCss()],
    },
  },
});
