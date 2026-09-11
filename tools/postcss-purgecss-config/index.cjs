'use strict';

const purgeCssModule = require('@fullhuman/postcss-purgecss');

const purgeCss = purgeCssModule.default ?? purgeCssModule;
const purgeCssEnabled = /^(1|true)$/i.test(process.env.PURGE_CSS ?? '');

/**
 * Keeps PurgeCSS opt-in so development builds retain fast rebuilds and the complete CSS surface.
 */
function intershopPurgeCss(options = {}) {
  if (!purgeCssEnabled) {
    return { postcssPlugin: 'intershop-purgecss-disabled' };
  }

  return purgeCss({
    content: ['./src/index.html', './**/src/app/**/!(*.spec.ts)*'],
    safelist: {
      standard: [/(?:(?:(m|p)(t|b|s|e|x|y)?(-(sm|md|lg|xl))?-([0-5]|auto))|((w|h)-(25|50|75|100|auto)))/],
      greedy: [
        /\bmodal\b/,
        /\bdrop/,
        /\bswiper\b/,
        /\bcarousel\b/,
        /\bslide\b/,
        /\bnav-tabs\b/,
        /\bnav-link\b/,
        /\bpopover\b/,
        /\btable\b/,
        /\bng-select\b/,
        /\btoast\b/,
        /\btext-\b/,
        /\bcategory-level\d+\b/,
        /\bfilter-layer\d+\b/,
      ],
    },
    ...options,
  });
}

intershopPurgeCss.postcss = true;

module.exports = intershopPurgeCss;
