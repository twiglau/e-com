# 配置

## 为什么需要在 product-service env 添加DATABASE_URL

- 需要在 product-service 的.env 中添加 DATABASE_URL 的原因主要涉及 代码的执行上下文（Execution Context）。

## 详细的解释：

1. 谁在运行？ 当你运行 pnpm dev 启动服务时，启动的是 product-service 这个 Node.js 进程。

2. 谁提供环境？ Node.js 中的 process.env 读取的是当前 运行进程 的环境变量。即使product-db 包里有一个 .env 文件，在这个进程启动时，通常只会自动加载项目根目录（apps/product-service/.env）下的变量。库（Packages）里的 .env 通常不会被自动读取。

3. 库的角色 product-db 只是一个代码库。当 product-service 引用它时，它的代码（const connectionString = process.env.DATABASE_URL）就像是被复制到了 product-service 里执行。 如果 product-service 的环境中没有 DATABASE_URL，这行代码读到的就是 undefined，从而导致连接失败。

## 总结：

- “在哪里运行，就在哪里配置”。因为是 product-service 在跑，所以必须由它来提供数据库连接所需的钥匙（DATABASE_URL）。这样做的好处是，你可以让不同的 App（比如以后有个 order-service）复用同一个 product-db 代码库，但是通过配置不同的 .env 连接到完全不同的数据库实例。
