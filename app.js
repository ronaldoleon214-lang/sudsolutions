// Sud Solutions — Clean Editorial Interactions

const MODULE_GROUPS = [
  {
    badge: '01',
    title: 'Flota & Combustible',
    subtitle: 'Controla cargas de diésel, taller y rutas.',
    impact: 'Hasta -18.4% en gasto de combustible y paros no programados',
    items: [
      { name: 'Control de combustible', desc: 'Valida cargas vs. rendimiento por unidad' },
      { name: 'Mantenimientos', desc: 'Alertas preventivas por kilometraje o fecha' },
      { name: 'Checklists', desc: 'Inspección digital antes de cada salida' },
      { name: 'Neumáticos y baterías', desc: 'Vida útil, rotaciones y garantías' },
      { name: 'Viajes', desc: 'Costeo por ruta, casetas y liquidación' }
    ]
  },
  {
    badge: '02',
    title: 'Logística & Almacén',
    subtitle: 'Trazabilidad desde bodega hasta entrega.',
    impact: 'Inventario sincronizado y Carta Porte timbrada sin errores',
    items: [
      { name: 'Carta porte', desc: 'Emisión rápida ligada a viajes y unidades' },
      { name: 'Inventario', desc: 'Entradas, salidas y refacciones en tiempo real' },
      { name: 'Activos con QR', desc: 'Etiquetado y auditoría rápida de equipos' },
      { name: 'Bodegas', desc: 'Control multi-almacén y traspasos' },
      { name: 'EIR', desc: 'Registro de intercambio de equipo y remolques' },
      { name: 'Producción', desc: 'Órdenes de transformación y costos' }
    ]
  },
  {
    badge: '03',
    title: 'Finanzas & Ventas',
    subtitle: 'Facturación, bancos, compras y CRM.',
    impact: 'Cierra tu operación comercial y contable en un solo sistema',
    items: [
      { name: 'Facturación', desc: 'CFDI y control de cobranza automatizado' },
      { name: 'Cotizaciones', desc: 'Envío y seguimiento comercial ágil' },
      { name: 'Órdenes de compra', desc: 'Aprobaciones y control de proveedores' },
      { name: 'Requisiciones', desc: 'Solicitudes internas por departamento' },
      { name: 'Notas de venta', desc: 'Registro rápido de operaciones diarias' },
      { name: 'Notas de crédito', desc: 'Devoluciones y ajustes fiscales' },
      { name: 'Bancos', desc: 'Conciliación y flujo de efectivo' },
      { name: 'CRM', desc: 'Seguimiento de clientes y oportunidades' },
      { name: 'Punto de venta', desc: 'Cobro en mostrador conectado a inventario' },
      { name: 'Arrendamiento', desc: 'Control de rentas, contratos y vencimientos' }
    ]
  },
  {
    badge: '04',
    title: 'IA, Seguridad & Equipo',
    subtitle: 'Operación blindada y control de personal.',
    impact: 'Supervisión 24/7 en cabina y gestión interna sin fugas',
    items: [
      { name: 'Dashcam IA', desc: 'Alertas de fatiga, distracción y video en nube' },
      { name: 'Monitoreo activo', desc: 'Seguimiento 24/7 y recuperación de unidades' },
      { name: 'Tickets internos', desc: 'Mesa de ayuda y seguimiento de incidencias' },
      { name: 'Control de personal y asistencia', desc: 'Registros, turnos y productividad' }
    ]
  }
];

let activeDeptIndex = 0;
let selectedModules = [];

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCustomSelects();
  initQuoteButtons();
  initCalculator();
  initScrollReveal();
  renderModules();
  initPymeApply();
  initDemoForm();
});

