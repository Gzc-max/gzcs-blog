# 博客部署指南 - 让博客在外网访问

## 🚀 方案一：Vercel 部署（推荐 ⭐⭐⭐⭐⭐）

### 为什么选择 Vercel？
- ✅ **完全免费**，无需信用卡
- ✅ **零配置**，自动识别 Vue/Vite 项目
- ✅ **全球 CDN**，访问速度快
- ✅ **自动 HTTPS**，安全可靠
- ✅ **自动部署**，推送代码自动更新
- ✅ **提供域名**，如：your-blog.vercel.app
- ✅ **支持绑定自己的域名**

### 步骤 1：准备工作

#### 1.1 将代码推送到 GitHub

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 创建 GitHub 仓库后，关联远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送
git push -u origin main
```

### 步骤 2：部署到 Vercel

#### 方式 A：网页部署（最简单）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 点击 "Sign Up" 注册（建议使用 GitHub 账号登录）

2. **导入项目**
   - 登录后点击 "Add New" → "Project"
   - 选择 "Import Git Repository"
   - 授权访问你的 GitHub
   - 选择你的博客项目仓库

3. **配置项目**
   - **Project Name**: 输入项目名称（如：my-blog）
   - **Framework Preset**: 自动识别为 Vite
   - **Build Command**: `npm run build`（自动填写）
   - **Output Directory**: `dist`（自动填写）
   - 点击 "Deploy"

4. **等待部署**
   - 等待 1-2 分钟
   - 部署成功后会得到一个网址，如：`https://my-blog.vercel.app`

5. **访问你的博客**
   - 点击提供的网址即可访问
   - 这个网址可以在全球任何地方访问！

#### 方式 B：命令行部署（更快）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署（在项目根目录执行）
vercel

# 4. 首次部署会询问一些问题，全部按回车使用默认值即可

# 5. 后续更新只需再次运行
vercel --prod
```

### 步骤 3：自动部署（可选但推荐）

通过 Vercel 网页部署后，每次你推送代码到 GitHub，Vercel 会**自动重新部署**！

```bash
# 修改代码后
git add .
git commit -m "更新内容"
git push

# Vercel 会自动检测并重新部署，无需手动操作！
```

### 步骤 4：绑定自定义域名（可选）

如果你有自己的域名（如：www.yourblog.com）：

1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的域名
3. 按照提示在你的域名服务商处添加 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

---

## 🌐 方案二：Netlify 部署（同样推荐）

### 特点
- 和 Vercel 类似，完全免费
- 界面更友好
- 功能更多（表单处理、函数等）

### 步骤

#### 方式 A：网页部署

1. **访问 Netlify**
   - 打开 https://www.netlify.com
   - 点击 "Sign Up" 注册

2. **导入项目**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "GitHub"
   - 授权并选择你的仓库

3. **配置构建**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - 点击 "Deploy site"

4. **访问**
   - 得到网址如：`https://your-blog.netlify.app`

#### 方式 B：拖拽部署（最简单但不推荐）

```bash
# 1. 本地构建
npm run build

# 2. 直接拖拽 dist 文件夹到 Netlify 网页
# 访问 https://app.netlify.com/drop
# 拖拽 dist 文件夹即可
```

---

## 📄 方案三：GitHub Pages 部署（免费但稍慢）

### 优点
- 完全免费
- 和 GitHub 集成紧密
- 稳定可靠

### 缺点
- 国内访问较慢
- 需要一些配置

### 步骤

#### 3.1 创建部署脚本

创建 `deploy.sh` 文件（项目根目录）：

```bash
#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
npm run build

# 进入构建文件夹
cd dist

# 初始化 git
git init
git add -A
git commit -m 'deploy'

# 推送到 GitHub Pages
# 替换为你的仓库地址
git push -f git@github.com:你的用户名/你的仓库名.git main:gh-pages

cd -
```

#### 3.2 修改 Vite 配置

编辑 `vite.config.js`，添加 base：

```javascript
export default defineConfig({
  base: '/你的仓库名/',  // 仓库名
  // ... 其他配置
})
```

#### 3.3 部署

```bash
# Windows PowerShell
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/你的用户名/你的仓库名.git main:gh-pages

# 或使用 Git Bash 运行
sh deploy.sh
```

#### 3.4 配置 GitHub Pages

1. 进入 GitHub 仓库设置
2. 找到 "Pages" 选项
3. Source 选择 "gh-pages" 分支
4. 保存后等待几分钟
5. 访问 `https://你的用户名.github.io/你的仓库名/`

---

## 🖥️ 方案四：自己的云服务器（适合有服务器的情况）

### 适用场景
- 你有自己的云服务器（阿里云、腾讯云等）
- 需要更多控制权
- 需要运行后端服务

### 步骤

#### 4.1 构建项目

```bash
npm run build
```

#### 4.2 上传到服务器

```bash
# 使用 SCP 上传
scp -r dist/* root@your-server-ip:/var/www/html/blog/

# 或使用 FTP 工具（如 FileZilla）上传
```

#### 4.3 配置 Nginx

创建 `/etc/nginx/sites-available/blog` 文件：

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # 你的域名
    
    root /var/www/html/blog;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4.4 配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com
```

---

## 🎯 推荐流程

### 如果你是新手
**推荐：Vercel 网页部署**

1. 把代码推送到 GitHub（5 分钟）
2. 在 Vercel 网站点几下鼠标（2 分钟）
3. 等待部署完成（2 分钟）
4. ✅ 完成！得到可访问的网址

**总耗时：不到 10 分钟**

### 如果你想要更快速度
**推荐：Vercel + 自定义域名**

中国用户可以使用 Vercel + 国内域名，速度会更快。

---

## 📱 访问你的博客

部署成功后，你会得到一个网址，例如：
- Vercel: `https://my-blog.vercel.app`
- Netlify: `https://my-blog.netlify.app`
- GitHub Pages: `https://username.github.io/repo-name/`

这个网址可以：
- ✅ 在任何地方访问
- ✅ 分享给朋友
- ✅ 放到简历上
- ✅ 在手机上打开

---

## 🔍 常见问题

### Q1: 部署后样式丢失？
**A:** 检查 `vite.config.js` 中的 `base` 配置是否正确。

### Q2: 路由跳转后刷新 404？
**A:** 这是 SPA 路由问题，Vercel/Netlify 会自动处理。如果是自己服务器，需要配置 nginx 的 `try_files`。

### Q3: 国内访问慢？
**A:** 
- 使用国内 CDN
- 或者部署到国内云服务器
- 或者使用 Cloudflare CDN

### Q4: 免费版有限制吗？
**A:** Vercel/Netlify 免费版对个人博客完全够用：
- Vercel: 100GB 带宽/月
- Netlify: 100GB 带宽/月，300 分钟构建时间/月

---

## 🎉 下一步

部署后，你可以：

1. **分享你的博客**
   - 发朋友圈、微博
   - 放到简历上
   - 提交到各大博客聚合网站

2. **绑定域名**
   - 购买域名（阿里云、腾讯云等，约 50 元/年）
   - 在 Vercel 中绑定
   - 更专业的博客地址

3. **持续更新**
   - 写新文章
   - 推送到 GitHub
   - 自动部署更新

---

## 💡 我的建议

**立即开始：**
1. 把代码推送到 GitHub
2. 用 Vercel 部署（不到 10 分钟）
3. 得到可访问的博客网址
4. 分享给朋友看看！

**需要我帮你操作吗？** 我可以帮你：
- 创建 GitHub 仓库配置
- 生成部署脚本
- 优化构建配置
