# date-fns 使用指南

## 什么是 date-fns？

`date-fns` 是一个**现代化的 JavaScript 日期处理库**，提供了超过 200 个函数来操作日期和时间。

### 核心特点：

- **模块化**：按需导入，不会打包整个库
- **不可变**：所有函数都返回新的日期对象，不修改原对象
- **TypeScript 友好**：完整的类型定义
- **轻量级**：比 Moment.js 小很多

---

## 常见应用场景

### 1. 日期格式化

```typescript
import { format } from "date-fns";

format(new Date(), "yyyy-MM-dd"); // "2026-02-03"
format(new Date(), "yyyy年MM月dd日"); // "2026年02月03日"
```

### 2. 日期计算

```typescript
import { addDays, subMonths, differenceInDays } from "date-fns";

addDays(new Date(), 7); // 7天后
subMonths(new Date(), 3); // 3个月前
differenceInDays(new Date("2026-12-31"), new Date()); // 距离年底还有多少天
```

### 3. 日期比较

```typescript
import { isAfter, isBefore, isToday } from "date-fns";

isAfter(new Date("2026-12-31"), new Date()); // true
isToday(new Date()); // true
```

### 4. 获取时间范围

```typescript
import { startOfMonth, endOfMonth, startOfWeek } from "date-fns";

startOfMonth(new Date()); // 本月第一天 00:00:00
endOfMonth(new Date()); // 本月最后一天 23:59:59
```

---

## 前端和后端使用

**`date-fns` 可以在前端和后端无缝使用**，没有环境限制。

### 后端（Node.js）示例

```typescript
import { startOfMonth, subMonths } from "date-fns";

const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
const orders = await OrderModel.find({
  createdAt: { $gte: sixMonthsAgo },
});
```

### 前端（React/Next.js）示例

```tsx
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

function OrderList({ orders }) {
  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>
          <p>订单时间：{format(order.createdAt, "yyyy-MM-dd HH:mm")}</p>
          <p>距今：{formatDistanceToNow(order.createdAt, { locale: zhCN })}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 使用注意事项

### 1. 时区处理

`date-fns` 默认使用**本地时区**，如果需要处理 UTC 或其他时区，需要使用 `date-fns-tz`：

```bash
pnpm add date-fns-tz
```

```typescript
import { formatInTimeZone } from "date-fns-tz";

formatInTimeZone(new Date(), "Asia/Shanghai", "yyyy-MM-dd HH:mm:ss");
```

### 2. 国际化（i18n）

如果需要中文或其他语言，需要导入对应的 locale：

```typescript
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

format(new Date(), "PPP", { locale: zhCN }); // "2026年2月3日"
```

### 3. Tree-shaking

确保你的打包工具支持 Tree-shaking（Webpack/Vite 默认支持）：

```typescript
// ✅ 推荐：按需导入
import { format, addDays } from "date-fns";

// ❌ 不推荐：导入整个库
import * as dateFns from "date-fns";
```

---

## 对比其他库

| 库           | 大小         | 特点                        |
| ------------ | ------------ | --------------------------- |
| **date-fns** | ~13KB (按需) | 模块化、现代、Tree-shakable |
| Moment.js    | ~230KB       | 老牌但体积大，已停止维护    |
| Day.js       | ~7KB         | 轻量，API 类似 Moment       |

---

## 支持情况总结

| 特性             | 支持情况              |
| ---------------- | --------------------- |
| **前端使用**     | ✅ 完全支持           |
| **后端使用**     | ✅ 完全支持           |
| **TypeScript**   | ✅ 原生支持           |
| **Tree-shaking** | ✅ 支持               |
| **时区处理**     | ⚠️ 需要 `date-fns-tz` |
| **国际化**       | ⚠️ 需要导入 locale    |

**推荐使用 `date-fns`**，特别是在需要复杂日期操作的场景。
