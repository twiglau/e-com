# zustand

## onRehydrateStorage 是什么意思？

- 在 Zustand 的 persist 中，onRehydrateStorage是一个生命周期钩子（lifecycle hook），它主要用于监听和处理**“脱水状态恢复”（Rehydration）**的过程。

1. 什么是 Rehydration（再水化/数据恢复）？
   > 当你使用 persist 中间件时，Zustand 会把状态保存在 localStorage 中。当用户刷新页面或重新打开应用时，中间件需要把 localStorage 里的持久化数据读取出来，重新填回 Zustand 的 Store 中。这个**“读取并恢复”**的过程就叫 Rehydration。
2. onRehydrateStorage的作用
   > 这个配置项让你能够在这个恢复过程的“开始”和“结束”时执行代码。它接受一个函数，这个函数返回另一个函数：

```javascript
onRehydrateStorage: (state) => {
  // 1. 这里是在恢复过程【开始】时触发
  console.log('hydration starts');

  return (state, error) => {
    // 2. 这里是在恢复过程【结束】时触发
    if (error) {
      console.log('an error happened during hydration', error);
    } else {
      console.log('hydration finished');
      // 你可以在这里标记状态已恢复
      if (state) state.hasHydrated = true;
    }
  };
},
```

3. 为什么你在代码里需要它？（特别是 Next.js）

- 在cartStore.ts中，这段代码非常关键：

```javascript
onRehydrateStorage: () => (state) => {
  if (state) {
    state.hasHydrated = true; // 标记数据已加载完毕
  }
},
```

- 原因：解决“水化不匹配”（Hydration Mismatch）错误。

  > 在 Next.js (SSR) 中，服务器生成 HTML 时，它不知道用户的 localStorage 里有什么（购物车可能是空的）。但当代码在浏览器运行时，Zustand 会立刻从 localStorage 加载数据。
  > 如果你的组件直接根据购物车数量渲染：
  >
  > > 服务器渲染结果：购物车显示 0
  > > 浏览器初始渲染：购物车从 localStorage 加载后显示 5

- 这会导致浏览器报错，说服务器渲染的内容和客户端不一致。

  > 通过 hasHydrated 标志位，你可以这样写组件：

```javascript
const { cart, hasHydrated } = useCartStore();

// 只有当数据已经从本地存储恢复后，才显示真实的购物车数量
// 在此之前显示 loading 或占位符，避免服务器/客户端内容不一致
if (!hasHydrated) return <Loading />;

return <div>Cart count: {cart.length}</div>;
```

4. 总结
   - onRehydrateStorage就是用来告诉你数据什么时候从 localStorage 回传到了 Store 中。通过它设置的 hasHydrated 状态，你可以确保 UI 只在数据准备好之后才渲染，避免 SSR 的常见报错。
