# Nuxt 全栈项目 Claude 工作流

**完整的端到端工作流：从用户故事到生产部署**

---

## 🎯 项目概述

这是一个配置了完整 Claude Code 工作流的 Nuxt 全栈项目,实现了从产品需求到设计、开发、测试、部署的全流程自动化协作。

### 核心特性

- ✅ **11个专业Agent角色** - 产品、设计、架构、开发、测试全覆盖
- ✅ **TDD驱动开发** - 测试先行,确保质量
- ✅ **4个审批节点** - 关键阶段人工审批
- ✅ **11个MCP集成** - Linear、Figma、Supabase、Playwright等
- ✅ **完整文档输出** - PRD、TSD、API规范、QA报告

---

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env` 文件:

```env
# GitHub (必需)
GITHUB_TOKEN=your_github_token

# Supabase (可选)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# 其他可选服务
LINEAR_API_KEY=your_linear_api_key
FIGMA_ACCESS_TOKEN=your_figma_token
SENTRY_AUTH_TOKEN=your_sentry_token
CONTEXT7_API_KEY=your_context7_key
```

### 3. 启动工作流

在 Claude Code 中运行:

```bash
/workflow-start
```

### 4. 提供用户故事

示例:

```
用户故事:
作为一个电商用户,
我想要将商品添加到心愿单,
以便我可以稍后购买而无需重新搜索。

验收标准:
- 用户可以一键添加/移除心愿单商品
- 心愿单在会话间持久化
- 用户可以将心愿单商品移至购物车
```

---

## 📋 工作流程

```
用户故事
    ↓
产品需求 (PRD) → 🛑 审批1
    ↓
UI/UX设计 → 🛑 审批2
    ↓
技术架构 (TSD) → 🛑 审批3
    ↓
TDD测试编写 (失败的测试)
    ↓
并行开发 (前端+后端)
    ↓
质量保障 (测试+代码审查)
    ↓
生产部署 → 🛑 审批4
    ↓
✅ 功能上线
```

### 审批命令

- `/approval-design` - 审批设计稿
- `/approval-architecture` - 审批技术架构
- `/approval-deploy` - 审批生产部署

---

## 👥 Agent角色

### 产品规划层
- **product-manager** - 需求分析、PRD编写
- **business-analyst** - 可行性分析、ROI评估

### 设计层
- **ui-ux-designer** - UI/UX设计
- **ui-visual-validator** - 视觉验证、无障碍审计

### 架构层
- **solution-architect** - 技术架构设计
- **database-architect** - 数据建模、API设计

### 开发层
- **frontend-developer** - Vue/Nuxt组件开发
- **backend-developer** - Nitro API开发
- **typescript-pro** - 类型系统设计

### 质量保障层
- **test-engineer** - TDD/BDD测试
- **code-reviewer** - 代码审查、安全扫描

---

## 🔌 MCP集成

### HTTP服务器 (外部API)
- **linear** - 需求和任务管理
- **github** - 代码仓库和问题管理
- **figma** - 设计稿和设计token
- **supabase** - PostgreSQL数据库
- **sentry** - 错误追踪和监控
- **context7** - 技术文档和知识库

### Stdio服务器 (本地工具)
- **desktop-commander** - 桌面自动化
- **spec-workflow-mcp** - 规范和工作流管理
- **shrimp-task-manager** - 任务分解
- **sequential-thinking** - 结构化问题分析
- **playwright** - E2E测试和浏览器自动化

---

## 📁 项目结构

```
nuxt-test/
├── .claude/
│   ├── agents/          # 11个agent定义
│   ├── commands/        # 工作流命令 (/workflow-start, /approval-*)
│   └── workflows/       # 工作流文档
├── .mcp.json           # MCP服务器配置
├── docs/               # 自动生成的文档
│   ├── prd/            # 产品需求文档
│   ├── design/         # 设计规范
│   ├── architecture/   # 技术方案文档
│   ├── database/       # 数据库设计
│   ├── api/            # API规范
│   └── qa/             # QA报告
├── tests/              # 测试套件
│   ├── unit/           # 单元测试
│   ├── integration/    # 集成测试
│   └── e2e/            # E2E测试
├── app/                # Nuxt应用
└── server/             # Nitro服务器
```

---

## 🎯 工作流优势

### 1. TDD驱动
- 先写测试,后写实现
- 确保100%覆盖验收标准
- 防止回归和bug

### 2. 多角色协作
- 11个专业角色各司其职
- 并行工作提高效率
- 自动化质量检查

### 3. 人工审批
- 4个关键审批节点
- 你掌控所有重大决策
- 透明的进度追踪

### 4. 完整文档
- PRD、TSD、API规范全覆盖
- QA报告和部署计划
- 架构决策记录(ADR)

---

## 💡 最佳实践

1. **清晰的用户故事** - 明确问题和验收标准
2. **早期审批** - 在每个阶段获取确认
3. **测试先行** - 始终先写测试再实现
4. **并行开发** - 前后端同时开发
5. **持续验证** - 全程进行视觉回归和无障碍测试
6. **主动监控** - 部署后24小时监控生产指标

---

## 🛠️ 常规开发命令

### 开发服务器

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
pnpm preview
```

### 测试

```bash
# 单元测试
pnpm test

# E2E测试
pnpm test:e2e

# 测试覆盖率
pnpm test:coverage
```

---

## 📚 更多资源

- [Nuxt 文档](https://nuxt.com/docs)
- [Claude Code 工作流文档](./.claude/workflows/full-stack-workflow.md)
- [MCP 配置说明](./.mcp.json)

---

## 🤝 贡献

这个工作流是为团队协作设计的。如果你想改进工作流:

1. 编辑 `.claude/agents/` 中的agent定义
2. 修改 `.claude/workflows/full-stack-workflow.md`
3. 更新审批命令在 `.claude/commands/`

---

## 📄 许可证

MIT

---

**开始使用工作流**: 运行 `/workflow-start` 🚀
