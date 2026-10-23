/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for brand.gehealthcare.com (WordPress / Avada "fusion" builder).
 * Selectors taken from migration-work/cleaned.html.
 */

// Non-authorable chrome removed before parsing (affects block matching).
const CHROME_SELECTORS = [
  'a.skip-link',
  '#home', // empty one-page anchor div
  '.fusion-tb-header', // header + nav + sidebar menu + sticky spacer
  '.fusion-sticky-spacer',
  '#sliders-container', // empty slider container
  '.fusion-tb-footer', // footer
  '.fusion-footer',
  'a.fusion-one-page-text-link', // page-load link
  '.avada-footer-scripts', // script container
  'section.to-top-container', // go-to-top control
  '#toTop',
  '#_evidon_banner', // cookie banner
  '#_evidon-background', // cookie overlay
  '.evidon-banner',
  '.evidon-background',
  'nav.awb-menu',
  '.searchform',
  '.fusion-search-element',
  // Hidden swiper copies of the marquee images; the visible .marquee/.marquee-brand lists are parsed instead.
  '.slider-section-wrap .fusion-image-carousel',
  '.slider-section-2-wrap .fusion-image-carousel',
];

// The source emits two sets of SEO meta tags; keep the first of each so metadata isn't merged.
function dedupeMeta(document) {
  const seen = new Set();
  document.querySelectorAll('head meta[name], head meta[property]').forEach((meta) => {
    const key = meta.getAttribute('name') || meta.getAttribute('property');
    if (seen.has(key)) meta.remove();
    else seen.add(key);
  });
}

// Section-level selectors that must never be removed as "empty".
const PROTECTED = [
  '.home-hero-banner',
  '#intro',
  '.slider-section-wrap',
  '.core-brand-section',
  '.slider-section-2-wrap',
  '#wide-width-section',
  '.brand-guidelines-section',
];

function isEmpty(el) {
  if (el.textContent.trim()) return false;
  return !el.querySelector('img, picture, video, source, iframe, svg, a[href]');
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    if (payload && payload.document) dedupeMeta(payload.document);
    WebImporter.DOMUtils.remove(element, CHROME_SELECTORS);
    WebImporter.DOMUtils.remove(element, ['script', 'style', 'noscript', 'link', 'iframe[src*="evidon"]']);

    // Empty fusion spacer rows (e.g. trailing .fusion-builder-row-4-8).
    element.querySelectorAll('.fusion-fullwidth').forEach((row) => {
      if (PROTECTED.some((sel) => row.matches(sel) || row.querySelector(sel))) return;
      if (isEmpty(row)) row.remove();
    });
  }

  if (hookName === 'afterTransform') {
    // Leftover non-authorable controls (hero play/pause toggle, any re-surfaced chrome).
    WebImporter.DOMUtils.remove(element, [
      '#toggleBtn',
      'button.custom-iocn-pause',
      '.to-top-container',
      '#_evidon_banner',
      '#_evidon-background',
      'script',
      'style',
      'noscript',
    ]);

    // Tracking / builder attributes.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        if (
          n.startsWith('on')
          || n.startsWith('data-awb')
          || n.startsWith('data-gtm')
          || n.startsWith('data-ga')
          || n === 'data-swiper-slide-index'
        ) {
          el.removeAttribute(n);
        }
      });
    });
  }
}
