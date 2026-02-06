# package 配置

## 冲突吗？

- 这两个字段不冲突，它们各有用途，但在现代 Node.js 项目中，建议使用 exports。

```json
{
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

## 区别：

- main
  - 传统字段（Node.js 早期）
  - 只能指定一个入口文件
  - 适用于 CommonJS (require())

- exports
  - 现代字段（Node.js 12.7+）
  - 更强大，支持多个导出路径
  - 同时支持 ESM (import) 和 CommonJS
  - 优先级高于 main

## 项目环境：

- 由于你的项目使用了 "type": "module"（ESM 模式），应该保留 exports，可以删除 main：
- 如果想兼容老版本 Node.js，可以两者都保留（不会冲突，exports 优先）：
- 但对于 monorepo workspace 项目，只用 exports 就够了。

## 配置 mongo 数据库权限

```sh
# 查看信息
docker ps | grep mongo

# exec 进入 sh
docker exec -it nestjs-demo-mongo-1 mongosh -u root -p example

# ERROR [MongooseModule] Unable to connect to the database, Retrying (1)...
# 给 root 分配权限  MongoServerError: Command find requires authentication
test> show dbs
test> use testdb
nest> db.createUser({user:'root', pwd:'example',roles:[{role:'dbOwner',db:'testdb'}]})
# 查看链接数
nest> db.serverStatus().connections

```