function initCalculator() {
  const unitsInput = document.getElementById('calc-units');
  const fuelInput = document.getElementById('calc-fuel');
  const unitsLabel = document.getElementById('calc-units-label');
  const fuelLabel = document.getElementById('calc-fuel-label');
  const monthlyEl = document.getElementById('calc-monthly');
  const yearlyEl = document.getElementById('calc-yearly');
  const currentSpendEl = document.getElementById('calc-current-spend');
  const newSpendEl = document.getElementById('calc-new-spend');
  const applyBtn = document.getElementById('calc-apply-btn');
  const presets = document.querySelectorAll('#calc-presets .calc-preset');
  if (!unitsInput || !fuelInput) return;

  const fmt = (n) => '$' + Math.round(n).toLocaleString('es-MX') + ' MXN';

  const paintSlider = (el) => {
    const min = Number(el.min);
    const max = Number(el.max);
    const val = Number(el.value);
    const pct = ((val - min) / (max - min)) * 100;
    el.style.background = `linear-gradient(to right, #73963C 0%, #73963C ${pct}%, #E2E4DC ${pct}%, #E2E4DC 100%)`;
  };

  const update = () => {
    const units = Number(unitsInput.value);
    const fuel = Number(fuelInput.value);
    const totalSpend = units * fuel;
    const monthlySavings = totalSpend * 0.16;
    const newSpend = totalSpend - monthlySavings;
    const yearlySavings = monthlySavings * 12;

    paintSlider(unitsInput);
    paintSlider(fuelInput);

    unitsLabel.textContent = `${units} unidades`;
    fuelLabel.textContent = fmt(fuel);
    monthlyEl.textContent = fmt(monthlySavings);
    yearlyEl.textContent = `${fmt(yearlySavings)} / año`;
    if (currentSpendEl) currentSpendEl.textContent = fmt(totalSpend);
    if (newSpendEl) newSpendEl.textContent = fmt(newSpend);
    applyBtn.textContent = `Cotizar para mis ${units} unidades →`;

    presets.forEach((p) => {
      const match = Number(p.dataset.units) === units;
      p.classList.toggle('border-[#4A6D1A]', match);
      p.classList.toggle('bg-[#EEF5E1]', match);
      p.classList.toggle('font-bold', match);
      p.classList.toggle('text-[#2F470E]', match);
    });
  };

  presets.forEach((btn) => {
    btn.addEventListener('click', () => {
      unitsInput.value = btn.dataset.units;
      update();
    });
  });

  unitsInput.addEventListener('input', update);
  fuelInput.addEventListener('input', update);
  update();

  applyBtn?.addEventListener('click', () => {
    const units = Number(unitsInput.value);
    const msg = document.getElementById('lead-message');
    if (msg) {
      msg.value = `Hola, tengo ${units} unidades en operación y calculé un ahorro estimado de ${monthlyEl.textContent}/mes. Quiero agendar una demo.`;
    }
    document.getElementById('agendar-demo')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => obs.observe(el));
}

function syncCustomSelect(selectId, val) {
  const wrap = document.querySelector(`.custom-select-btn[data-for="${selectId}"]`)?.closest('.custom-select-wrap');
  const native = document.getElementById(selectId);
  if (!wrap || !native) return;
  native.value = val;
  const label = wrap.querySelector('.custom-select-label');
  wrap.querySelectorAll('.custom-opt').forEach((opt) => {
    const match = opt.dataset.val === val;
    opt.classList.toggle('bg-[#EEF5E1]', match);
    opt.classList.toggle('font-semibold', match);
    opt.querySelector('.check')?.classList.toggle('hidden', !match);
    if (match && label) label.textContent = opt.querySelector('span')?.textContent || val;
  });
}

function initCustomSelects() {
  document.querySelectorAll('.custom-select-wrap').forEach((wrap) => {
    const btn = wrap.querySelector('.custom-select-btn');
    const menu = wrap.querySelector('.custom-select-menu');
    const selectId = btn?.dataset.for;
    if (!btn || !menu || !selectId) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-menu').forEach((m) => {
        if (m !== menu) m.classList.add('hidden');
      });
      menu.classList.toggle('hidden');
    });

    wrap.querySelectorAll('.custom-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        syncCustomSelect(selectId, opt.dataset.val);
        menu.classList.add('hidden');
      });
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-menu').forEach((m) => m.classList.add('hidden'));
  });
}

