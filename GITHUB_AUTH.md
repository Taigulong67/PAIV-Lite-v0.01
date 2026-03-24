# GitHub 认证指南（方式2：浏览器登录）

## 步骤

### 1. 确保浏览器已登录GitHub
打开浏览器访问 https://github.com/Taigulong67/PAIV-Lite-v0.01
确认右上角显示你的头像（已登录状态）

### 2. 配置Git使用浏览器认证
在PowerShell中运行以下命令：

```powershell
# 设置Git使用Git Credential Manager
git config --global credential.helper manager

# 或者如果使用GitHub Desktop安装的Git，运行：
git config --global credential.helper manager-core
```

### 3. 重新推送
```bash
cd projects/PAIV-Lite
git push -u origin master
```

这次应该会弹出一个浏览器窗口让你授权，点击"Authorize"即可。

---

## 备选方案：如果浏览器授权失败

运行以下命令切换凭证管理方式：

```powershell
# 使用缓存模式（临时存储凭证）
git config --global credential.helper cache

# 然后再次推送
cd projects/PAIV-Lite
git push -u origin master
```

这时会提示输入用户名和密码：
- **用户名**: `Taigulong67`
- **密码**: 需要创建一个 Personal Access Token

---

## 创建 Personal Access Token（如需）

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. **Note**: PAIV-Lite Push
4. **Expiration**: 30 days（或你选）
5. **Scopes**: 勾选 ✅ `repo`
6. 点击 **Generate token**
7. **立即复制token**（只显示一次）
8. 在密码提示处粘贴这个token
