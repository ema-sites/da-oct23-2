export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  const cols = [...firstRow.children];
  block.classList.add(`columns-panel-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-panel-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const onlyMedia = pic && !col.textContent.trim();
      col.classList.add(onlyMedia ? 'columns-panel-img-col' : 'columns-panel-text-col');
      if (onlyMedia) return;

      const heading = col.querySelector('h1, h2, h3, h4');
      const prev = heading && heading.previousElementSibling;
      if (prev && prev.tagName === 'P' && !prev.querySelector('a, picture')) {
        prev.classList.add('columns-panel-eyebrow');
      }
    });
  });
}
