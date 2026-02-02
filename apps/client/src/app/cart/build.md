# useSearchParams() should be wrapped in a suspense boundary at page "/cart". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout

## 为什么会出现这个报错？

- 在 Next.js (App Router) 中，useSearchParams() 是一个客户端钩子。如果你在构建（Build）时直接在页面中调用它，Next.js 无法确定静态生成的 URL 包含哪些参数。为了允许页面其他部分保持静态生成，Next.js 要求必须使用 <Suspense> 边界包裹使用该钩子的组件。

## 修复方案

- 将代码重构为两个组件：

1. CartPageContent：包含所有原来的交互逻辑。
2. CartPage (Default Export)：作为父组件提供 Suspense 边界。

```tsx
const CartPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPageContent />
    </Suspense>
  );
};
```
