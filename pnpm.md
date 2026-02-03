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

## monorepo workspace 项目

1. 内部依赖解析由包管理器控制
   - 在你的项目中，pnpm workspace 会直接解析 workspace:\* 依赖到源代码目录，而不是通过 npm registry。这意味着：
     - 不需要考虑发布到 npm 后的兼容性
     - 不需要支持各种老旧的 Node.js 版本
     - 包管理器会直接读取 exports 字段
2. 统一的现代技术栈
   - 你的 monorepo 中所有包都使用：
     - "type": "module" (ESM)
     - TypeScript
     - 现代 Node.js 版本（支持 exports）
   - 所以不需要为了兼容 CommonJS 或老版本 Node.js 而保留 main。
3. exports 提供更好的封装

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./models": "./src/models/index.ts" // 可以精确控制哪些模块可以被导入
  }
}
```

- 这样可以防止其他包直接 import 你不想暴露的内部文件，比如：

```ts
// ❌ 如果只有 main，这样可以导入
import { something } from "@repo/order-db/src/internal/private";

// ✅ 使用 exports 后，只能导入你明确暴露的路径
import { OrderModel } from "@repo/order-db";
```

4. 总结

- 对于公开发布到 npm 的包，保留 main 可以兼容老环境。但对于内部 workspace 包，只用 exports 更简洁、更安全。
