# GitHub 仓库迁移指南

> 从 `ningzhou2006/PAIV-Lite` 迁移到 `taigulong67/PAIV-Lite-v0.01`

---

## 📋 迁移步骤

### 步骤 1: 在 GitHub 创建新仓库

1. 登录 GitHub 账号 `taigulong67`
2. 访问 https://github.com/new
3. 填写仓库信息：
   - **Repository name**: `PAIV-Lite-v0.01`
   - **Description**: `Personal AI Identity & Values Protocol - Lite Version v0.01`
   - **Visibility**: Public（或 Private，根据需求）
   - **Initialize**: ❌ 不勾选 "Add a README"
4. 点击 **Create repository**

### 步骤 2: 更新本地仓库 Remote

在本地项目目录执行：

```bash
cd projects/PAIV-Lite

# 查看当前 remote
git remote -v

# 移除旧 remote
git remote remove origin

# 添加新 remote（使用 HTTPS）
git remote add origin https://github.com/taigulong67/PAIV-Lite-v0.01.git

# 验证
git remote -v
```

### 步骤 3: 推送代码到新仓库

```bash
# 添加所有更改（包括版本号更新）
git add -A
git commit -m "chore: rename to PAIV-Lite-v0.01, update to taigulong67 org"

# 推送到新仓库
git push -u origin main
```

### 步骤 4: 更新 Vercel 项目（可选）

如果需要在 Vercel 上更新：

1. 登录 Vercel 账号
2. 找到项目 `paiv-lite`
3. 进入 **Settings** → **Git**
4. 点击 **Disconnect** 断开当前 GitHub 连接
5. 重新连接，选择 `taigulong67/PAIV-Lite-v0.01`
6. 或直接在 Vercel 创建新项目关联新仓库

### 步骤 5: 归档旧仓库（可选）

1. 登录 `ningzhou2006` 账号
2. 进入 `PAIV-Lite` 仓库
3. **Settings** → 拉到最下方 **Danger Zone**
4. 选择 **Archive this repository**（推荐，保留历史）
5. 或选择 **Delete this repository**（彻底删除）

---

## ⚠️ 注意事项

1. **GitHub Pages**: 如果使用了 GitHub Pages，需要重新配置
2. **Issues/PRs**: 旧仓库的 Issues 和 PR 不会自动迁移
3. **Stars/Forks**: 新仓库的 star 和 fork 数会从 0 开始
4. **Webhooks**: Vercel 等外部服务的 webhook 需要重新配置

---

## ✅ 验证清单

- [ ] 新仓库 `taigulong67/PAIV-Lite-v0.01` 已创建
- [ ] 本地 remote 已更新为新的仓库地址
- [ ] 代码已推送到新仓库
- [ ] README 中的链接已更新
- [ ] Vercel 部署已重新配置（如需要）
- [ ] 旧仓库已归档或删除

---

*迁移时间: 2026-03-24*
*原因: 个人账户 ningzhou2006 改为组织账户 taigulong67 对外*
