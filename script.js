// ==== Nav scroll + mobile menu ====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('mobile-open');
  navToggle.classList.toggle('open', open);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('mobile-open');
    navToggle.classList.remove('open');
  });
});

// Mobile nav styles toggle (inject when open)
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 1023px) {
    .nav-links {
      position: fixed; top: 72px; left: 1rem; right: 1rem;
      flex-direction: column; gap: 1rem;
      background: hsl(260 25% 8% / 0.95); backdrop-filter: blur(16px);
      border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem;
      transform: translateY(-10px); opacity: 0; pointer-events: none;
      transition: all 0.3s ease;
    }
    .nav-links.mobile-open { display: flex; transform: translateY(0); opacity: 1; pointer-events: auto; }
  }
`;
document.head.appendChild(style);

// ==== Scroll reveal ====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ==== Quote simulator ====
// IMPORTANT: price is based ONLY on vehicle type + film type. Darkness does NOT affect price.
const vehicleOpts = document.getElementById('vehicleOpts');
const filmOpts = document.getElementById('filmOpts');
const darkness = document.getElementById('darkness');
const darknessV = document.getElementById('darknessV');
const priceEl = document.getElementById('price');
const sumVehicle = document.getElementById('sumVehicle');
const sumFilm = document.getElementById('sumFilm');
const sumDark = document.getElementById('sumDark');
const whatsBtn = document.getElementById('whatsBtn');
const activeVehicle = vehicleOpts.querySelector('.opt.active');
const activeFilm = filmOpts.querySelector('.opt.active');
const activeDark = document.querySelector('.dark-opt.active');

const state = {
 vehicle: activeVehicle.querySelector('span').textContent,
  vMult: parseFloat(activeVehicle.dataset.mult),

  film: activeFilm.dataset.value,
  fBase: parseFloat(activeFilm.dataset.base),

  darkness: parseInt(activeDark.dataset.dark),

  remove: 'Não',
  removePrice: 0,
};



function fmtBRL(n) { return 'R$ ' + n.toLocaleString('pt-BR'); }

function update() {
 const price = Math.round((state.fBase * state.vMult) + state.removePrice);
  priceEl.textContent = fmtBRL(price);
  sumVehicle.textContent = state.vehicle;
  sumFilm.textContent = state.film;
  sumDark.textContent = state.darkness + '%';
  darknessV.textContent = state.darkness + '%';

  // slider gradient
  const pct = ((state.darkness - 5) / 75) * 100;
  darkness.style.background =
    `linear-gradient(to right, hsl(226, 91%, 60%) 0%, hsl(214, 100%, 70%) ${pct}%, hsl(217, 21%, 12%) ${pct}%)`;

  const msg = `

Olá! 👋

Quero um orçamento de insufilm:

🚗 Veículo: ${state.vehicle}
🎞 Película: ${state.film}
🌑 Escurecimento: ${state.darkness}%
🧽 Remoção: ${state.remove}

💰 Valor estimado: ${fmtBRL(price)}

${state.remove === 'Sim' ? 'Tenho película antiga. Posso enviar foto para avaliação da remoção?' : ''}

Pode me atender?;

  `;
  whatsBtn.href = `https://wa.me/5511998262568?text=${encodeURIComponent(msg)}`;
}

function bindOptions(container, onPick) {
  container.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onPick(btn);
      update();
    });
  });
}

bindOptions(vehicleOpts, (btn) => {
  state.vehicle = btn.querySelector('span').textContent;
  state.vMult = parseFloat(btn.dataset.mult);
});

bindOptions(filmOpts, (btn) => {
  state.film = btn.dataset.value;
  state.fBase = parseFloat(btn.dataset.base);
});

const removeOpts = document.getElementById('removeOpts');

bindOptions(removeOpts, (btn) => {
  state.remove = btn.dataset.remove === 'sim' ? 'Sim' : 'Não';
  state.removePrice = parseFloat(btn.dataset.add);
});

const darkButtons = document.getElementById('darkButtons');

darkButtons.querySelectorAll('.dark-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    
    // remove active de todos
    darkButtons.querySelectorAll('.dark-opt').forEach(b => b.classList.remove('active'));
    
    // ativa o clicado
    btn.classList.add('active');

    // pega valor (5, 20, 35)
    state.darkness = parseInt(btn.dataset.dark);

    update();
  });
});


update();

// ==== Contact form → WhatsApp ====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg = document.getElementById('cMsg').value.trim();
  if (!name || !msg) {
    alert('Preencha nome e mensagem.');
    return;
  }
  const text = `Olá! Sou ${name}${email ? ' (' + email + ')' : ''}. ${msg}`;
  window.open(`https://wa.me/5511998262568?text=${encodeURIComponent(text)}`, '_blank');
  contactForm.reset();
});

// ==== Year ====
document.getElementById('year').textContent = new Date().getFullYear();