function initNav() {
  const loginBtn = document.getElementById('login-btn');
  const loginMenu = document.getElementById('login-menu');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (loginBtn && loginMenu) {
    loginBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loginMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', () => loginMenu.classList.add('hidden'));
  }

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }
}

function initHeroCardSwitcher() {
  const img = document.getElementById('hero-card-img');
  const label = document.getElementById('hero-card-label');
  const btns = document.querySelectorAll('#hero-card-switcher button');
  if (!img || !btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => {
        b.classList.remove('bg-white/15', 'text-white');
        b.classList.add('bg-transparent', 'text-gray-400');
      });
      btn.classList.add('bg-white/15', 'text-white');
      btn.classList.remove('bg-transparent', 'text-gray-400');
      img.src = btn.dataset.img;
      label.textContent = btn.dataset.label;
    });
  });
}

function initQuoteButtons() {
  document.querySelectorAll('.quote-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prod = btn.dataset.selectProduct;
      const select = document.getElementById('lead-product');
      const msg = document.getElementById('lead-message');
      if (select && prod) syncCustomSelect('lead-product', prod);
      if (msg && !msg.value.trim()) {
        msg.value = `Hola, me interesa agendar una demo de ${prod}.`;
      }
      document.getElementById('agendar-demo')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderModules() {
  const tabsContainer = document.getElementById('dept-tabs');
  const panel = document.getElementById('dept-panel');
  const countEl = document.getElementById('pyme-count');
  if (!tabsContainer || !panel) return;

  tabsContainer.innerHTML = MODULE_GROUPS.map((group, idx) => {
    const isActive = idx === activeDeptIndex;
    const selectedInGroup = group.items.filter((i) => selectedModules.includes(i.name)).length;
    return `
      <button type="button" data-dept="${idx}"
              class="dept-tab w-full text-left p-5 rounded-xl border transition flex items-center justify-between gap-4 ${
                isActive
                  ? 'bg-[#0A0C09] text-white border-[#0A0C09] shadow-lg'
                  : 'bg-white text-[#0A0C09] border-[#E2E4DC] hover:border-[#6B8E35]'
              }">
        <div>
          <div class="font-mono-tech text-[10px] uppercase tracking-wider ${isActive ? 'text-[#9BBF5F]' : 'text-[#4A6D1A]'}">
            Área ${group.badge} · ${group.items.length} módulos
          </div>
          <div class="text-base sm:text-lg font-extrabold mt-0.5">${group.title}</div>
          <div class="text-xs mt-1 ${isActive ? 'text-gray-300' : 'text-gray-600'}">${group.subtitle}</div>
        </div>
        <div class="shrink-0 text-right">
          ${selectedInGroup > 0 ? `<span class="inline-block px-2 py-0.5 rounded bg-[#9BBF5F] text-[#0A0C09] font-mono-tech text-[11px] font-bold">${selectedInGroup} ✓</span>` : `<span class="${isActive ? 'text-[#9BBF5F]' : 'text-gray-400'} text-lg">→</span>`}
        </div>
      </button>
    `;
  }).join('');

  const current = MODULE_GROUPS[activeDeptIndex];
  panel.innerHTML = `
    <div>
      <div class="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div>
          <span class="font-mono-tech text-[11px] text-[#9BBF5F] uppercase">ÁREA ${current.badge}</span>
          <h3 class="text-2xl font-extrabold text-white mt-0.5">${current.title}</h3>
        </div>
        <span class="px-3 py-1 rounded-md bg-[#9BBF5F]/15 border border-[#9BBF5F]/30 text-[#C8EC93] text-xs font-medium">
          ${current.impact}
        </span>
      </div>

      <div class="grid sm:grid-cols-2 gap-3 mt-5">
        ${current.items
          .map((item) => {
            const isSel = selectedModules.includes(item.name);
            return `
              <button type="button" data-module="${item.name}"
                      class="module-pick text-left p-3.5 rounded-lg border transition flex items-start justify-between gap-3 ${
                        isSel
                          ? 'bg-[#9BBF5F]/15 border-[#9BBF5F] text-white'
                          : 'bg-[#131711] border-white/10 hover:border-white/30 text-gray-200'
                      }">
                <div>
                  <div class="text-sm font-bold ${isSel ? 'text-[#C8EC93]' : 'text-white'}">${item.name}</div>
                  <div class="text-xs text-gray-400 mt-0.5 leading-snug">${item.desc}</div>
                </div>
                <span class="w-6 h-6 rounded flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5 ${
                  isSel ? 'bg-[#9BBF5F] text-[#0A0C09]' : 'bg-white/10 text-gray-300'
                }">${isSel ? '✓' : '+'}</span>
              </button>
            `;
          })
          .join('')}
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
      <span>Selecciona hasta 5 módulos en total para tu descuento PyME</span>
      <span class="font-mono-tech text-[#C8EC93] font-bold">${selectedModules.length} / 5 elegidos</span>
    </div>
  `;

  if (countEl) countEl.textContent = `${selectedModules.length} / 5 seleccionados`;

  tabsContainer.querySelectorAll('.dept-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeDeptIndex = Number(btn.dataset.dept);
      renderModules();
    });
  });

  panel.querySelectorAll('.module-pick').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.module;
      if (selectedModules.includes(name)) {
        selectedModules = selectedModules.filter((m) => m !== name);
      } else {
        if (selectedModules.length >= 5) return;
        selectedModules.push(name);
      }
      renderModules();
    });
  });
}

