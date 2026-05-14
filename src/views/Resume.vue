<template>
  <div class="resume-page">
    <div class="container">
      <h1 class="page-title">简历</h1>

      <section class="resume-section">
        <h2>基本信息</h2>
        <div class="info-grid">
          <span class="info-label">姓名</span><span>GZC</span>
          <span class="info-label">职位</span><span>前端工程师</span>
          <span class="info-label">邮箱</span><span>your@email.com</span>
        </div>
      </section>

      <section class="resume-section">
        <h2>工作经历</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">2022 - 至今</div>
            <div class="timeline-content">
              <h3>前端工程师 · 某公司</h3>
              <ul>
                <li>负责公司核心产品的前端架构设计与开发</li>
                <li>使用 Vue 3 + TypeScript 重构 legacy 系统</li>
                <li>推动团队前端工程化，搭建 CI/CD 流程</li>
              </ul>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">2020 - 2022</div>
            <div class="timeline-content">
              <h3>前端开发 · 某公司</h3>
              <ul>
                <li>参与多个 ToB 产品的前端开发</li>
                <li>负责组件库建设与维护</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="resume-section">
        <h2>项目经历</h2>
        <div class="project-list">
          <div class="project-item">
            <h3>个人博客</h3>
            <p class="project-tech">Vue 3 · TypeScript · Vite · Markdown</p>
            <p>使用 Vue 3 + Vite + TypeScript 构建的静态博客，支持 Markdown 文章渲染、标签分类筛选、暗色模式等。</p>
          </div>
          <div class="project-item">
            <h3>后台管理系统</h3>
            <p class="project-tech">Vue 3 · TypeScript · Ant Design Vue</p>
            <p>基于 vben-admin 模板的企业级后台管理系统，包含权限管理、数据可视化等模块。</p>
          </div>
        </div>
      </section>

      <section class="resume-section">
        <h2>技能</h2>
        <div class="skills-grid">
          <div class="skill-item">
            <span class="skill-name">Vue / React</span>
            <div class="skill-bar"><div class="skill-fill" style="width: 90%"></div></div>
          </div>
          <div class="skill-item">
            <span class="skill-name">TypeScript</span>
            <div class="skill-bar"><div class="skill-fill" style="width: 85%"></div></div>
          </div>
          <div class="skill-item">
            <span class="skill-name">CSS / Tailwind</span>
            <div class="skill-bar"><div class="skill-fill" style="width: 80%"></div></div>
          </div>
          <div class="skill-item">
            <span class="skill-name">Node.js</span>
            <div class="skill-bar"><div class="skill-fill" style="width: 70%"></div></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.resume-page {
  padding: 48px 0 60px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 40px;
}

.resume-section {
  margin-bottom: 40px;
}

.resume-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.info-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px 16px;
  font-size: 0.95rem;
}

.info-label {
  color: var(--text-tertiary);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  display: flex;
  gap: 20px;
}

.timeline-date {
  flex-shrink: 0;
  width: 100px;
  font-size: 0.85rem;
  color: var(--text-tertiary);
  padding-top: 2px;
}

.timeline-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.timeline-content ul {
  margin: 0;
  padding-left: 18px;
}

.timeline-content li {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 4px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-item h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.project-tech {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}

.project-item > p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.skill-name {
  width: 100px;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.skill-bar {
  flex: 1;
  height: 6px;
  background: var(--tag-bg);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
}

@media (max-width: 640px) {
  .resume-page {
    padding: 32px 0 40px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .timeline-item {
    flex-direction: column;
    gap: 4px;
  }

  .timeline-date {
    width: auto;
  }

  .info-grid {
    grid-template-columns: 80px 1fr;
  }

  .skill-name {
    width: 80px;
    font-size: 0.85rem;
  }
}
</style>
