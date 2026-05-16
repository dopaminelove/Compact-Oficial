// ==== Nav scroll + mobile menu ====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    navToggle.classList.toggle('open', open);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      navToggle.classList.remove('open');
    });
  });
}

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
const vehicleOpts = document.getElementById('vehicleOpts');
const filmOpts = document.getElementById('filmOpts');
const removeOpts = document.getElementById('removeOpts');
const darkButtons = document.getElementById('darkButtons');

const priceEl = document.getElementById('price');
const sumVehicle = document.getElementById('sumVehicle');
const sumFilm = document.getElementById('sumFilm');
const sumDark = document.getElementById('sumDark');
const darknessV = document.getElementById('darknessV');

const nomeCarroInput = document.getElementById('nomecarro');
const anoCarroInput = document.getElementById('anocarro');
const whatsBtn = document.getElementById('whatsBtn');

// estado inicial
const activeVehicle = vehicleOpts?.querySelector('.opt.active');
const activeFilm = filmOpts?.querySelector('.opt.active');
const activeDark = darkButtons?.querySelector('.dark-opt.active');

const state = {
  vehicle: activeVehicle?.querySelector('span')?.textContent || 'Carro',
  vMult: parseFloat(activeVehicle?.dataset.mult || 1),

  film: activeFilm?.dataset.value || 'Profissional',
  fBase: parseFloat(activeFilm?.dataset.base || 350),

  darkness: parseInt(activeDark?.dataset.dark || 35),

  remove: 'Não',
  removePrice: 0,
};

function fmtBRL(n) {
  return 'R$ ' + n.toLocaleString('pt-BR');
}

function update() {
  const price = Math.round((state.fBase * state.vMult) + state.removePrice);

  if (priceEl) priceEl.textContent = fmtBRL(price);
  if (sumVehicle) sumVehicle.textContent = state.vehicle;
  if (sumFilm) sumFilm.textContent = state.film;
  if (sumDark) sumDark.textContent = state.darkness + '%';
  if (darknessV) darknessV.textContent = state.darkness + '%';

  const nomeCarro = nomeCarroInput?.value.trim() || '';
  const anoCarro = anoCarroInput?.value.trim() || '';

  const msg = `Olá! 

Quero um orçamento de insufilm:

 Veículo: ${state.vehicle}
 Carro: ${nomeCarro} ${anoCarro ? '(' + anoCarro + ')' : ''}
 Película: ${state.film}
 Escurecimento: ${state.darkness}%
 Remoção: ${state.remove}

 Valor estimado: ${fmtBRL(price)}

${state.remove === 'Sim' ? 'Tenho película antiga. Posso enviar foto para avaliação da remoção?' : ''}

Pode me atender?`;

  if (whatsBtn) {
    whatsBtn.href = `https://wa.me/551191649-7132?text=${encodeURIComponent(msg)}`;
  }
}

function bindOptions(container, onPick) {
  if (!container) return;

  container.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onPick(btn);
      update();
    });
  });
}

// binds
bindOptions(vehicleOpts, (btn) => {
  state.vehicle = btn.querySelector('span').textContent;
  state.vMult = parseFloat(btn.dataset.mult);
});

bindOptions(filmOpts, (btn) => {
  state.film = btn.dataset.value;
  state.fBase = parseFloat(btn.dataset.base);
});

bindOptions(removeOpts, (btn) => {
  state.remove = btn.dataset.remove === 'sim' ? 'Sim' : 'Não';
  state.removePrice = parseFloat(btn.dataset.add);
});

// escurecimento
if (darkButtons) {
  darkButtons.querySelectorAll('.dark-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      darkButtons.querySelectorAll('.dark-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state.darkness = parseInt(btn.dataset.dark);
      update();
    });
  });
}

// 👉 VALIDAÇÃO (fora do update)
if (whatsBtn) {
  whatsBtn.addEventListener('click', (e) => {
    const nomeCarro = nomeCarroInput?.value.trim();
    const anoCarro = anoCarroInput?.value.trim();

    if (!nomeCarro || !anoCarro) {
      e.preventDefault();
      alert('Preencha o nome e o ano do carro antes de enviar.');
      return;
    }

    // 👉 GARANTE que o valor mais recente vai pro Whats
    update();
  });
}

// opcional: só números no ano
if (anoCarroInput) {
  anoCarroInput.addEventListener('input', () => {
    anoCarroInput.value = anoCarroInput.value.replace(/\D/g, '');
  });
}

// inicializa
update();

// ==== Year ====
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
