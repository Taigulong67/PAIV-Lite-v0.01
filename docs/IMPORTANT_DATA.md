# PAIV-Lite 重要数据存档

---

## 🔐 账号与访问信息

### GitHub
- **账号**: ningzhou2006
- **仓库**: https://github.com/ningzhou2006/PAIV-Lite
- **本地路径**: C:\Users\Administrator.DESKTOP-F4TK524\.openclaw-autoclaw\workspace\projects\PAIV-Lite

### Vercel
- **账号**: ningzhou2006
- **项目**: paiv-lite
- **管理后台**: https://vercel.com/ningzhou2006s-projects/paiv-lite
- **部署状态**: ✅ 成功

---

## 🌐 访问链接

| 环境 | URL | 状态 |
|------|-----|------|
| 本地前端 | http://localhost:5173 | 开发用 |
| 本地后端 | http://localhost:3001 | 开发用 |
| 生产环境 | (见Vercel Dashboard) | ✅ 在线 |

---

## 📦 技术依赖

### 前端依赖
```json
{
  "axios": "^1.x",
  "lucide-react": "^0.x",
  "react": "^18.x",
  "vite": "^5.x"
}
```

### 后端依赖
```json
{
  "express": "^5.x",
  "cors": "^2.x"
}
```

---

## 🔧 常用命令

### 开发模式
```bash
# 启动后端
cd backend
npm start

# 启动前端（新开终端）
cd frontend
npm run dev
```

### 生产构建
```bash
cd frontend
npm run build
```

### Git操作
```bash
# 查看状态
git status

# 提交更改
git add -A
git commit -m "描述"

# 推送
git push
```

---

## 📋 功能清单

### 已实现
- ✅ 示例对话选择
- ✅ 手动对话粘贴
- ✅ System Prompt生成
- ✅ 特征提取显示
- ✅ 一键复制功能
- ✅ 下载为TXT文件

### 待优化
- [ ] 更多对话样本
- [ ] 导入JSON/CSV
- [ ] Claude API测试
- [ ] 用户反馈收集

---

## 🎯 核心算法

### 特征提取规则

**语调分析**
- `👉` `✅` `❌` → directive
- `为什么` `？` → analytical
- `坦诚` `关键` → candid

**沟通风格**
- `✅` `❌` `👉` → visual_markers
- `阶段` `步骤` → structured
- `类比` `类似` → analogical
- `建议` `策略` → advisory

**专业领域**
- `商业化` `融资` `投资` → business_strategy
- `协议` `标准` `RFC` → protocol_design
- `产品` `用户` `MVP` → product_management

---

## 💾 备份位置

| 位置 | 说明 |
|------|------|
| **Workspace** | C:\Users\...\.openclaw-autoclaw\workspace\projects\PAIV-Lite |
| **桌面备份** | C:\Users\...\Desktop\PAIV-Project\第二部分 软件程序 |
| **GitHub** | https://github.com/ningzhou2006/PAIV-Lite |
| **Vercel** | 自动部署，持续集成 |

---

*存档日期: 2026-03-22*
*版本: v1.0.0*
