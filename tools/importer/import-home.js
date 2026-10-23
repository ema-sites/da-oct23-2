/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import columnsIntroParser from './parsers/columns-intro.js';
import carouselMarqueeParser from './parsers/carousel-marquee.js';
import cardsMediaParser from './parsers/cards-media.js';
import columnsPanelParser from './parsers/columns-panel.js';
import heroCtaParser from './parsers/hero-cta.js';
import cleanupTransformer from './transformers/gehealthcare-cleanup.js';
import sectionsTransformer from './transformers/gehealthcare-sections.js';

const PAGE_TEMPLATE = {
  "name": "home",
  "urls": [
    "http://brand.gehealthcare.com/"
  ],
  "representativeUrl": "http://brand.gehealthcare.com/",
  "description": "GE HealthCare Brand Hub homepage: video hero, intro columns, photo marquees, core brand element cards, brand training panel and guidelines CTA",
  "urlPattern": "/",
  "blocks": [
    {
      "name": "hero-video",
      "instances": [
        ".home-hero-banner"
      ]
    },
    {
      "name": "columns-intro",
      "instances": [
        "#intro"
      ]
    },
    {
      "name": "carousel-marquee",
      "instances": [
        ".slider-section-wrap .marquee",
        ".slider-section-2-wrap .marquee-brand"
      ]
    },
    {
      "name": "cards-media",
      "instances": [
        ".core-brand-section .fusion-post-cards"
      ]
    },
    {
      "name": "columns-panel",
      "instances": [
        "#wide-width-section"
      ]
    },
    {
      "name": "hero-cta",
      "instances": [
        ".brand-guidelines-section"
      ]
    }
  ],
  "sections": [
    {
      "id": "rc3",
      "name": "Hero video banner",
      "selector": [
        ".home-hero-banner"
      ],
      "style": null,
      "blocks": [
        "hero-video"
      ],
      "defaultContent": []
    },
    {
      "id": "rc4",
      "name": "Brand Hub intro",
      "selector": [
        "#intro"
      ],
      "style": "light-lavender",
      "blocks": [
        "columns-intro"
      ],
      "defaultContent": []
    },
    {
      "id": "rc5",
      "name": "Photo marquee",
      "selector": [
        ".slider-section-wrap"
      ],
      "style": null,
      "blocks": [
        "carousel-marquee"
      ],
      "defaultContent": []
    },
    {
      "id": "rc6",
      "name": "Core brand elements",
      "selector": [
        ".core-brand-section"
      ],
      "style": "light-lavender, centered",
      "blocks": [
        "cards-media"
      ],
      "defaultContent": [
        ".core-brand-section .fusion-column-no-min-height"
      ]
    },
    {
      "id": "rc7",
      "name": "Brand pages marquee",
      "selector": [
        ".slider-section-2-wrap"
      ],
      "style": null,
      "blocks": [
        "carousel-marquee"
      ],
      "defaultContent": []
    },
    {
      "id": "rc8",
      "name": "Brand training",
      "selector": [
        "#wide-width-section"
      ],
      "style": "lavender-purple-gradient",
      "blocks": [
        "columns-panel"
      ],
      "defaultContent": []
    },
    {
      "id": "rc9",
      "name": "Guidelines CTA",
      "selector": [
        ".brand-guidelines-section"
      ],
      "style": null,
      "blocks": [
        "hero-cta"
      ],
      "defaultContent": []
    }
  ]
};

const parsers = {
  'hero-video': heroVideoParser,
  'columns-intro': columnsIntroParser,
  'carousel-marquee': carouselMarqueeParser,
  'cards-media': cardsMediaParser,
  'columns-panel': columnsPanelParser,
  'hero-cta': heroCtaParser,
};

const transformers = [cleanupTransformer, sectionsTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
