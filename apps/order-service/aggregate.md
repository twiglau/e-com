# MongoDB Aggregation 详解

## 什么是 Aggregation？

MongoDB 的 **Aggregation Pipeline（聚合管道）** 是一种强大的数据处理框架，类似于 SQL 的 `GROUP BY` 和复杂查询，但更加灵活和强大。

---

## 订单统计查询示例

```typescript
const rawStats = await OrderModel.aggregate([
  // 第1步：$match - 筛选数据
  {
    $match: {
      createdAt: { $gte: sixMonthAgo, $lte: now },
    },
  },
  // 第2步：$group - 分组聚合
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      },
      total: { $sum: 1 },
      success: {
        $sum: {
          $cond: [{ $eq: ["$status", "success"] }, 1, 0],
        },
      },
    },
  },
  // 第3步：$project - 重塑输出格式
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      total: 1,
      success: 1,
    },
  },
  // 第4步：$sort - 排序
  {
    $sort: {
      year: 1,
      month: 1,
    },
  },
]);
```

---

## 逐步解析

### 1️⃣ `$match` - 筛选阶段

```typescript
{
  $match: {
    createdAt: { $gte: sixMonthAgo, $lte: now }
  }
}
```

- **作用**：过滤出最近 6 个月的订单
- **类似 SQL**：`WHERE createdAt >= sixMonthAgo AND createdAt <= now`
- **性能提示**：应该放在管道最前面，减少后续处理的数据量

---

### 2️⃣ `$group` - 分组聚合阶段

```typescript
{
  $group: {
    _id: {
      year: { $year: "$createdAt" },   // 按年份分组
      month: { $month: "$createdAt" }  // 按月份分组
    },
    total: { $sum: 1 },  // 统计每组的订单总数
    success: {
      $sum: {
        $cond: [
          { $eq: ["$status", "success"] },  // 如果状态是 success
          1,  // 则加 1
          0   // 否则加 0
        ]
      }
    }
  }
}
```

**详细说明：**

- **`_id`**：定义分组的键（按年月分组）
  - `{ $year: "$createdAt" }`：提取年份（例如 2026）
  - `{ $month: "$createdAt" }`：提取月份（例如 2）
- **`total: { $sum: 1 }`**：每条记录加 1，统计总数
- **`success`**：条件求和
  - 如果 `status === "success"`，加 1
  - 否则加 0

**类似 SQL**：

```sql
SELECT
  YEAR(createdAt) as year,
  MONTH(createdAt) as month,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success
FROM orders
WHERE createdAt >= sixMonthAgo AND createdAt <= now
GROUP BY YEAR(createdAt), MONTH(createdAt)
```

---

### 深入理解 `$group` 中的 `_id`

在 `$group` 阶段，**`_id` 是必填字段**，它定义了**分组的依据**（类似 SQL 的 `GROUP BY`）。

**核心概念：**

- **`_id`**：决定数据按什么规则分组
- 相同 `_id` 值的文档会被分到同一组
- 每组会生成一个结果文档

**示例 1：按单个字段分组**

```typescript
{
  $group: {
    _id: "$userId",  // 按用户 ID 分组
    orderCount: { $sum: 1 }
  }
}
```

输入：

```json
[
  { "userId": "user1", "amount": 100 },
  { "userId": "user1", "amount": 200 },
  { "userId": "user2", "amount": 150 }
]
```

输出：

```json
[
  { "_id": "user1", "orderCount": 2 },
  { "_id": "user2", "orderCount": 1 }
]
```

**示例 2：按多个字段分组（订单统计中的用法）**

```typescript
{
  $group: {
    _id: {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" }
    },
    total: { $sum: 1 }
  }
}
```

输入：

```json
[
  { "createdAt": "2026-01-15", "status": "success" },
  { "createdAt": "2026-01-20", "status": "failed" },
  { "createdAt": "2026-02-10", "status": "success" }
]
```

输出：

