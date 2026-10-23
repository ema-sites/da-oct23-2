// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Fetches the nav fragment. Metadata-independent: /content first (local preview),
 * then the site root (DA / EDS).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: resp.url };
}

/**
 * Resolves relative media references against the fragment location
 * @param {Element} root fragment root
 * @param {string} base fragment URL
 */
function resolveMedia(root, base) {
  root.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), base).href;
  });
  root.querySelectorAll('source[srcset]').forEach((source) => {
    source.srcset = new URL(source.getAttribute('srcset'), base).href;
  });
}

function createIconButton(className, label, controls) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-expanded', 'false');
  if (controls) button.setAttribute('aria-controls', controls);
  button.innerHTML = '<span class="nav-icon"></span>';
  return button;
}

/**
 * Builds the search form from the authored search link (href = action, text = placeholder)
 * @param {Element} section the tools section
 * @returns {HTMLFormElement|null}
 */
function buildSearch(section) {
  const link = section.querySelector('a');
  if (!link) return null;
  const label = link.textContent.trim() || 'Search';
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.role = 'search';
  form.method = 'get';
  form.action = link.href;
  form.id = 'nav-search';
  form.innerHTML = `<label>
      <span class="nav-sr-only"></span>
      <input type="search" name="s" autocomplete="off">
    </label>
    <button type="submit" class="nav-search-submit"><span class="nav-icon"></span></button>`;
  form.querySelector('.nav-sr-only').textContent = label;
  form.querySelector('input').placeholder = label;
  form.querySelector('button').setAttribute('aria-label', label);
  section.textContent = '';
  section.append(form);
  return form;
}

/**
 * Decorates the nav list: sub-lists become accordions (mobile), and items that
 * duplicate the site title link are only shown in the mobile menu.
 * @param {Element} section nav sections
 * @param {string} titleHref href of the site title link
 */
function decorateSections(section, titleHref) {
  const list = section.querySelector(':scope > ul');
  if (!list) return;
  list.className = 'nav-list';
  list.id = 'nav-list';
  [...list.children].forEach((item, i) => {
    item.classList.add('nav-item');
    const link = item.querySelector(':scope > a');
    link?.classList.add('nav-trigger');
    if (link && titleHref && link.href === titleHref) item.classList.add('nav-item-mobile-only');
    const subList = item.querySelector(':scope > ul');
    if (!subList) return;
    item.classList.add('nav-drop');
    subList.className = 'nav-sub-list';
    subList.id = `nav-sub-${i}`;
    const toggle = createIconButton('nav-drop-toggle', `Expand ${link ? link.textContent.trim() : ''} links`, subList.id);
    subList.before(toggle);
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });
}

/**
 * Opens/closes a mobile panel (menu or search); only one panel is open at a time
 * @param {Element} nav nav element
 * @param {string} panel 'menu' | 'search' | ''
 */
function setPanel(nav, panel) {
  nav.dataset.panel = panel;
  nav.querySelectorAll('.nav-toggles button').forEach((button) => {
    const open = button.dataset.panel === panel;
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.setAttribute('aria-label', open ? button.dataset.closeLabel : button.dataset.openLabel);
  });
  if (!panel) {
    nav.querySelectorAll('.nav-drop-toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'));
  }
  if (panel === 'search') nav.querySelector('.nav-search input')?.focus();
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  if (!fragment) return;

  const root = document.createElement('div');
  root.innerHTML = fragment.html;
  resolveMedia(root, fragment.base);
  const [brand, title, sections, tools] = [...root.querySelectorAll(':scope > div')];

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');
  nav.dataset.panel = '';

  // brand bar (logo)
  const brandBar = document.createElement('div');
  brandBar.className = 'nav-brand-bar';
  if (brand) {
    brand.className = 'nav-brand';
    const logoLink = brand.querySelector('a');
    const logo = brand.querySelector('img');
    if (logoLink && logo && !logoLink.getAttribute('aria-label')) {
      logoLink.setAttribute('aria-label', logo.alt || 'Home');
    }
    if (logo) {
      logo.loading = 'eager';
      logo.width = 160;
      logo.height = 35;
    }
    brandBar.append(brand);
  }

  // main bar (site title, nav links, search, mobile toggles)
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main-bar';
  const inner = document.createElement('div');
  inner.className = 'nav-main-inner';
  mainBar.append(inner);

  let titleHref = '';
  if (title) {
    title.className = 'nav-title';
    titleHref = title.querySelector('a')?.href || '';
    inner.append(title);
  }

  if (sections) {
    sections.className = 'nav-sections';
    decorateSections(sections, titleHref);
  }

  let form = null;
  if (tools) {
    tools.className = 'nav-tools';
    form = buildSearch(tools);
  }

  // mobile toggles: search and hamburger
  const toggles = document.createElement('div');
  toggles.className = 'nav-toggles';
  if (form) {
    const searchToggle = createIconButton('nav-toggle nav-search-toggle', 'Open search', form.id);
    Object.assign(searchToggle.dataset, { panel: 'search', openLabel: 'Open search', closeLabel: 'Close search' });
    toggles.append(searchToggle);
  }
  if (sections) {
    const hamburger = createIconButton('nav-toggle nav-hamburger', 'Open navigation', 'nav-list');
    Object.assign(hamburger.dataset, { panel: 'menu', openLabel: 'Open navigation', closeLabel: 'Close navigation' });
    toggles.append(hamburger);
  }
  toggles.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      setPanel(nav, nav.dataset.panel === button.dataset.panel ? '' : button.dataset.panel);
    });
  });
  // toggles precede the panels they control in reading order
  inner.append(toggles);
  if (sections) inner.append(sections);
  if (tools) inner.append(tools);

  // close panels on escape and when crossing to desktop
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.dataset.panel) {
      const open = nav.dataset.panel;
      setPanel(nav, '');
      toggles.querySelector(`[data-panel="${open}"]`)?.focus();
    }
  });
  isDesktop.addEventListener('change', () => setPanel(nav, ''));

  nav.append(brandBar, mainBar);
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
