/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background video as a link to the .mp4 (plus poster image if available)
  const mediaCell = [];
  const video = element.querySelector('.fullwidth-video video, video');
  const source = video && (video.querySelector('source[src]') || (video.getAttribute('src') ? video : null));
  const videoSrc = source ? source.getAttribute('src') : '';
  const poster = video ? video.getAttribute('poster') : '';
  if (poster) {
    const img = document.createElement('img');
    img.src = poster;
    img.alt = '';
    mediaCell.push(img);
  }
  if (videoSrc) {
    const a = document.createElement('a');
    a.href = videoSrc;
    a.textContent = videoSrc;
    mediaCell.push(a);
  }
  if (mediaCell.length) cells.push([mediaCell]);

  // Row 2: eyebrow paragraph, H1, in-page jump link
  const contentCell = [];
  const eyebrowSrc = element.querySelector('.eyebrow-heading .fusion-title-heading');
  if (eyebrowSrc && eyebrowSrc.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = eyebrowSrc.textContent.trim();
    contentCell.push(p);
  }
  const heading = element.querySelector('h1') || element.querySelector('h2');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  const jump = element.querySelector('.explore-the-brand a[href], a.explore-btn-arrow[href]');
  if (jump) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = jump.getAttribute('href');
    a.textContent = jump.textContent.trim();
    p.append(a);
    contentCell.push(p);
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
