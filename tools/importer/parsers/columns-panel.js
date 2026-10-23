/* eslint-disable */
/* global WebImporter */

function buildButton(document, srcLink) {
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = srcLink.getAttribute('href');
  a.textContent = srcLink.textContent.trim();
  // EDS buttonization: <strong> = primary, <em> = secondary (outline)
  const isOutline = /outline/.test(srcLink.className || '');
  const wrap = document.createElement(isOutline ? 'em' : 'strong');
  wrap.append(a);
  p.append(wrap);
  return p;
}

export default function parse(element, { document }) {
  const cells = [];

  // Image cell
  const imageCell = [];
  const imgCol = element.querySelector('.brand-training-image-box') || element;
  const img = imgCol.querySelector('img');
  if (img) imageCell.push(img);

  // Text cell: eyebrow p, H2, paragraph(s), button
  const textCell = [];
  const textCol = element.querySelector('.brand-training-wrap') || element;
  const eyebrow = textCol.querySelector('.eyebrow-heading .fusion-title-heading');
  if (eyebrow && eyebrow.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    textCell.push(p);
  }
  const heading = textCol.querySelector('h1, h2, h3');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textCell.push(h2);
  }
  textCol.querySelectorAll('.fusion-text p').forEach((p) => {
    if (p.textContent.trim()) textCell.push(p);
  });
  textCol.querySelectorAll('a.fusion-button[href]').forEach((a) => {
    textCell.push(buildButton(document, a));
  });

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-panel', cells });
  element.replaceWith(block);
}