```json
[
  { "_id": { "year": 2026, "month": 1 }, "total": 2 },
  { "_id": { "year": 2026, "month": 2 }, "total": 1 }
]
```

**示例 3：不分组（统计所有）**

```typescript
{
  $group: {
    _id: null,  // 不分组，所有数据算一组
    totalOrders: { $sum: 1 },
    totalAmount: { $sum: "$amount" }
  }
}
```

输入：

```json
[
  { "userId": "user1", "amount": 100 },
  { "userId": "user2", "amount": 200 },
  { "userId": "user3", "amount": 150 }
]
```

输出：

```json
[{ "_id": null, "totalOrders": 3, "totalAmount": 450 }]
```

| `_id` 值                             | 含义                 | 类似 SQL               |
| ------------------------------------ | -------------------- | ---------------------- |
| `"$userId"`                          | 按 userId 分组       | `GROUP BY userId`      |
| `{ year: "$year", month: "$month" }` | 按年月组合分组       | `GROUP BY year, month` |
| `null`                               | 不分组，所有数据一组 | 不使用 `GROUP BY`      |

---

### 3️⃣ `$project` - 重塑输出格式

```typescript
{
  $project: {
    _id: 0,              // 隐藏 _id 字段
    year: "$_id.year",   // 将 _id.year 提取为 year
    month: "$_id.month", // 将 _id.month 提取为 month
    total: 1,            // 保留 total 字段
    success: 1           // 保留 success 字段
  }
}
```

**作用**：调整输出结构

**转换前：**

```json
{
  "_id": { "year": 2026, "month": 2 },
  "total": 150,
  "success": 120
}
```

**转换后：**

```json
{
  "year": 2026,
  "month": 2,
  "total": 150,
  "success": 120
}
```

---

### 4️⃣ `$sort` - 排序阶段

```typescript
{
  $sort: {
    year: 1,   // 按年份升序 (1 = 升序, -1 = 降序)
    month: 1   // 按月份升序
  }
}
```

**作用**：确保结果按时间顺序排列（从旧到新）

---

## 最终输出示例

```json
[
  { "year": 2025, "month": 9, "total": 80, "success": 65 },
  { "year": 2025, "month": 10, "total": 95, "success": 78 },
  { "year": 2025, "month": 11, "total": 110, "success": 92 },
  { "year": 2025, "month": 12, "total": 130, "success": 105 },
  { "year": 2026, "month": 1, "total": 140, "success": 115 },
  { "year": 2026, "month": 2, "total": 150, "success": 120 }
]
```

这个数据可以直接用于前端绘制图表（例如折线图或柱状图）。

---

## 常用 Aggregation 操作符

| 操作符     | 作用                  | 示例                                                 |
| ---------- | --------------------- | ---------------------------------------------------- |
| `$match`   | 筛选文档              | `{ $match: { status: "success" } }`                  |
| `$group`   | 分组聚合              | `{ $group: { _id: "$userId", count: { $sum: 1 } } }` |
| `$project` | 重塑输出              | `{ $project: { name: 1, _id: 0 } }`                  |
| `$sort`    | 排序                  | `{ $sort: { createdAt: -1 } }`                       |
| `$limit`   | 限制数量              | `{ $limit: 10 }`                                     |
| `$skip`    | 跳过记录              | `{ $skip: 20 }`                                      |
| `$lookup`  | 关联查询（类似 JOIN） | `{ $lookup: { from: "users", ... } }`                |
| `$unwind`  | 展开数组              | `{ $unwind: "$items" }`                              |

---

## 性能优化建议

1. **`$match` 尽量放在最前面**：减少后续阶段处理的数据量
2. **使用索引**：确保 `$match` 和 `$sort` 的字段有索引
3. **避免不必要的 `$project`**：只在需要时使用
4. **使用 `allowDiskUse`**：处理大数据集时允许使用磁盘
   ```typescript
   OrderModel.aggregate([...], { allowDiskUse: true })
   ```