function initPymeApply() {
  document.getElementById('apply-pyme-btn')?.addEventListener('click', () => {
    const select = document.getElementById('lead-product');
    const msg = document.getElementById('lead-message');
    if (select) syncCustomSelect('lead-product', 'Paquete PyME 50% OFF');
    if (msg) {
      const list = selectedModules.length ? selectedModules.join(', ') : 'Por definir en la demo';
      msg.value = `Me interesa el Paquete PyME con 50% OFF en implementación. Módulos elegidos: ${list}.`;
    }
    document.getElementById('agendar-demo')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initDemoForm() {
  const form = document.getElementById('demo-form');
  const successBox = document.getElementById('form-success');
  const successDetail = document.getElementById('form-success-detail');
  const successWa = document.getElementById('success-wa-link');
  const resetBtn = document.getElementById('reset-form-btn');
  const waBtn = document.getElementById('whatsapp-submit-btn');
  const topicChips = document.querySelectorAll('#quick-topics .topic-chip');
  if (!form) return;

  topicChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      topicChips.forEach((c) => {
        c.classList.remove('border-[#4A6D1A]', 'bg-[#EEF5E1]', 'text-[#2F470E]');
      });
      chip.classList.add('border-[#4A6D1A]', 'bg-[#EEF5E1]', 'text-[#2F470E]');
      const msg = document.getElementById('lead-message');
      if (msg) {
        msg.value = `Hola, me interesa agendar una demo enfocada en: ${chip.dataset.topic}.`;
      }
    });
  });

  const getData = () => ({
    name: document.getElementById('lead-name').value.trim() || 'Cliente',
    company: document.getElementById('lead-company').value.trim() || 'Empresa',
    product: document.getElementById('lead-product').value,
    country: document.getElementById('lead-country').value,
    message: document.getElementById('lead-message').value.trim()
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = getData();
    const waText = encodeURIComponent(`Hola Sud Solutions, soy ${d.name} (${d.company}, ${d.country}). Solicito demo de ${d.product}. ${d.message}`);
    successDetail.textContent = `Gracias, ${d.name}. Tu solicitud para ${d.product} está lista. Un especialista te contactará pronto.`;
    successWa.href = `https://wa.me/529934306180?text=${waText}`;
    form.classList.add('hidden');
    successBox.classList.remove('hidden');
  });

  waBtn?.addEventListener('click', () => {
    const d = getData();
    const waText = encodeURIComponent(`Hola Sud Solutions, soy ${d.name} (${d.company}, ${d.country}). Me interesa cotizar ${d.product}. ${d.message}`);
    window.open(`https://wa.me/529934306180?text=${waText}`, '_blank', 'noopener,noreferrer');
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    successBox.classList.add('hidden');
    form.classList.remove('hidden');
  });
}
