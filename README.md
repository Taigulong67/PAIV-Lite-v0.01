# PAIV-Lite-v0.01

> Personal AI Identity & Values Protocol - Lite Version v0.01
> 
> 从对话样本中提取个人 AI 特征，生成 Gemini/Claude 可用的 System Prompt

[![Deploy on Vercel](https://img.shields.io/badge/Vercel-Deployed-success?style=flat&logo=vercel)](https://vercel.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat&logo=github)](https://github.com/taigulong67/PAIV-Lite-v0.01)

---

## 🌐 在线访问

**Vercel部署**: https://vercel.com/taigulong67s-projects/paiv-lite-v0.01

无需安装，直接在浏览器中使用！

---

## 🚀 快速开始

### 开发模式

```bash
# 1. 启动后端
cd backend
npm install
npm run dev

# 2. 启动前端（新终端）
cd frontend
npm install
npm run dev

# 3. 访问 http://localhost:5173
```

### 生产构建

```bash
cd frontend
npm run build
```

## 📋 功能特性

- ✅ **对话样本分析**：自动提取语调、沟通风格、专业领域
- ✅ **System Prompt 生成**：基于 PAIV Protocol 标准格式
- ✅ **多平台支持**：生成 Gemini/Claude 兼容的 Prompt
- ✅ **一键复制/下载**：方便应用到其他 AI 平台

## 🏗️ 技术架构

```
PAIV-Lite-v0.01/
├── frontend/          # React + Vite 前端
│   ├── src/
│   │   ├── components/
│   │   │   └── PromptConverter.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── backend/           # Express API 服务
│   ├── server.js
│   └── package.json
└── docs/             # 项目文档
```

## 🎯 使用流程

1. **选择输入方式**
   - 使用内置示例对话（太古龙67风格）
   - 粘贴自己的对话记录

2. **设置助手名称**
   - 例如：太古龙67、PAIV Assistant

3. **点击生成**
   - 系统自动分析对话特征
   - 生成标准化 System Prompt

4. **应用到目标平台**
   - 复制 Prompt 到 Gemini/Claude
   - 或下载为 .txt 文件

## 📝 Prompt 结构

生成的 System Prompt 包含：

```markdown
# System Prompt for {Name}

## 身份定位
## 核心特征（语调/风格/领域）
## 行为准则
## 记忆与上下文
## 安全与隐私
```

## 🔮 后续规划

- [ ] 支持更多对话格式导入（JSON/CSV）
- [ ] 更智能的特征提取算法
- [ ] 实时预览效果
- [ ] 社区 Prompt 模板库

## 📄 许可证

基于 PAIV Protocol，CC0 开源

---
*Built with ❤️ by 太古龙67*
