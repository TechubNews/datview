# --- Stage 1: Build ---
# 使用一个包含完整构建工具链的基础镜像
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 lockfile
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖，包括开发依赖
RUN pnpm install

# 复制所有源代码
COPY . .

# 运行构建命令
RUN pnpm run build

# --- Stage 2: Production ---
# 使用一个更轻量的镜像来运行生产环境
FROM node:18-alpine AS production

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 只复制生产环境需要的文件
COPY package.json pnpm-lock.yaml ./
# 只安装生产环境依赖，大大减小镜像体积
RUN pnpm install --prod

# 从 builder 阶段复制构建好的应用代码
COPY --from=builder /app/dist ./dist

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用的命令
CMD ["node", "dist/main"]
