export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  let mediaRow = null;
  if (rows.length > 1) mediaRow = rows.find((r) => r.querySelector('picture')) || null;
  const contentRow = rows.find((r) => r !== mediaRow) || rows[0];

  const media = document.createElement('div');
  media.className = 'hero-cta-media';
  const picture = (mediaRow || contentRow).querySelector('picture');
  if (picture) {
    const holder = picture.closest('p');
    media.append(picture);
    if (holder && !holder.textContent.trim() && !holder.children.length) holder.remove();
  }

  const content = document.createElement('div');
  content.className = 'hero-cta-content';
  if (contentRow !== mediaRow) {
    const cell = contentRow.querySelector(':scope > div') || contentRow;
    content.append(...cell.childNodes);
  }
  content.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img')) p.remove();
  });

  block.replaceChildren(...(media.children.length ? [media, content] : [content]));
  if (!media.children.length) block.classList.add('no-media');
}
