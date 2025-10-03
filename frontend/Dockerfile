# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# 运行构建命令
RUN pnpm run build

# --- Stage 2: Production Server (using Nginx) ---
# 使用 Nginx 作为静态文件服务器，高效且安全
FROM nginx:stable-alpine

# 从 builder 阶段复制构建好的静态文件到 Nginx 的 web 根目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 可以复制一个自定义的 nginx 配置文件来处理路由问题（例如 SPA 的 history 模式）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 当容器启动时，Nginx 会自动启动并提供静态文件服务
CMD ["nginx", "-g", "daemon off;"]
