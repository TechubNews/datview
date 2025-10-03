DAT View - 加密资产财库监控仪表盘
欢迎来到 DAT View 项目！这是一个用于监控和分析加密资产财库的仪表盘应用。

✨ 项目简介
DAT View 旨在为用户提供一个安全、实时、界面友好的资产追踪和数据可视化平台。本项目代码库包含了完整的全栈实现，涵盖了从用户认证到数据展示的各个方面。

🚀 技术栈
后端:

框架: NestJS

数据库: PostgreSQL (通过 TypeORM 连接)

认证: JWT (Access/Refresh Tokens), Argon2 密码哈希, HttpOnly Cookies

前端:

框架: React (使用 Vite 构建)

UI库: shadcn/ui & Tailwind CSS

表单: React Hook Form & Zod

状态管理: Zustand

数据请求: TanStack Query & Axios

部署与环境:

Docker & Docker Compose

🔧 本地开发环境配置
详细的从零开始的配置步骤，请参考 dat-view-setup-guide.md。

环境变量
项目依赖 .env 文件来配置关键信息。请在 backend 目录下创建 .env 文件，并参考 .env.example 填写数据库连接信息和 JWT 密钥。

🏃‍♂️ 启动项目
我们推荐使用 Docker Compose 来一键启动整个开发环境。

确保 Docker 正在运行。

选择数据库方案：在 backend/.env 文件中配置好您的数据库连接信息（本地 Docker 或 Supabase）。

启动服务：

如果使用本地 Docker 数据库：在项目根目录运行 docker-compose up --build。

如果使用 Supabase 数据库：在项目根目录运行 docker-compose up --build api client (省略 db 服务)。

等待所有服务构建并启动。

服务访问地址:

前端应用: 打开浏览器访问 http://localhost:5173

后端 API: API 服务运行在 http://localhost:3000