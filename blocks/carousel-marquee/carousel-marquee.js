import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const track = document.createElement('ul');
  track.className = 'carousel-marquee-track';

  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture');
    if (!pic) return;
    const img = pic.querySelector('img');
    const li = document.createElement('li');
    li.className = 'carousel-marquee-slide';
    li.append(img ? createOptimizedPicture(img.src, img.alt, false, [{ width: '1600' }]) : pic);
    // Optional caption from any non-image cell.
    const text = [...row.children].find((c) => !c.querySelector('picture') && c.textContent.trim());
    if (text) {
      const caption = document.createElement('div');
      caption.className = 'carousel-marquee-caption';
      caption.append(...text.childNodes);
      li.append(caption);
    }
    track.append(li);
  });

  if (!track.children.length) {
    block.replaceChildren();
    return;
  }

  // Duplicate slides for a seamless loop; clones are hidden from assistive tech.
  [...track.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    track.append(clone);
  });

  const viewport = document.createElement('div');
  viewport.className = 'carousel-marquee-viewport';
  viewport.append(track);

  // Scroll duration is set in CSS (matches source: 15s desktop, 30s tablet/mobile).
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Image marquee');
  block.replaceChildren(viewport);
}
