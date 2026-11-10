# 学生信息管理后台（求职用项目）

一个用 Vue 3 + Vite + Element Plus + json-server 写的 CRUD 管理后台，用来在简历上证明：
**能独立做出页面、能调接口、能增删改查、能部署上线。**

## 技术栈

- Vue 3（组合式 API，`<script setup>`）+ Vue Router 4
- Element Plus（表格、表单、弹窗、分页、消息提示）
- Axios（请求/响应拦截器）
- json-server（本地 REST 接口，零后端代码就能有真接口）

## 本地跑起来（3 步）

```bash
cd vue-student-admin
npm install          # 第一次装依赖
npm run api          # 终端 1：启动数据接口 http://localhost:3001
npm run dev          # 终端 2：启动页面 http://localhost:5173
```

浏览器打开 http://localhost:5173 ，用 `admin / 123456` 登录。

## 你的任务清单（按天做，每天 1–2 小时）

### 第 1 天：跑通 + 看代码

- [ ] `npm install` → `npm run api` → `npm run dev`，能看到登录页
- [ ] 登录后能看到学生列表（10 条数据、分页、搜索框）
- [ ] 用浏览器 F12 → Network 看 `GET /students` 请求长什么样
- [ ] `git init` + 第一次提交（后面每次提交都会出现在 GitHub 上，面试官会看）

### 第 2 天：登录 + 路由守卫

- [ ] 把 `Login.vue` 里的假登录改成查 `GET /users`（提示：json-server 支持 `?username=admin&password=123456`）
- [ ] 打开 `src/router/index.js` 里被注释掉的 `router.beforeEach`，实现"没 token 就回登录页"
- [ ] 验证：不登录直接访问 `/#/app/students` 会被弹回登录页

### 第 3 天：列表页（搜索 + 分页）

- [ ] 搜索框输入"张"，列表只剩姓张的；清空后恢复
- [ ] 切换每页 5/10/20 条、翻页都正常
- [ ] 给表格加"暂无数据"的友好提示（`empty-text`）
- [ ] 挑战项（可选）：改成分页由接口返回（json-server 的 `_page` / `_limit` 参数，总条数在响应头 `X-Total-Count` 里）

### 第 4 天：新增 / 编辑 / 删除（核心）

- [ ] 新增：点"新增学生"→ 填表 → 保存 → 列表出现新数据（`POST /students`）
- [ ] 编辑：点"编辑"→ 表单回填 → 保存 → 列表更新（`PUT /students/:id`）
- [ ] 删除：点"删除"→ 二次确认 → 列表移除（`DELETE /students/:id`）
- [ ] 补全校验规则：学号必填且为数字、手机号 11 位、姓名必填
- [ ] 保存按钮加 loading，防止重复提交

### 第 5 天：用 AI 工具写代码（这家公司最看重的一条）

- [ ] 装 Cursor 或 VS Code + Copilot 插件
- [ ] 至少用 AI 完成 3 件事，并把 prompt 记下来（面试要讲）：
  1. 让它解释一个你看不懂的报错
  2. 让它生成一个表格列配置或表单校验规则，你改到能用
  3. 让它帮你写 README 里的某一段
- [ ] 记录：哪次 AI 写错了、你怎么发现的、怎么改的（这是面试官最想听的）

### 第 6 天：部署到宝塔（顺手完成第二件事）

- [ ] `npm run build` 生成 `dist/`
- [ ] 阿里云/腾讯云轻量服务器装宝塔 → 新建站点 → 上传 `dist/` 里的文件
- [ ] 用 PM2 或宝塔的 Node 项目管理器把 json-server 跑起来（端口 3001）
- [ ] 配好反代/跨域，保证线上登录能查到数据
- [ ] 截图：登录页、列表页、服务器上的宝塔面板

### 第 7 天：写简历条目 + 准备面试

- [ ] 在 README 里补 3 张截图
- [ ] 把项目写进简历（模板见下）
- [ ] 做 3 道自测题：为什么用 Vue3 + Element Plus？分页怎么做的？遇到过最难的 bug 是什么、怎么定位的？

## 简历条目模板（做完再写，数字按实际情况改）

> **学生信息管理后台（个人项目）** 2026.11
> Vue 3 + Vite + Element Plus + Axios + json-server
> - 独立完成登录（表单校验 + token + 路由守卫）、学生列表（搜索、分页）、新增/编辑/删除（弹窗表单 + 二次确认 + 防重复提交）全流程；
> - 封装 Axios 请求/响应拦截器统一处理 token 与错误提示，页面代码与接口层分离；
> - 用 Cursor/Copilot 辅助生成表格与表单代码，通过优化提示词 + 人工审查完成调试；
> - 部署：`npm run build` 产物托管到宝塔 Nginx，json-server 用 PM2 常驻运行。

## 验收标准（做到这些才算完成）

- 登录 → 列表 → 增删改查全流程可用，刷新页面数据还在
- 表单校验、错误提示、删除二次确认都正常
- Git 提交 ≥ 15 次（有意义的提交信息，不是"update"）
- 线上可访问（发我公网地址即可）
- 能对着屏幕讲 5 分钟：为什么这么设计、遇到什么问题、怎么解决的

## 常见问题

- **页面报"网络异常"**：json-server 没启动，或端口不是 3001
- **npm install 很慢**：已经配了 npmmirror 镜像，正常；还慢就换 `npm i --registry=https://registry.npmmirror.com`
- **端口被占用**：`netstat -ano | findstr 3001` 找到 PID 后 kill
