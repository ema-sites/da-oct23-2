export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  const cols = [...firstRow.children];
  block.classList.add(`columns-intro-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-intro-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const onlyMedia = pic && !col.textContent.trim();
      col.classList.add(onlyMedia ? 'columns-intro-img-col' : 'columns-intro-text-col');
      if (onlyMedia) return;

      // Eyebrow: short paragraph directly before the first heading.
      const heading = col.querySelector('h1, h2, h3, h4');
      const prev = heading && heading.previousElementSibling;
      if (prev && prev.tagName === 'P' && !prev.querySelector('a, picture')) {
        prev.classList.add('columns-intro-eyebrow');
      }

      // Group consecutive button paragraphs into one row of actions.
      const buttons = [...col.querySelectorAll(':scope > p')].filter((p) => p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim());
      if (buttons.length > 1) {
        const group = document.createElement('div');
        group.className = 'columns-intro-actions';
        buttons[0].before(group);
        group.append(...buttons);
      }
    });
  });
}
