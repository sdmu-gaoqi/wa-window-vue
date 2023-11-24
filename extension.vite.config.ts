import { defineConfig } from "vite";
import path from "path"; // console高亮

const entryMap = {
  extension: path.resolve(__dirname, "src/extension.ts"),
};

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  root: "./src/views/project",
  build: {
    lib: {
      entry: path.resolve(__dirname, "dist/extension.js"),
      formats: ["cjs"],
    },
    rollupOptions: {
      input: entryMap,
      external: ["vscode", "fs", "path"],
      output: {
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
});
