// import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import dayjs from "dayjs";
import { defineConfig } from "vite";
import pkg from "./package.json";
// import vue from "@vitejs/plugin-vue";
// import Components from "unplugin-vue-components/vite";
// import { VantResolver } from "@vant/auto-import-resolver";
import { createVitePlugins } from "./build/plugins";
import path from "path";
import postCssPxToRem from "postcss-pxtorem";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};
const resolve = (dir) => path.join(__dirname, dir);
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd();

  const env = loadEnv(mode, root);
  const { VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = env;

  const isBuild = command === "build";
  return {
    base: VITE_PUBLIC_PATH,
    root,
    // plugins: [
    //     vue(),
    //     Components({
    //         resolvers: [VantResolver()]
    //     })
    // ],
    plugins: createVitePlugins(env, isBuild),
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
    },
    resolve: {
      alias: {
        // "@": fileURLToPath(new URL("./src", import.meta.url))
        "~/": `${path.resolve(__dirname, "src")}/`,
        "@": resolve("src"),
      },
    },
    css: {
      // preprocessorOptions: {
      //   scss: {
      //     //
      //     additionalData: `
      //     @import "@/assets/scss/_common.scss";
      //     @import "@/assets/scss/global/_variables.scss";
      //     `,
      //   },
      // },
      postcss: {
        // ⚠️关键代码
        plugins: [
          tailwindcss({}),
          postCssPxToRem({
            // 自适应，px>rem转换
            rootValue: 37.5, // 1rem的大小
            propList: ["*", "!border"], // 需要转换的属性，这里选择全部都进行转换
          }),
          autoprefixer({
            // 自动添加前缀
            overrideBrowserslist: [
              "Android 4.1",
              "iOS 7.1",
              "Chrome > 31",
              "ff > 31",
              "ie >= 8",
              //'last 2 versions', // 所有主流浏览器最近2个版本
            ],
            grid: true,
          }),
        ],
      },
    },
    build: {
      sourcemap: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    define: {
      // 解决打包报错
      __INTLIFY_PROD_DEVTOOLS__: false,
      // 系统信息
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
