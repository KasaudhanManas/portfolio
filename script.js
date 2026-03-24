// ===== CURSOR =====
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

// ===== TYPING ANIMATION =====
const words = ['Full Stack Developer', 'Problem Solver', 'Open Source Contributor'];
let wi = 0, ci = 0, deleting = false;
const el = document.getElementById('typed-text');
function type() {
  const w = words[wi];
  if (!deleting) {
    el.textContent = w.slice(0, ++ci);
    if (ci === w.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = w.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, deleting ? 40 : 80);
}
type();

// ===== CANVAS HERO ANIMATION =====
(function() {
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], connections = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize(); window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,245,196' : '124,106,255';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  let mx2 = w / 2, my2 = h / 2;
  canvas.addEventListener('mousemove', e => { mx2 = e.offsetX; my2 = e.offsetY; });

  function loop() {
    ctx.clearRect(0, 0, w, h);
    // Dark gradient bg
    const grd = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.5, h * 0.5, w * 0.8);
    grd.addColorStop(0, 'rgba(124,106,255,0.04)');
    grd.addColorStop(0.5, 'rgba(0,245,196,0.02)');
    grd.addColorStop(1, 'rgba(5,5,7,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => { p.update(); p.draw(); });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,196,${0.06 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Mouse interaction glow
    const mgrd = ctx.createRadialGradient(mx2, my2, 0, mx2, my2, 200);
    mgrd.addColorStop(0, 'rgba(0,245,196,0.04)');
    mgrd.addColorStop(1, 'rgba(0,245,196,0)');
    ctx.fillStyle = mgrd;
    ctx.fillRect(0, 0, w, h);

    requestAnimationFrame(loop);
  }
  loop();
})();

// ===== PROJECTS DATA =====
const projects = [
  {
    id: 1,
    title: 'AnatomyMaster',
    category: 'EdTech Platform',
    icon: '🫀',
    color: 'rgba(255,107,107,0.3)',
    desc: 'An interactive educational platform for learning human anatomy through dynamic SVG diagrams, quizzes, and guided walkthroughs.',
    features: ['Interactive SVG-based anatomy diagrams', 'Real-time quiz system with scoring', 'Responsive design for all devices'],
    tech: ['HTML', 'CSS', 'JavaScript', 'SVG'],
    github: 'https://github.com/manaskasaudhan/anatomymaster',
    live: 'anatomy-master.html'
  },
  {
    id: 2,
    title: 'SpendWise',
    category: 'Finance App',
    icon: '📊',
    color: 'rgba(0,245,196,0.3)',
    desc: 'A smart expense tracking app with real-time charts, category breakdowns, and persistent local storage to keep your finances in check.',
    features: ['Daily/monthly expense tracking', 'Interactive Chart.js visualizations', 'LocalStorage persistence'],
    tech: ['JavaScript', 'Chart.js', 'CSS3', 'LocalStorage'],
    github: 'https://github.com/manaskasaudhan/spendwise',
    live: 'spend-wise.html'
  },
  {
    id: 3,
    title: 'WeatherScope',
    category: 'Real-time App',
    icon: '🌤',
    color: 'rgba(124,106,255,0.3)',
    desc: 'A real-time weather forecast platform with geolocation support and a MongoDB caching layer that reduced external API calls by 60%.',
    features: ['Geolocation-based weather fetching', 'MongoDB caching (60% API reduction)', 'RESTful Node.js backend'],
    tech: ['React', 'Node.js', 'MongoDB', 'REST API'],
    github: 'https://github.com/manaskasaudhan/weatherscope',
    live: 'weather-scope.html'
  },
  {
    id: 4,
    title: 'ChatFlow',
    category: 'Real-time Chat',
    icon: '💬',
    color: 'rgba(255,200,0,0.3)',
    desc: 'A real-time messaging application built on Socket.io, featuring JWT authentication, persistent message storage, and live presence indicators.',
    features: ['Real-time messaging via Socket.io', 'JWT-based authentication', 'MongoDB message persistence'],
    tech: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
    github: 'https://github.com/manaskasaudhan/chatflow',
    live: 'chat-flow.html'
  }
];

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = projects.map(p => `
    <div class="project-card reveal">
      <div class="project-thumb">
        <div class="project-thumb-bg" style="background:radial-gradient(circle at 30% 50%, ${p.color}, transparent 70%)"></div>
        <div class="project-thumb-icon">${p.icon}</div>
        <div class="project-thumb-tag">${p.category}</div>
      </div>
      <div class="project-body">
        <div class="project-title">${p.title}</div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-features">
          ${p.features.map(f => `<div class="project-feature">${f}</div>`).join('')}
        </div>
        <div class="project-tech">
          ${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${p.github}" class="proj-link" target="_blank">GitHub</a>
          <a href="${p.live}" class="proj-link primary" target="_blank">Live Demo</a>
        </div>
      </div>
    </div>
  `).join('');
  observeReveal();
}

