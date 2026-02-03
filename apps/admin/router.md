# next/router 和 next/navigation

这两个是 Next.js 不同版本的路由 API，主要区别在于它们支持的架构：

## `next/router` (Pages Router - 传统)

- **适用于**：`pages/` 目录架构（Next.js 12 及之前）
- **导入**：`import { useRouter } from 'next/router'`
- **特点**：
  - 基于文件系统路由
  - 只能在客户端组件使用
  - API 比较简单直接

**使用示例：**

```tsx
import { useRouter } from "next/router";

function MyPage() {
  const router = useRouter();

  // 获取路由参数
  const { id } = router.query;

  // 导航
  router.push("/products");
  router.replace("/login");
  router.back();

  return <div>Current path: {router.pathname}</div>;
}
```

---

## `next/navigation` (App Router - 现代)

- **适用于**：`app/` 目录架构（Next.js 13+）
- **导入**：`import { useRouter, usePathname, useSearchParams } from 'next/navigation'`
- **特点**：
  - 支持 React Server Components
  - API 更细分（`useRouter`, `usePathname`, `useSearchParams` 分离）
  - 更好的 TypeScript 支持

**使用示例：**

```tsx
"use client"; // 必须声明为客户端组件

import { useRouter, usePathname, useSearchParams } from "next/navigation";

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname(); // 获取当前路径
  const searchParams = useSearchParams(); // 获取查询参数

  // 导航
  router.push("/products");
  router.replace("/login");
  router.back();

  // 获取查询参数
  const id = searchParams.get("id");

  return <div>Current path: {pathname}</div>;
}
```

---

## 使用场景

| 场景                   | 使用哪个                                      |
| ---------------------- | --------------------------------------------- |
| 项目使用 `pages/` 目录 | `next/router`                                 |
| 项目使用 `app/` 目录   | `next/navigation`                             |
| 新项目（Next.js 13+）  | `next/navigation`                             |
| 老项目迁移             | 逐步从 `next/router` 迁移到 `next/navigation` |

---

## 总结

- **`next/router`**：老架构，简单直接
- **`next/navigation`**：新架构，更强大，支持 Server Components

如果你的项目是 Next.js 13+ 并使用 `app/` 目录，**强烈推荐使用 `next/navigation`**。
