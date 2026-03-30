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

// ===== WEBGL HERO BACKGROUND (THREE.JS) =====
(function () {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 300;

  const obj = new THREE.Group();
  scene.add(obj);

  // 1) Outer Particle Sphere
  const geom = new THREE.BufferGeometry();
  const numParticles = 4000;
  const positions = new Float32Array(numParticles * 3);
  const colors = new Float32Array(numParticles * 3);

  for(let i = 0; i < numParticles; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 160 + Math.random() * 20;

    positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const texCanvas = document.createElement('canvas');
  texCanvas.width = 64; texCanvas.height = 64;
  const ctx = texCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(texCanvas);

  const mat = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    map: tex,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geom, mat);
  obj.add(particles);

  // 2) Inner wireframe structure
  const innerGeom = new THREE.IcosahedronGeometry(130, 2);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xb53cff,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const innerMesh = new THREE.Mesh(innerGeom, innerMat);
  obj.add(innerMesh);

  // === DYNAMIC THEME UPDATER FOR 3D MODEL ===
  function updateThreeTheme(theme) {
    const isLight = theme === 'light';
    const c1 = new THREE.Color(isLight ? '#ff8b7e' : '#00ffcc');
    const c2 = new THREE.Color(isLight ? '#ffb75e' : '#b53cff');
    innerMat.color.setHex(isLight ? 0xff8b7e : 0xb53cff);
    
    // Switch from AdditiveBlending to NormalBlending so particles don't vanish into light backgrounds
    mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    innerMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    mat.needsUpdate = true;
    innerMat.needsUpdate = true;

    const colAttr = geom.attributes.color;
    for(let i = 0; i < numParticles; i++) {
      const mixedColor = c1.clone().lerp(c2, Math.random());
      colAttr.setXYZ(i, mixedColor.r, mixedColor.g, mixedColor.b);
    }
    colAttr.needsUpdate = true;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.attributeName === 'data-theme') {
        updateThreeTheme(document.documentElement.getAttribute('data-theme'));
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });
  
  // Set initial
  updateThreeTheme(localStorage.getItem('theme') || 'dark');

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let scrollY = window.scrollY;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    windowHalfX = width / 2;
    windowHalfY = height / 2;
    
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Base rotation
    obj.rotation.y += 0.002;
    obj.rotation.x += 0.001;

    // Inertial mouse rotation addition
    obj.rotation.y += (targetX - obj.rotation.y) * 0.05;
    obj.rotation.x += (targetY - obj.rotation.x) * 0.05;

    // Parallax scroll movement (clamped to prevent free-fall)
    obj.position.y = Math.max(-scrollY * 0.05, -60);

    // Mild slow pulse of the innermesh
    const time = Date.now() * 0.001;
    innerMesh.scale.setScalar(1.0 + Math.sin(time * 1.5) * 0.03);

    renderer.render(scene, camera);
  }
  animate();
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
    live: 'https://kasaudhanmanas.github.io/human-anatomy/'
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
    live: 'https://kasaudhanmanas.github.io/spendwise-the-expense-tracker/'
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
    live: 'https://kasaudhanmanas.github.io/weather-forecast-platform/'
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
    live: 'https://kasaudhanmanas.github.io/chat-app/'
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

// ===== 3D TILT EFFECT ON CARDS =====
const tiltCards = document.querySelectorAll('.skill-tag, .project-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-5 to 5 degrees max, more aggressive for small tags)
    const rotX = ((y - centerY) / centerY) * (card.classList.contains('skill-tag') ? -15 : -5);
    const rotY = ((x - centerX) / centerX) * (card.classList.contains('skill-tag') ? 15 : 5);
    const scale = card.classList.contains('skill-tag') ? 1.15 : 1.02;
    
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    card.style.transition = 'none';
    card.style.zIndex = '100';
    if(card.classList.contains('skill-tag')) {
      card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.zIndex = '1';
    card.style.boxShadow = 'none';
  });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if(themeToggle) {
  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  if(!themeIcon) return;
  if (theme === 'light') {
    themeIcon.className = 'bx bxs-moon';
  } else {
    themeIcon.className = 'bx bxs-sun';
  }
}
