/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background photo (direct child img, or CSS background-image fallback)
  let bgImg = element.querySelector(':scope > img');
  if (!bgImg) {
    const styled = [element, ...element.querySelectorAll('[style*="background"]')]
      .find((el) => /url\(/.test(el.getAttribute('style') || ''));
    if (styled) {
      const m = (styled.getAttribute('style') || '').match(/url\((['"]?)([^'")]+)\1\)/);
      if (m) {
        bgImg = document.createElement('img');
        bgImg.src = m[2];
      }
    }
  }
  if (bgImg) {
    if (!bgImg.hasAttribute('alt')) bgImg.setAttribute('alt', '');
    cells.push([[bgImg]]);
  }

  // Row 2: H2, paragraph, CTA link
  const contentCell = [];
  const heading = element.querySelector('h2, h1, h3');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }
  element.querySelectorAll('.fusion-text p').forEach((p) => {
    if (p.textContent.trim()) contentCell.push(p);
  });
  const cta = element.querySelector('a.fusion-button[href]');
  if (cta) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href');
    a.textContent = cta.textContent.trim();
    strong.append(a);
    p.append(strong);
    contentCell.push(p);
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
