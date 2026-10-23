/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const cells = [];
    const mediaCell = [];
    const video = element.querySelector(".fullwidth-video video, video");
    const source = video && (video.querySelector("source[src]") || (video.getAttribute("src") ? video : null));
    const videoSrc = source ? source.getAttribute("src") : "";
    const poster = video ? video.getAttribute("poster") : "";
    if (poster) {
      const img = document.createElement("img");
      img.src = poster;
      img.alt = "";
      mediaCell.push(img);
    }
    if (videoSrc) {
      const a = document.createElement("a");
      a.href = videoSrc;
      a.textContent = videoSrc;
      mediaCell.push(a);
    }
    if (mediaCell.length) cells.push([mediaCell]);
    const contentCell = [];
    const eyebrowSrc = element.querySelector(".eyebrow-heading .fusion-title-heading");
    if (eyebrowSrc && eyebrowSrc.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrowSrc.textContent.trim();
      contentCell.push(p);
    }
    const heading = element.querySelector("h1") || element.querySelector("h2");
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.push(h1);
    }
    const jump = element.querySelector(".explore-the-brand a[href], a.explore-btn-arrow[href]");
    if (jump) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = jump.getAttribute("href");
      a.textContent = jump.textContent.trim();
      p.append(a);
      contentCell.push(p);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-intro.js
  function buildButton(document, srcLink) {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = srcLink.getAttribute("href");
    a.textContent = srcLink.textContent.trim();
    const isOutline = /outline/.test(srcLink.className || "");
    const wrap = document.createElement(isOutline ? "em" : "strong");
    wrap.append(a);
    p.append(wrap);
    return p;
  }
  function parse2(element, { document }) {
    const cells = [];
    const textCol = element.querySelector("#intro-jump") || element.querySelector(".fusion-layout-column");
    const textCell = [];
    if (textCol) {
      const eyebrow = textCol.querySelector(".eyebrow-heading .fusion-title-heading");
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textCell.push(p);
      }
      const heading = textCol.querySelector("h1, h2, h3");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        textCell.push(h2);
      }
      textCol.querySelectorAll(".fusion-text p").forEach((p) => {
        if (p.textContent.trim()) textCell.push(p);
      });
      textCol.querySelectorAll("a.fusion-button[href]").forEach((a) => {
        textCell.push(buildButton(document, a));
      });
    }
    const imageCell = [];
    const imgCol = element.querySelector("#intoImg") || element;
    const img = imgCol.querySelector("img");
    if (img) imageCell.push(img);
    cells.push([textCell, imageCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-marquee.js
  function parse3(element, { document }) {
    const cells = [];
    const content = element.querySelector(":scope > .marquee-content, :scope > .marquee-brand-content") || element;
    const seen = /* @__PURE__ */ new Set();
    content.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || img.src;
      if (!src) return;
      let key = src;
      try {
        key = new URL(src, document.baseURI).href;
      } catch (e) {
      }
      if (seen.has(key)) return;
      seen.add(key);
      if (!img.hasAttribute("alt")) img.setAttribute("alt", "");
      cells.push([img]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-marquee", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-media.js
  function parse4(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll("ul.fusion-grid > li.post-card");
    cards.forEach((card) => {
      const mediaCell = [];
      const mediaCol = card.querySelector(".brand-foundation-card-image") || card;
      const img = mediaCol.querySelector("img");
      const source = mediaCol.querySelector("video source[src], video[src]");
      if (img) {
        if (!img.hasAttribute("alt")) img.setAttribute("alt", "");
        mediaCell.push(img);
      } else if (source) {
        const src = source.getAttribute("src");
        const a = document.createElement("a");
        a.href = src;
        a.textContent = src;
        mediaCell.push(a);
      }
      const contentCell = [];
      const heading = card.querySelector("h3, h2, h4");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentCell.push(h3);
      }
      card.querySelectorAll(".fusion-text p").forEach((p) => {
        if (p.textContent.trim()) contentCell.push(p);
      });
      const cta = card.querySelector("a.fusion-button[href]");
      const anchor = card.querySelector("a.fusion-column-anchor[href]");
      const href = cta && cta.getAttribute("href") || anchor && anchor.getAttribute("href");
      if (href) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = cta && cta.textContent.trim() || "Learn more";
        p.append(a);
        contentCell.push(p);
      }
      cells.push([mediaCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-panel.js
  function buildButton2(document, srcLink) {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = srcLink.getAttribute("href");
    a.textContent = srcLink.textContent.trim();
    const isOutline = /outline/.test(srcLink.className || "");
    const wrap = document.createElement(isOutline ? "em" : "strong");
    wrap.append(a);
    p.append(wrap);
    return p;
  }
  function parse5(element, { document }) {
    const cells = [];
    const imageCell = [];
    const imgCol = element.querySelector(".brand-training-image-box") || element;
    const img = imgCol.querySelector("img");
    if (img) imageCell.push(img);
    const textCell = [];
    const textCol = element.querySelector(".brand-training-wrap") || element;
    const eyebrow = textCol.querySelector(".eyebrow-heading .fusion-title-heading");
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      textCell.push(p);
    }
    const heading = textCol.querySelector("h1, h2, h3");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      textCell.push(h2);
    }
    textCol.querySelectorAll(".fusion-text p").forEach((p) => {
      if (p.textContent.trim()) textCell.push(p);
    });
    textCol.querySelectorAll("a.fusion-button[href]").forEach((a) => {
      textCell.push(buildButton2(document, a));
    });
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-panel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse6(element, { document }) {
    const cells = [];
    let bgImg = element.querySelector(":scope > img");
    if (!bgImg) {
      const styled = [element, ...element.querySelectorAll('[style*="background"]')].find((el) => /url\(/.test(el.getAttribute("style") || ""));
      if (styled) {
        const m = (styled.getAttribute("style") || "").match(/url\((['"]?)([^'")]+)\1\)/);
        if (m) {
          bgImg = document.createElement("img");
          bgImg.src = m[2];
        }
      }
    }
    if (bgImg) {
      if (!bgImg.hasAttribute("alt")) bgImg.setAttribute("alt", "");
      cells.push([[bgImg]]);
    }
    const contentCell = [];
    const heading = element.querySelector("h2, h1, h3");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }
    element.querySelectorAll(".fusion-text p").forEach((p) => {
      if (p.textContent.trim()) contentCell.push(p);
    });
    const cta = element.querySelector("a.fusion-button[href]");
    if (cta) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      const a = document.createElement("a");
      a.href = cta.getAttribute("href");
      a.textContent = cta.textContent.trim();
      strong.append(a);
      p.append(strong);
      contentCell.push(p);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/gehealthcare-cleanup.js
  var CHROME_SELECTORS = [
    "a.skip-link",
    "#home",
    // empty one-page anchor div
    ".fusion-tb-header",
    // header + nav + sidebar menu + sticky spacer
    ".fusion-sticky-spacer",
    "#sliders-container",
    // empty slider container
    ".fusion-tb-footer",
    // footer
    ".fusion-footer",
    "a.fusion-one-page-text-link",
    // page-load link
    ".avada-footer-scripts",
    // script container
    "section.to-top-container",
    // go-to-top control
    "#toTop",
    "#_evidon_banner",
    // cookie banner
    "#_evidon-background",
    // cookie overlay
    ".evidon-banner",
    ".evidon-background",
    "nav.awb-menu",
    ".searchform",
    ".fusion-search-element",
    // Hidden swiper copies of the marquee images; the visible .marquee/.marquee-brand lists are parsed instead.
    ".slider-section-wrap .fusion-image-carousel",
    ".slider-section-2-wrap .fusion-image-carousel"
  ];
  function dedupeMeta(document) {
    const seen = /* @__PURE__ */ new Set();
    document.querySelectorAll("head meta[name], head meta[property]").forEach((meta) => {
      const key = meta.getAttribute("name") || meta.getAttribute("property");
      if (seen.has(key)) meta.remove();
      else seen.add(key);
    });
  }
  var PROTECTED = [
    ".home-hero-banner",
    "#intro",
    ".slider-section-wrap",
    ".core-brand-section",
    ".slider-section-2-wrap",
    "#wide-width-section",
    ".brand-guidelines-section"
  ];
  function isEmpty(el) {
    if (el.textContent.trim()) return false;
    return !el.querySelector("img, picture, video, source, iframe, svg, a[href]");
  }
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      if (payload && payload.document) dedupeMeta(payload.document);
      WebImporter.DOMUtils.remove(element, CHROME_SELECTORS);
      WebImporter.DOMUtils.remove(element, ["script", "style", "noscript", "link", 'iframe[src*="evidon"]']);
      element.querySelectorAll(".fusion-fullwidth").forEach((row) => {
        if (PROTECTED.some((sel) => row.matches(sel) || row.querySelector(sel))) return;
        if (isEmpty(row)) row.remove();
      });
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "#toggleBtn",
        "button.custom-iocn-pause",
        ".to-top-container",
        "#_evidon_banner",
        "#_evidon-background",
        "script",
        "style",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("on") || n.startsWith("data-awb") || n.startsWith("data-gtm") || n.startsWith("data-ga") || n === "data-swiper-slide-index") {
            el.removeAttribute(n);
          }
        });
      });
    }
  }

  // tools/importer/transformers/gehealthcare-sections.js
  var MARKER = "data-excat-section-id";
  function findSectionEl(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    const document = element.ownerDocument || payload.document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionEl(element, section);
        if (!el) continue;
        if (i === 0 && !section.style) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(MARKER, section.id);
        if (i === 0) hr.setAttribute("data-excat-first-section", "true");
        el.parentNode.insertBefore(hr, el);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        if (!marker) continue;
        let last = marker;
        let next = marker.nextSibling;
        while (next && !(next.nodeType === 1 && next.tagName === "HR")) {
          last = next;
          next = next.nextSibling;
        }
        const metadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        last.parentNode.insertBefore(metadata, last.nextSibling);
        if (marker.hasAttribute("data-excat-first-section")) {
          marker.remove();
        } else {
          marker.removeAttribute(MARKER);
        }
      }
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "hero-video": parse,
    "columns-intro": parse2,
    "carousel-marquee": parse3,
    "cards-media": parse4,
    "columns-panel": parse5,
    "hero-cta": parse6
  };
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
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
  var import_home_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
