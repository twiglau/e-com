# removeFromCart(item.id) 被直接当作 prop 传入并在渲染期间执行了 为什么呢？

- 这是一个非常经典且容易忽视的 JavaScript/React 基础问题。

## 为什么它会立即执行？

- 在 JavaScript 中，当你写 func() 时，你是在**调用（执行）**这个函数。

```tsx
// 你的代码之前是这样写的
<CartItem key={item.id} item={item} removed={removeFromCart(item.id)} />
```

- 这里发生了三件事：

1. 解析参数：React 在渲染CartPage组件时，遇到了 removed 这个 prop。
2. 立即执行：为了确定要传给 removed 的到底是什么值，它必须运行等号右边的表达式。于是它运行了removeFromCart(item.id)。
3. 传递返回值：由于removeFromCart本身执行了 set(...) 操作，它的返回值通常是 undefined。所以 React 实际上是把 undefined 传给了cartItem的 removed prop。

## 为什么要改用箭头函数？

```tsx
// 修复后的代码
<CartItem key={item.id} item={item} removed={() => removeFromCart(item.id)} />
```

- 当你写 `() => removeFromCart(item.id)` 时，你创建了一个新的匿名函数。
  - 解析参数：React 看到 removed 等号右边是一个函数定义。
  - 不执行：此时表达式的结果就是这个“函数本身”，而不是“函数的运行结果”。
  - 传递引用：React 把这个函数的引用传给了 CartItem。
  - 等待触发：只有当用户在 CartItem组件里点击删除按钮，手动调用 removed() 时，包裹在里面的
    removeFromCart(item.id)才会真正运行。
