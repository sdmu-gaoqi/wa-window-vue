# wa-window-vue

vue 开发的 vscode 窗口工具插件

## 功能说明

### 翻译

- 需要配合翻译插件使用
- 需要在后台去申请对应的 appid
  ![image](./img/set.png)

### aes 解密

### json 转 ts

## 开发说明

### 本地启动

```bash
yarn dev
```

访问路径
http://localhost:5173/你的项目名/

### 创建项目

```bash
create:project
```

### 调试

1. 打包

```bash
yarn build
```

先生成 cjs 的 extension.js,再生成浏览器可运行的 esm

2. 点击 仍然调试
   todo: 解决.vscode/tasks.json 配置
