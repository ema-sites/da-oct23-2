/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [];

  // The source duplicates the image list for a seamless loop; keep each unique src once.
  const content = element.querySelector(':scope > .marquee-content, :scope > .marquee-brand-content') || element;
  const seen = new Set();
  content.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || img.src;
    if (!src) return;
    let key = src;
    try { key = new URL(src, document.baseURI).href; } catch (e) { /* keep raw */ }
    if (seen.has(key)) return;
    seen.add(key);
    if (!img.hasAttribute('alt')) img.setAttribute('alt', '');
    cells.push([img]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-marquee', cells });
  element.replaceWith(block);
}
