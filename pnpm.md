# pnpm 相关命令

## `pnpm dlx tsx` 是一个组合命令，用于在不预先安装的情况下直接运行 TypeScript 代码。

1. pnpm dlx
   - 作用：类似于 npm 的 npx。
   - 含义：Download and Load and Execute（下载、加载并执行）。
   - 原理：它会从 npm 仓库拉取指定的软件包到临时缓存中，并执行其中的二进制命令。
   - 优点：你不需要在 devDependencies 中正式安装这个包，也不会污染本地或全局的 node_modules。

2. tsx
   - 作用：这是一个非常快的 TypeScript 执行引擎（基于 esbuild）。
   - 核心功能：
     - 直接运行：让你能直接执行.ts文件，而不需要先运行 tsc 把代码编译成.js。
     - 现代特性：原生支持 ESM (ECMAScript Modules)。
     - 监听模式 (--watch)：在你的package.json中用到了这个参数，意味着当你修改代码并保存时，它会自动重启服务。
