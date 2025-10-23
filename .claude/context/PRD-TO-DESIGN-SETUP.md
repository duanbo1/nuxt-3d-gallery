# PRD to Figma Design Automation - Setup Guide

> **自动化从 PRD 到 Figma 设计稿的完整工作流**

本指南将帮助您配置 PRD-to-Design 自动化流程，让 AI 智能生成基于开源设计系统的 Figma 设计稿。

---

## 📋 目录

1. [功能概述](#功能概述)
2. [前置要求](#前置要求)
3. [MCP 服务器配置](#mcp-服务器配置)
4. [环境变量设置](#环境变量设置)
5. [使用流程](#使用流程)
6. [故障排除](#故障排除)
7. [高级配置](#高级配置)

---

## 功能概述

### 工作流程

```
PRD 文档 (.claude/prds/*.md)
    ↓
/pm:prd-to-design 命令
    ↓
design-from-prd Agent
    ↓
├─ 分析 PRD UI 需求
├─ 搜索开源设计系统
│  ├─ Naive UI 组件 (项目当前 UI 库)
│  ├─ Figma Community 资源
│  └─ GitHub 开源设计文件
├─ 展示 3-5 个设计系统选项
├─ 用户选择偏好
└─ 自动生成 Figma 设计文件
    ↓
输出:
├─ Figma 文件链接 (可分享)
├─ 设计说明文档 (.claude/context/*-design-notes.md)
└─ 组件映射表 (PRD 需求 → Figma 组件)
```

### 核心功能

✅ **智能组件匹配**: 自动从开源设计库中找到匹配的 UI 组件
✅ **Naive UI 优先**: 优先匹配项目已使用的 Naive UI 组件
✅ **用户选择权**: AI 推荐多个设计系统，由您选择
✅ **记忆学习**: 记住您的设计偏好，下次更智能
✅ **完整设计**: 生成所有屏幕、原型和设计规范
✅ **开发者交接**: 自动生成设计文档供开发使用

---

## 前置要求

### 必需

1. **Figma 账号** (免费或付费)
   - 注册地址: https://www.figma.com/signup

2. **Figma Personal Access Token**
   - 获取地址: https://www.figma.com/developers/api#access-tokens
   - 权限要求: `File read`, `File write`

3. **Node.js** (v18+)
   - 检查版本: `node --version`

4. **GitHub Personal Access Token** (可选但推荐)
   - 获取地址: https://github.com/settings/tokens
   - 权限要求: `repo` (读取公开仓库)

### 推荐

5. **Brave Search API Key** (可选)
   - 申请地址: https://brave.com/search/api/
   - 用途: 搜索 Figma Community 资源

---

## MCP 服务器配置

### 已配置的 MCP 服务器

您的项目已经配置了以下 MCP 服务器 (`.mcp.json`):

| MCP 服务器 | 状态 | 用途 |
|-----------|------|------|
| **figma** | ✅ 已配置 | 创建/编辑 Figma 文件 (必需) |
| **github** | ✅ 已配置 | 搜索开源设计资源 (必需) |
| **brave-search** | ✅ 已配置 | 搜索 Figma Community (推荐) |
| **memory** | ✅ 已配置 | 记住设计偏好 (推荐) |
| **puppeteer** | ✅ 已配置 | 截图组件示例 (可选) |
| **sequential-thinking** | ✅ 已配置 | 复杂设计决策分析 (推荐) |

### 验证配置

运行以下命令检查配置:

```bash
# 检查 .mcp.json 是否包含所有服务器
cat .mcp.json | grep -E '"(figma|github|brave-search|memory|puppeteer)"'
```

---

## 环境变量设置

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件 (如果不存在):

```bash
touch .env
```

### 2. 添加必需的环境变量

编辑 `.env` 文件，添加以下内容:

```env
# ===== 必需配置 =====

# Figma Personal Access Token (必需)
# 获取地址: https://www.figma.com/developers/api#access-tokens
FIGMA_ACCESS_TOKEN=figd_your_figma_personal_access_token_here

# GitHub Personal Access Token (必需)
# 获取地址: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_github_personal_access_token_here


# ===== 推荐配置 =====

# Brave Search API Key (推荐 - 用于搜索 Figma Community)
# 获取地址: https://brave.com/search/api/
BRAVE_API_KEY=your_brave_api_key_here


# ===== 可选配置 =====

# 其他已有的环境变量 (保持不变)
# LINEAR_API_KEY=...
# SUPABASE_URL=...
# SENTRY_AUTH_TOKEN=...
```

### 3. 验证环境变量

```bash
# 检查 Figma token 是否设置
echo $FIGMA_ACCESS_TOKEN

# 检查 GitHub token 是否设置
echo $GITHUB_TOKEN

# 测试 Figma API 连接
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" https://api.figma.com/v1/me
```

预期输出:
```json
{"id":"123456","email":"your@email.com","handle":"YourName"}
```

如果返回 `401 Unauthorized`, 说明 token 无效或未设置。

---

## 使用流程

### 完整工作流示例

#### 第 1 步: 创建 PRD

```bash
# 使用 CCPM 创建 PRD
/pm:prd-new user-profile-page
```

跟随 AI 的提问，完成 PRD 编写。PRD 将保存到 `.claude/prds/user-profile-page.md`。

#### 第 2 步: 生成设计稿

```bash
# 自动生成 Figma 设计稿
/pm:prd-to-design user-profile-page
```

**AI 将执行以下操作**:

1. ✅ **验证配置**: 检查 Figma MCP 是否配置
2. ✅ **读取 PRD**: 分析 `.claude/prds/user-profile-page.md`
3. ✅ **提取 UI 需求**: 识别所有 UI 组件 (表单、按钮、卡片等)
4. ✅ **搜索设计系统**:
   - Naive UI 组件文档 (https://www.naiveui.com)
   - Figma Community 资源
   - GitHub 开源设计文件
5. ✅ **展示选项**: 推荐 3-5 个设计系统供您选择

   示例输出:
   ```
   我找到了以下设计系统，请选择您偏好的:

   1. **Ant Design Vue** (Figma Community)
      - 包含组件: 9/10 匹配
      - 风格: 现代、简洁
      - 许可: MIT
      - 预览: [显示截图]

   2. **Material Design 3** (官方)
      - 包含组件: 8/10 匹配
      - 风格: Google 风格
      - 许可: Apache 2.0
      - 预览: [显示截图]

   3. **Naive UI Design Kit** (社区贡献)
      - 包含组件: 10/10 匹配 (与项目 UI 库一致!)
      - 风格: 极简、优雅
      - 许可: MIT
      - 预览: [显示截图]

   您想使用哪个设计系统? (输入 1-3 或 "其他")
   ```

6. ✅ **生成 Figma 文件**:
   - 创建新的 Figma 文件
   - 导入选择的设计系统组件
   - 按照 PRD 组装所有页面
   - 添加交互原型链接
   - 生成设计规范注释

7. ✅ **输出结果**:
   ```
   ✅ 设计生成完成!

   📊 Figma 文件: https://figma.com/file/abc123/User-Profile-Page
   📄 设计文档: .claude/context/user-profile-page-design-notes.md

   设计系统: Naive UI Design Kit
   页面数: 3 (概览、编辑、设置)
   组件数: 15

   下一步:
   1. 在 Figma 中查看设计并提供反馈
   2. 测试交互原型
   3. 满意后运行: /pm:prd-parse user-profile-page 创建开发 Epic
   ```

#### 第 3 步: 查看设计文档

```bash
# 查看 AI 生成的设计说明
cat .claude/context/user-profile-page-design-notes.md
```

文档包含:
- Figma 文件链接
- 使用的设计系统来源
- PRD 需求 → Figma 组件映射表
- 自定义组件说明
- 设计决策记录
- 开发者交接规范

#### 第 4 步: 创建开发 Epic (可选)

满意设计后，创建开发任务:

```bash
/pm:prd-parse user-profile-page
```

---

## 故障排除

### 常见问题

#### ❌ "Figma MCP server is not configured"

**原因**: `.mcp.json` 中缺少 Figma 配置

**解决**:
1. 检查 `.mcp.json` 是否包含 `figma` 配置
2. 确认配置格式正确 (参考本文档 [MCP 服务器配置](#mcp-服务器配置))
3. 重启 Claude Code CLI

#### ❌ "401 Unauthorized" (Figma API)

**原因**: Figma token 无效或未设置

**解决**:
1. 验证 `.env` 文件中 `FIGMA_ACCESS_TOKEN` 已设置
2. 确认 token 有效:
   ```bash
   curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" https://api.figma.com/v1/me
   ```
3. 如果失效，重新生成 token: https://www.figma.com/developers/api#access-tokens

#### ❌ "PRD not found"

**原因**: 指定的 PRD 文件不存在

**解决**:
1. 列出所有 PRD:
   ```bash
   ls .claude/prds/
   ```
2. 使用正确的 PRD 名称 (不含 `.md` 扩展名):
   ```bash
   /pm:prd-to-design correct-prd-name
   ```

#### ⚠️ "No matching design systems found"

**原因**: AI 无法找到匹配的开源设计资源

**解决**:
1. 检查网络连接 (需要访问 Figma Community 和 GitHub)
2. 在 PRD 中添加更明确的 UI 组件描述
3. 手动指定设计系统名称 (未来功能)
4. 降级为手动设计 + AI 辅助

#### ⚠️ "MCP server timeout"

**原因**: MCP 服务器响应慢或网络问题

**解决**:
1. 检查网络连接
2. 重试命令
3. 如果持续失败，检查 MCP 服务器日志

---

## 高级配置

### 自定义设计偏好

AI 会通过 `memory` MCP 记住您的偏好。您可以主动告诉 AI:

```
我偏好以下设计风格:
- 极简主义，大量留白
- 使用柔和的色彩 (避免高对比)
- 优先使用 Naive UI 组件
- 避免使用 Material Design
```

AI 会记住这些偏好，下次自动应用。

### 查看记忆内容

```bash
# 查看 AI 记住的设计偏好 (如果 memory MCP 支持导出)
# 具体命令取决于 memory MCP 实现
```

### 清除设计偏好记忆

如果想重置偏好:

```
请忘记我之前的设计偏好，我想重新选择。
```

### 项目特定配置

如果您的项目有特定的设计系统或品牌指南，在 `.claude/context/` 中创建:

```markdown
# .claude/context/design-guidelines.md

## 品牌色彩
- 主色: #5B21B6 (紫色)
- 辅色: #10B981 (绿色)
- 背景: #F9FAFB (浅灰)

## 字体
- 标题: Inter Bold
- 正文: Inter Regular

## 组件偏好
- 按钮: 优先使用 Naive UI 的 Button 组件
- 表单: 使用 Naive UI Form + Input
- 卡片: 自定义卡片样式 (参考 xxx.fig)
```

AI 在生成设计时会读取这些指南。

---

## 完整示例: 3D 模型画廊

您的项目中已有一个完整的 PRD 示例: `3d-model-gallery.md`

### 运行示例

```bash
# 为现有的 3D 模型画廊 PRD 生成设计
/pm:prd-to-design 3d-model-gallery
```

### 预期输出

AI 会分析 PRD 中的 UI 需求:
- 3D 模型查看器 (自定义组件)
- 模型卡片网格布局
- 筛选/搜索面板
- 模型详情页
- 购物车功能

然后搜索匹配的设计系统，如:
- **Ant Design Vue** (有类似的卡片网格)
- **Naive UI** (项目 UI 库)
- **E-commerce UI Kit** (Figma Community)

您选择后，AI 会生成完整的设计文件。

---

## 下一步

设置完成后，您可以:

1. ✅ **测试流程**: 使用 `/pm:prd-to-design 3d-model-gallery` 测试
2. ✅ **创建新 PRD**: 使用 `/pm:prd-new your-feature` 开始新功能
3. ✅ **探索 CCPM**: 查看 `.claude/commands/pm/` 了解更多命令
4. ✅ **阅读文档**: 查看项目根目录的 CCPM 文档 (如果有)

---

## 获取帮助

如果遇到问题:

1. 查看本文档的 [故障排除](#故障排除) 部分
2. 检查 `.mcp.json` 配置
3. 验证环境变量 `.env`
4. 查看 MCP 服务器文档:
   - Figma MCP: https://github.com/modelcontextprotocol/servers/tree/main/src/figma
   - GitHub MCP: https://github.com/modelcontextprotocol/servers/tree/main/src/github

---

**祝您使用愉快!** 🎨✨

有了这个自动化流程，从 PRD 到设计稿的时间可以从几天缩短到几分钟。
