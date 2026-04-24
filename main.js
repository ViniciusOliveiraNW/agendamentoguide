// ─── Tema ────────────────────────────────────────────────
const html = document.documentElement;
const saved = localStorage.getItem('jadi-theme') || 'light';
html.setAttribute('data-theme', saved);

document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('jadi-theme', next);
});

// ─── Navegação ───────────────────────────────────────────
document.querySelectorAll('.nav-item[data-section]').forEach(item => {
  item.addEventListener('click', () => {
    const sid = item.dataset.section;
    const sub = item.dataset.sub;

    // Ativa a seção correta
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('search-results-section').classList.remove('active');
    const target = document.getElementById(sid);
    if (target) target.classList.add('active');

    // Marca item ativo na sidebar
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const group = document.querySelector(`.nav-item[data-section="${sid}"]:not([data-sub])`);
    if (group) group.classList.add('active');
    item.classList.add('active');

    // Scroll até sub-âncora ou topo
    if (sub) {
      setTimeout(() => {
        const el = document.getElementById(sub);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      document.getElementById('main').scrollTo({ top: 0, behavior: 'smooth' });
    }

    closeSidebar();
  });
});

// ─── Hamburger / Sidebar mobile ──────────────────────────
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

document.getElementById('hamburger').addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  overlay.classList.toggle('show', open);
});

overlay.addEventListener('click', closeSidebar);

// ─── Botões de modo de visualização ──────────────────────
document.querySelectorAll('.view-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ─── Busca ───────────────────────────────────────────────
const searchInput   = document.getElementById('search-input');
const searchClear   = document.getElementById('search-clear');
const searchResults = document.getElementById('search-results-section');
const searchList    = document.getElementById('search-results-list');
const searchTerm    = document.getElementById('search-term-display');

function doSearch(q) {
  if (!q.trim()) {
    searchResults.classList.remove('active');
    document.querySelectorAll('.section').forEach((s, i) => {
      if (i === 0) s.classList.add('active');
      else s.classList.remove('active');
    });
    return;
  }

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  searchResults.classList.add('active');
  searchTerm.textContent = `"${q}"`;

  const items = document.querySelectorAll('[data-searchable]');
  const ql = q.toLowerCase();
  searchList.innerHTML = '';

  let found = 0;
  items.forEach(el => {
    const title   = el.dataset.title   || '';
    const content = el.dataset.content || '';

    if (title.toLowerCase().includes(ql) || content.toLowerCase().includes(ql)) {
      found++;
      const div = document.createElement('div');
      div.className = 'search-result-item';
      const hi = str => str.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
      div.innerHTML = `
        <div class="sr-title">${hi(title)}</div>
        <div class="sr-snippet">${hi(content.slice(0, 120))}…</div>
      `;
      div.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.classList.remove('show');
        searchResults.classList.remove('active');
        const sid = el.closest('.section')?.id;
        if (sid) {
          document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
          document.getElementById(sid)?.classList.add('active');
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.style.animation = 'search-pulse 2.5s ease';
            setTimeout(() => el.style.animation = '', 2600);
          }, 150);
        }
      });
      searchList.appendChild(div);
    }
  });

  if (!found) {
    searchList.innerHTML = '<p style="color:var(--text-muted);font-size:.88rem;padding:1rem 0">Nenhum resultado encontrado.</p>';
  }
}

searchInput.addEventListener('input', e => {
  const v = e.target.value;
  searchClear.classList.toggle('show', v.length > 0);
  doSearch(v);
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.classList.remove('show');
  doSearch('');
  searchInput.focus();
});

// Atalho Ctrl/Cmd + K
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// ─── Indicadores — toggle de detalhe ao clicar ───────────
document.querySelectorAll('.indicator[data-detail]').forEach(ind => {
  ind.addEventListener('click', () => {
    const isOpen = ind.classList.contains('open');
    // Fecha todos os outros
    document.querySelectorAll('.indicator.open').forEach(o => o.classList.remove('open'));
    // Abre o clicado (se não estava aberto)
    if (!isOpen) ind.classList.add('open');
  });
});

// ─── Voltar ao topo ───────────────────────────────────────
const mainEl = document.getElementById('main');
const btt    = document.getElementById('back-to-top');

mainEl.addEventListener('scroll', () => {
  btt.classList.toggle('visible', mainEl.scrollTop > 300);
});

btt.addEventListener('click', () => {
  mainEl.scrollTo({ top: 0, behavior: 'smooth' });
});