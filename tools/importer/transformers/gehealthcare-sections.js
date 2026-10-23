/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for brand.gehealthcare.com.
 * beforeTransform: insert <hr> section breaks (marked when the section is styled)
 * while the original section elements still exist.
 * afterTransform: add Section Metadata blocks after the marked breaks.
 */

const MARKER = 'data-excat-section-id';

function findSectionEl(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector, try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;
  const document = element.ownerDocument || payload.document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionEl(element, section);
      if (!el) continue;
      if (i === 0 && !section.style) continue;
      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(MARKER, section.id);
      if (i === 0) hr.setAttribute('data-excat-first-section', 'true');
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
      if (!marker) continue;

      // Find the last node of this section: everything up to the next <hr>.
      let last = marker;
      let next = marker.nextSibling;
      while (next && !(next.nodeType === 1 && next.tagName === 'HR')) {
        last = next;
        next = next.nextSibling;
      }
      const metadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      last.parentNode.insertBefore(metadata, last.nextSibling);

      if (marker.hasAttribute('data-excat-first-section')) {
        marker.remove();
      } else {
        marker.removeAttribute(MARKER);
      }
    }
  }
}
