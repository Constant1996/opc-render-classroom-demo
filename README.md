# OPC Render 前后端测试

本项目由一个 Node.js HTTP Server 同时提供网页和 API，无第三方依赖、无需 AI Key。

## 本地运行

```sh
npm ci
npm start
```

访问 http://localhost:3000 。如果端口占用，使用 `PORT=3001 npm start`。

## Render 手动部署

1. 将整个目录提交到 GitHub 仓库，package.json 放在仓库根目录。
2. 登录 Render，选择 New → Web Service（不是 Static Site）。
3. 连接仓库，或选择 Public Git Repository 并粘贴公开仓库 URL。
4. Language: Node；Branch: main；Root Directory 留空。
5. Build Command: `npm ci`；Start Command: `npm start`。
6. Region 可选择 Singapore（如果控制台提供）；Instance Type 必须选择 Free。
7. Health Check Path: `/api/health`。创建服务，等待部署成功。
8. 打开 onrender.com 链接，测试项目卡片和服务器时间。
9. 手机通过移动网络再次测试公网地址。

也提供 render.yaml，但首次课堂实验建议手动配置，便于认识各字段。

## 接口

- GET /api/health：健康检查。
- GET /api/time：服务器时间、Node 版本和实例编号。
- POST /api/project：处理名称与简介，返回卡片和请求编号。

## 课堂模板规则

- 后端监听 `0.0.0.0`，端口来自 `process.env.PORT`。
- 前端用相对路径 `/api/...`，不要写死 localhost。
- API Key 只放 Render 环境变量，不放前端或 Git 仓库。
- 数据库和持久存储另行设计；此演示不保存项目数据。
- 免费 Web Service 闲置会休眠，不适合持续后台任务；Background Worker / Cron Job 是另一个服务类型，不能假定免费。

官方依据：https://render.com/docs/free 和 https://render.com/docs/web-services 。实际公网部署结果待记录。
