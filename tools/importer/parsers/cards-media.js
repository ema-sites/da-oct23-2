/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('ul.fusion-grid > li.post-card');
  cards.forEach((card) => {
    // Media cell: image, or a link to the looping .mp4 (Logos / Video cards)
    const mediaCell = [];
    const mediaCol = card.querySelector('.brand-foundation-card-image') || card;
    const img = mediaCol.querySelector('img');
    const source = mediaCol.querySelector('video source[src], video[src]');
    if (img) {
      if (!img.hasAttribute('alt')) img.setAttribute('alt', '');
      mediaCell.push(img);
    } else if (source) {
      const src = source.getAttribute('src');
      const a = document.createElement('a');
      a.href = src;
      a.textContent = src;
      mediaCell.push(a);
    }

    // Content cell: H3, description, Learn more link to the detail page
    const contentCell = [];
    const heading = card.querySelector('h3, h2, h4');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.push(h3);
    }
    card.querySelectorAll('.fusion-text p').forEach((p) => {
      if (p.textContent.trim()) contentCell.push(p);
    });
    const cta = card.querySelector('a.fusion-button[href]');
    const anchor = card.querySelector('a.fusion-column-anchor[href]');
    const href = (cta && cta.getAttribute('href')) || (anchor && anchor.getAttribute('href'));
    if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = (cta && cta.textContent.trim()) || 'Learn more';
      p.append(a);
      contentCell.push(p);
    }

    cells.push([mediaCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-media', cells });
  element.replaceWith(block);
}
