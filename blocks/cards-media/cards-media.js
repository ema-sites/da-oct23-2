import { createOptimizedPicture } from '../../scripts/aem.js';

const VIDEO_RE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

function buildVideo(href) {
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.preload = 'metadata';
  const source = document.createElement('source');
  source.src = href;
  source.type = 'video/mp4';
  video.append(source);
  return video;
}

function isMediaCell(div) {
  if (div.querySelector('picture') && !div.textContent.trim()) return true;
  const links = [...div.querySelectorAll('a[href]')];
  return links.length === 1 && VIDEO_RE.test(links[0].getAttribute('href'))
    && !div.querySelector('h1, h2, h3, h4, h5, h6');
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (isMediaCell(div)) {
        div.className = 'cards-media-card-media';
        const link = div.querySelector('a[href]');
        if (link && VIDEO_RE.test(link.getAttribute('href'))) {
          const video = buildVideo(link.href);
          const pic = div.querySelector('picture');
          if (pic) {
            const img = pic.querySelector('img');
            if (img) video.poster = img.src;
          }
          div.replaceChildren(video);
          div.classList.add('is-video');
        }
      } else {
        div.className = 'cards-media-card-body';
      }
    });
    // Remove empty cells authors left behind.
    [...li.children].forEach((div) => {
      if (!div.children.length && !div.textContent.trim()) div.remove();
    });
    if (li.children.length) ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
