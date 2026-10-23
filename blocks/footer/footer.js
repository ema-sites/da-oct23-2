/**
 * Fetches the footer fragment. Metadata-independent: /content first (local preview),
 * then the site root (DA / EDS).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
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

/**
 * Tags the parts of a footer section: logo, link lists and text
 * @param {Element} section footer section
 */
function decorateSection(section) {
  [...section.children].forEach((child) => {
    if (child.tagName === 'UL') {
      child.classList.add('footer-links');
    } else if (child.querySelector('img')) {
      child.classList.add('footer-logo');
      const link = child.querySelector('a');
      const img = child.querySelector('img');
      if (link && img && !link.getAttribute('aria-label')) link.setAttribute('aria-label', img.alt || 'Home');
    } else if (child.tagName === 'P') {
      child.classList.add('footer-text');
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  if (!fragment) return;

  const root = document.createElement('div');
  root.innerHTML = fragment.html;
  resolveMedia(root, fragment.base);
  const sections = [...root.querySelectorAll(':scope > div')];

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  sections.forEach((section, i) => {
    section.className = `footer-section footer-section-${i + 1}`;
    decorateSection(section);
    footer.append(section);
  });

  // the closing (legal) link list opens in a new tab, as on the source site
  const legal = sections.at(-1)?.querySelector('.footer-links');
  if (sections.length > 1 && legal) {
    legal.classList.add('footer-legal');
    legal.querySelectorAll('a[href]').forEach((a) => {
      if (a.getAttribute('href').startsWith('#')) return;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  block.append(footer);
}
