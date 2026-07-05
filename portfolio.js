// ---------- data: extend this array any time a new cert/program starts or finishes ----------
const growthLog = [
  { title:"AWS Student Builder Group Leader", org:"Amazon Web Services", status:"active" },
  { title:"AWS AI/ML Nanodegree", org:"Udacity — AI Practitioner Challenge completed", status:"done" },
  { title:"KPMG Audit & Assurance Simulation", org:"Forage", status:"done" },
  { title:"Wells Fargo Software Engineering Simulation", org:"Forage", status:"done" },
  { title:"JPMorgan Chase Software Engineering Simulation", org:"Forage", status:"progress" },
  { title:"Data Analysis Course, July 2026 Cohort", org:"MS Virtual Academy", status:"progress" },
  { title:"LILO SWE Academy", org:"Cohort program", status:"progress" },
  { title:"Data Science Internship", org:"DecodeLabs", status:"done" },
  { title:"Data Science Internship", org:"CodeAlpha", status:"done" },
  { title:"CS50P", org:"HarvardX", status:"done" },
  { title:"Design Thinking · Critical Thinking in the AI Era", org:"HP LIFE", status:"done" },
  { title:"Cybersecurity Diploma", org:"Transformation College / Panoramic Synergy", status:"done" },
];

const logList = document.getElementById('logList');
growthLog.forEach(item=>{
  const div = document.createElement('div');
  div.className = 'log-item ' + (item.status === 'done' ? 'done' : '');
  const statusLabel = item.status === 'done' ? 'Completed' : (item.status === 'active' ? 'Active' : 'In progress');
  div.innerHTML = `
    <div class="log-dot"></div>
    <div class="log-head">
      <span class="log-title">${item.title}</span>
      <span class="log-status ${item.status !== 'done' ? 'progress':''}">${statusLabel}</span>
    </div>
    <div class="log-org">${item.org}</div>
  `;
  logList.appendChild(div);
});

// ---------- data: extend this array any time a new project ships ----------
const projects = [
  {
    tag:"End-to-end · Deployed",
    title:"Loan Default Predictor",
    desc:"XGBoost classifier with SMOTE for class imbalance, served through a Plotly Dash dashboard built end-to-end and pushed to production.",
    metrics:["XGBoost + SMOTE","Plotly Dash"],
    repo:"github.com/amadisamantha-arch/loan-default-predictor"
  },
  {
    tag:"Classification",
    title:"Fraud Detection",
    desc:"Random Forest fraud classifier with SMOTE resampling, evaluated on precision, recall and ROC-AUC.",
    metrics:["ROC-AUC 0.9849","SMOTE"],
    repo:"github.com/amadisamantha-arch/DecodeLabs-Internship"
  },
  {
    tag:"Unsupervised",
    title:"Customer Segmentation",
    desc:"K-Means clustering with PCA dimensionality reduction to segment customers into actionable groups.",
    metrics:["K-Means","PCA"],
    repo:"github.com/amadisamantha-arch/DecodeLabs-Internship"
  },
  {
    tag:"Regression",
    title:"Car Price Prediction",
    desc:"Gradient Boosting model trained on 301 vehicle records to predict resale price.",
    metrics:["R² 96.55%","301 records"],
    repo:"github.com/amadisamantha-arch"
  },
  {
    tag:"Classification",
    title:"Iris Classification",
    desc:"K-Nearest Neighbors classifier across the classic 150-sample Iris dataset, tuned across k values.",
    metrics:["93.33% @ K=5","96.67% @ K=1"],
    repo:"github.com/amadisamantha-arch"
  },
  {
    tag:"Analysis",
    title:"Unemployment Analysis",
    desc:"State-level analysis of Indian unemployment through the 2019–2020 lockdown period.",
    metrics:["Peak 23.24% (May '20)","9.76% → 13.28% avg"],
    repo:"github.com/amadisamantha-arch"
  },
];

const projGrid = document.getElementById('projGrid');
projects.forEach(p=>{
  const div = document.createElement('div');
  div.className = 'proj-card reveal';
  div.innerHTML = `
    <div class="proj-tag">${p.tag}</div>
    <div class="proj-title">${p.title}</div>
    <div class="proj-desc">${p.desc}</div>
    <div class="proj-metrics">${p.metrics.map(m=>`<span class="metric">${m}</span>`).join('')}</div>
    <div class="proj-links"><a href="https://${p.repo}" target="_blank" rel="noopener">View repo ↗</a></div>
  `;
  projGrid.appendChild(div);
});

// ---------- nav scroll state ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> navLinks.classList.remove('open')));

// ---------- reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold:0.15 });
revealEls.forEach(el=> io.observe(el));

// ---------- hero canvas: constellation / network ----------
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];
const NODE_COUNT_BASE = 46;

function resize(){
  W = canvas.width = canvas.offsetWidth * devicePixelRatio;
  H = canvas.height = canvas.offsetHeight * devicePixelRatio;
}
function initNodes(){
  nodes = [];
  const count = window.innerWidth < 700 ? 24 : NODE_COUNT_BASE;
  for(let i=0;i<count;i++){
    nodes.push({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
      r: Math.random()*1.6+0.6
    });
  }
}
function step(){
  ctx.clearRect(0,0,W,H);
  const maxDist = W < 900 ? 140 : 170;
  for(let i=0;i<nodes.length;i++){
    const n = nodes[i];
    n.x += n.vx; n.y += n.vy;
    if(n.x < 0 || n.x > W) n.vx *= -1;
    if(n.y < 0 || n.y > H) n.vy *= -1;
    for(let j=i+1;j<nodes.length;j++){
      const m = nodes[j];
      const dx = n.x-m.x, dy = n.y-m.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < maxDist){
        const op = (1-dist/maxDist) * 0.35;
        ctx.strokeStyle = `rgba(201,164,90,${op})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(m.x,m.y); ctx.stroke();
      }
    }
  }
  for(const n of nodes){
    ctx.beginPath();
    ctx.arc(n.x,n.y,n.r*devicePixelRatio,0,Math.PI*2);
    ctx.fillStyle = 'rgba(237,230,218,0.55)';
    ctx.fill();
  }
  requestAnimationFrame(step);
}
resize(); initNodes(); step();
window.addEventListener('resize', ()=>{ resize(); initNodes(); });

// ---------- contact form → EmailJS ----------
// TODO: swap in your real Template ID and Public Key from the EmailJS dashboard
const EMAILJS_SERVICE_ID  = "service_xtuukn9";
const EMAILJS_TEMPLATE_ID = "template_0z8dd7t";
const EMAILJS_PUBLIC_KEY  = "riuucbvMQg2g9CL3_";  // Account → General → API Keys

if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const contactForm = document.getElementById('contactForm');
const contactSubmit = document.getElementById('contactSubmit');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      formStatus.textContent = "Form isn't wired up yet — missing EmailJS Template ID / Public Key.";
      formStatus.className = "form-status error";
      return;
    }

    contactSubmit.disabled = true;
    contactSubmit.textContent = "Sending…";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
      .then(function () {
        formStatus.textContent = "Message sent — thank you! I'll get back to you soon.";
        formStatus.className = "form-status success";
        contactForm.reset();
      })
      .catch(function (err) {
        formStatus.textContent = "Something went wrong — please try again or email me directly.";
        formStatus.className = "form-status error";
        console.error("EmailJS error:", err);
      })
      .finally(function () {
        contactSubmit.disabled = false;
        contactSubmit.textContent = "Send message";
      });
  });
}