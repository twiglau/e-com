# 配置

## return 301 https://$host$request_uri;

- 在 Nginx 配置中，这确实是一种非常标准且推荐的“标准写法”，但并不是唯一的写法。我们可以把它拆解开来看：

1. 拆解指令含义:

- return 301: 告诉浏览器这是一个“永久重定向”（Permanent Redirect）。
  - SEO 友好：权重会从 HTTP 转移到 HTTPS。
  - 浏览器缓存：浏览器下次会自动直接访问 HTTPS，不再请求 80 端口。
- $host: Nginx 的内置变量，代表用户访问的“域名”。（例如：example.com）
- $request_uri: 代表用户访问的“完整路径和参数”。（例如：/cart?step=2）
  > 合起来的意思就是： 不管用户访问这个域名的哪个页面，都原封不动地带到 HTTPS 的对应页面。

2. 还有其他写法吗？

- 虽然上面的写法最简洁高效，但你可能还会看到以下几种：
  A. 使用 rewrite (较老版本的写法)

```nginx
rewrite ^ https://$host$request_uri? permanent;
```

> 区别：return 指令处理速度比 rewrite 快，因为 rewrite 需要处理正则表达式。

B. 显式写死域名 (不推荐)

```nginx
return 301 https://example.com$request_uri;
```

C. 使用 308 重定向 (更现代)

```nginx
return 308 https://$host$request_uri;
```

> 区别：301 有时会将 POST 请求变为 GET 请求。308 则强制保证请求方法（POST 还是 POST）在跳转后保持不变。对于纯展示页面 301 够了，但对于复杂的 API 交互，308 更严谨。

## SSL 配置

```ngnix
ssl_session_timeout 1d;
ssl_session_cache shared:MozSSL:10m;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

- 这些配置是为了在保障安全性的同时，提升 HTTPS 的访问速度。HTTPS 的握手比 HTTP 耗时得多，所以这些优化非常重要。

1. ssl_session_timeout 1d;
   - 意思：设置 SSL 会话的超时时间为 1 天。
   - 作用：在这个时间内，如果同一个客户端再次访问你的网站，可以重用之前的连接参数，不需要重新进行完整的“握手”过程。这能显著降低首字节时间（TTFB）。

2. ssl_session_cache shared:MozSSL:10m;
   - 意思：设置一个名为 MozSSL 的共享缓存，大小为 10MB。
   - 作用：
     - shared：意味着所有 Nginx 的工作进程（Worker Process）都能共用这个缓存。
     - 10m：10兆字节。1MB 大约能存 4000 个会话，所以 10MB 能存 4 万个并发客户的连接信息。
     - 目的：让服务器“记住”之前的客户端，减少 CPU 计算压力。

3. ssl_protocols TLSv1.2 TLSv1.3;
   - 意思：指定允许使用的 TLS 协议版本。
   - 作用：
     - TLSv1.3 是目前最先进、最快、最安全的版本。
     - TLSv1.2 是目前最主流的版本，兼顾了旧版浏览器的兼容性。
     - 为什么优化？：我们主动禁用了陈旧且不安全的 TLSv1.0 和 TLSv1.1，防止黑客通过老旧协议漏洞发起攻击。

4. ssl_ciphers HIGH:!aNULL:!MD5;
   - 意思：指定加密套件（加密算法组合）的优先级。
   - 作用：
     - HIGH: 优先选择高强度加密算法。
     - !aNULL: 禁用不需要身份验证的算法（非常不安全）。
     - !MD5: 禁用 MD5 哈希算法（已被证明容易被破解，不安全）。
   - 目的：确保传输的数据无法被中间人窃听或篡改。

5. 总结：如果不写这些会怎样？

- 如果你不写这些优化：
  - 慢：每个请求可能都要重新握手，用户感觉网页加载卡顿。
  - 安全性低：服务器可能会降级去使用一些 20 年前的老旧加密协议，容易被安全扫描工具（如云服务器的安全报警）报出漏洞。
  - 建议： 除非你有极其特殊、非常古老的客户端（比如 15 年前的老手机）需要访问，否则这套配置是目前的“黄金比例”：兼顾安全与性能。

## location 配置详细解析

```nginx
location / {
    # 1. 转发请求的目标：将请求发送给本地的 3000 端口
    proxy_pass http://localhost:3000;

    # 2. 指定 HTTP 协议版本：1.1 支持长连接和 WebSocket，比默认的 1.0 更现代
    proxy_http_version 1.1;

    # 3. 开启 WebSocket 支持 (重要!)
    # 如果你的网站有实时功能（如 Next.js 的开发模式热更新、聊天室、通知）
    # 这两行必写，否则 WebSocket 会连接失败
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';

    # 4. 传递真实域名：把用户浏览器里输入的域名（$host）传给后台 Node.js
    # 否则后台程序拿到的域名可能会变成 "localhost"
    proxy_set_header Host $host;

    # 5. 绕过缓存：如果是 WebSocket 请求，不走 Nginx 缓存，保证实时性
    proxy_cache_bypass $http_upgrade;
}
```

## 更多常用配置

### 1. 开启 Gzip 压缩 (大幅提升加载速度)

Nginx 会自动压缩 HTML、CSS、JS 文件，浏览器下载时体积能减小 70%。

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_proxied any;
gzip_min_length 1000; # 只有大于 1kb 的文件才压缩
```

### 2. 限制上传文件大小

默认 Nginx 只允许上传 1MB 以内的文件。

```nginx
client_max_body_size 10M; # 允许最大 10MB 的上传
```

### 3. 设置静态资源缓存

对于图片、字体等不常变动的资源，让浏览器本地缓存，减少流量。

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
    expires 7d; # 浏览器缓存 7 天
    add_header Cache-Control "public, no-transform";
}
```

### 4. 增强安全响应头

防止点击劫持、XSS 攻击等。

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
```

### 5. 自定义错误页面

```nginx
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;
```
