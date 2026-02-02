# Next.js 部署指南 (云服务器)

部署 Next.js 项目到云服务器（如阿里云、腾讯云、AWS 等）通常有两种主流方式：**手动部署 (Node.js + PM2)** 或 **Docker 部署**。以下是推荐的手动部署流程。

---

## 1. 本地构建与代码准备

在部署之前，确保你的项目可以在本地成功构建。

```bash
# 进入客户端目录
cd client

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

构建成功后，Next.js 会生成一个 `.next` 文件夹，其中包含生产环境所需的优化代码。

---

## 2. 服务器环境配置

你需要确保云服务器上安装了以下工具：

- **Node.js** (推荐 v18+)
- **pnpm** (或 npm/yarn)
- **PM2** (进程守护管理器，防止服务挂掉)

```bash
# 安装 PM2
npm install -g pm2
```

---

## 3. 手动部署步骤

### 第一步：同步代码

将项目代码上传到服务器。你可以使用 `git clone`，或者使用 `rsync`/`scp` 传输关键文件：

- `package.json` & `pnpm-lock.yaml`
- `.next/` (构建后的文件夹)
- `public/` (静态资源)
- `next.config.js` (或 `.mjs`)

### 第二步：安装生产环境依赖

在服务器上的项目目录执行：

```bash
pnpm install --prod
```

### 第三步：使用 PM2 启动服务

在服务器的项目根目录下，使用 PM2 启动 Next.js：

```bash
# 启动并命名为 'e-commerce'
pm2 start pnpm --name "e-commerce" -- start
```

### 第四步：PM2 常用命令

- `pm2 status`: 查看运行状态
- `pm2 logs`: 查看实时日志
- `pm2 restart e-commerce`: 重启服务
- `pm2 stop e-commerce`: 停止服务

---

## 4. Nginx 反向代理与 HTTPS 配置 (推荐)

### 4.1 基础反向代理 (80 端口)

通常不直接暴露 Node.js 的 3000 端口，而是通过 Nginx 进行转发：

```nginx
server {
    listen 80;
    server_name yourdomain.com; # 你的域名或 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.2 配置 SSL 证书 (HTTPS)

#### 方案一：使用 Certbot (推荐，自动、免费)

如果你有域名，推荐使用 **Let's Encrypt**。

1. **安装 Certbot**:

   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx # Ubuntu/Debian
   ```

2. **自动获取并配置证书**:

   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

   该命令会自动在 Nginx 配置中添加 SSL 证书路径，并设置 80 端口自动跳转 HTTPS。

3. **自动续期测试**:
   ```bash
   sudo certbot renew --dry-run
   ```

#### 方案二：手动配置已有证书 (阿里云/腾讯云购买)

如果你已经有了 `.crt` (或 `.pem`) 和 `.key` 文件：

1. **上传文件**: 将证书文件上传到服务器（例如 `/etc/nginx/ssl/`）。

2. **配置示例**:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri; # 强制跳转 HTTPS
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/nginx/ssl/your_cert.pem;
    ssl_certificate_key /etc/nginx/ssl/your_cert.key;

    # SSL 优化
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **生效配置**:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 5. 常见问题

- **环境变量**: 确保服务器上有 `.env.production` 文件，或者设置系统环境变量。
- **端口冲突**: PM2 启动时可通过 `-p` 指定端口：`pm2 start pnpm --name "e-commerce" -- start -- -p 4000`。
- **防火墙**: 务必在云服务器后台（如安全组）开放 **80 (HTTP)** 和 **443 (HTTPS)** 端口。
- **自动启动**: 执行 `pm2 save && pm2 startup` 确保服务器重启后自动恢复。
