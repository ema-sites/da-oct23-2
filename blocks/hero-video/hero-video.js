const VIDEO_RE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

function findVideoLink(scope) {
  return [...scope.querySelectorAll('a[href]')].find((a) => VIDEO_RE.test(a.getAttribute('href')));
}

function buildVideo(href, poster) {
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.preload = 'metadata';
  if (poster) video.poster = poster;
  const source = document.createElement('source');
  source.src = href;
  const ext = ((href.match(VIDEO_RE) || [])[1] || 'mp4').toLowerCase();
  source.type = `video/${ext === 'mov' ? 'mp4' : ext}`;
  video.append(source);
  return video;
}

function buildToggle(video) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-video-toggle';
  const sync = () => {
    const { paused } = video;
    button.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    button.classList.toggle('is-paused', paused);
  };
  button.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();
  return button;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Media row: first row that holds a video link or a picture, when there is more than one row.
  let mediaRow = null;
  if (rows.length > 1) {
    mediaRow = rows.find((r) => findVideoLink(r) || r.querySelector('picture')) || null;
  }
  const contentRow = rows.find((r) => r !== mediaRow) || rows[0];

  const media = document.createElement('div');
  media.className = 'hero-video-media';

  const scope = mediaRow || contentRow;
  const videoLink = findVideoLink(scope);
  const picture = scope.querySelector('picture');
  let video = null;

  if (videoLink) {
    const posterImg = picture && picture.querySelector('img');
    video = buildVideo(videoLink.href, posterImg ? posterImg.currentSrc || posterImg.src : '');
    media.append(video);
    const p = videoLink.closest('p');
    if (p && p.textContent.trim() === videoLink.textContent.trim()) p.remove();
    else videoLink.remove();
    if (picture) {
      picture.classList.add('hero-video-poster');
      media.prepend(picture);
    }
  } else if (picture) {
    media.append(picture);
  }

  const content = document.createElement('div');
  content.className = 'hero-video-content';
  const cell = contentRow.querySelector(':scope > div') || contentRow;
  if (contentRow !== mediaRow) content.append(...cell.childNodes);

  // Eyebrow: a short paragraph directly before the main heading.
  const heading = content.querySelector('h1, h2, h3');
  if (heading) {
    const prev = heading.previousElementSibling;
    if (prev && prev.tagName === 'P' && !prev.querySelector('a, picture')) prev.classList.add('hero-video-eyebrow');
  }

  // Jump link: an in-page anchor (#...) becomes the scroll-down link.
  const jump = [...content.querySelectorAll('a[href]')].find((a) => a.getAttribute('href').startsWith('#'));
  let jumpWrap = null;
  if (jump) {
    jump.classList.remove('button');
    jump.classList.add('hero-video-jump');
    const holder = jump.closest('p, .button-container');
    jumpWrap = document.createElement('div');
    jumpWrap.className = 'hero-video-jump-wrap';
    jumpWrap.append(jump);
    jump.removeAttribute('title');
    // Fall back to the next section when the in-page target does not exist.
    jump.addEventListener('click', (e) => {
      const id = decodeURIComponent(jump.getAttribute('href').slice(1));
      if (id && document.getElementById(id)) return;
      const next = block.closest('.section')?.nextElementSibling;
      if (next) {
        e.preventDefault();
        next.scrollIntoView({ behavior: 'smooth' });
      }
    });
    if (holder && !holder.textContent.trim()) holder.remove();
  }

  // Remove empty paragraphs left behind.
  content.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img')) p.remove();
  });

  const children = [media, content];
  if (video) children.push(buildToggle(video));
  if (jumpWrap) children.push(jumpWrap);
  block.replaceChildren(...children);
  if (!media.children.length) {
    media.remove();
    block.classList.add('no-media');
  }
}