// ===== GITHUB CONTRIB GRID =====
function renderContrib() {
  const grid = document.getElementById('contrib-grid');
  const levels = ['', 'l1', 'l2', 'l3', 'l4'];
  // 52 weeks * 7 days
  for (let i = 0; i < 26 * 7; i++) {
    const r = Math.random();
    const lvl = r < 0.4 ? '' : r < 0.6 ? 'l1' : r < 0.75 ? 'l2' : r < 0.9 ? 'l3' : 'l4';
    const cell = document.createElement('div');
    cell.className = 'contrib-cell ' + lvl;
    grid.appendChild(cell);
  }
}
renderContrib();

// ===== SCROLL REVEAL =====
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}
renderProjects();
setTimeout(observeReveal, 100);

// ===== FORM =====
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1200);
}

// ===== RESUME =====
function downloadResume() {
  const a = document.createElement('a');
  a.href = '#';
  alert('Resume download would be triggered here. Connect your actual resume PDF link.');
}

// ===== ADMIN PANEL =====
function openAdmin() {
  document.getElementById('admin-overlay').classList.add('open');
  document.getElementById('admin-login').style.display = 'block';
  document.getElementById('admin-dashboard').classList.remove('visible');
}
function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
}
function adminLogin() {
  const u = document.getElementById('admin-user').value;
  const p = document.getElementById('admin-pass').value;
  if (u === 'admin' && p === 'admin123') {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').classList.add('visible');
    renderAdminProjects();
  } else {
    alert('Invalid credentials. Try admin / admin123');
  }
}
function renderAdminProjects() {
  const list = document.getElementById('admin-proj-list');
  list.innerHTML = projects.map(p => `
    <div class="admin-proj-row">
      <span>${p.icon} ${p.title}</span>
      <div class="admin-proj-actions">
        <button class="admin-btn" onclick="adminEdit(${p.id})">Edit</button>
        <button class="admin-btn danger" onclick="adminDelete(${p.id})">Delete</button>
      </div>
    </div>
  `).join('');
  document.getElementById('stat-count').textContent = projects.length;
}
function adminEdit(id) {
  alert(`Edit project #${id} — In a real app, this would open an edit form.`);
}
function adminDelete(id) {
  if (confirm('Delete this project?')) {
    const idx = projects.findIndex(p => p.id === id);
    if (idx > -1) { projects.splice(idx, 1); renderProjects(); renderAdminProjects(); }
  }
}
function adminAddProject() {
  const title = prompt('Project title:');
  if (title) {
    projects.push({ id: Date.now(), title, category: 'New', icon: '🚀', color: 'rgba(124,106,255,0.3)', desc: 'New project description.', features: ['Feature 1'], tech: ['Tech'], github: '#', live: '#' });
    renderProjects(); renderAdminProjects();
  }
}
document.getElementById('admin-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('admin-overlay')) closeAdmin();
});

// ===== PARALLAX HERO =====
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const hero = document.querySelector('.hero-content');
  if (hero) hero.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});

// Smooth nav shrink on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 80) nav.style.padding = '14px 60px';
  else nav.style.padding = '24px 60px';
});
