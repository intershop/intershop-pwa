#!/usr/bin/env node

const fs = require('fs');

const { collectUrlScores, formatScore, loadPagesConfiguration, normalizeUrl } = require('./lighthouse-utils');

function renderPagePerformanceTable(pages, deskBase, mobBase) {
  let md = `| Page | Desktop | Mobile |\n`;
  md += `|:---|---:|---:|\n`;

  for (const url of Object.keys(pages)) {
    const row = [
      pages[url][0] || normalizeUrl(url),
      formatScore(deskBase.get(url).performance, deskBase.get(url).reportUrl),
      formatScore(mobBase.get(url).performance, mobBase.get(url).reportUrl),
    ];
    md += `| ${row.join(' | ')} |\n`;
  }
  md += `\n`;
  return md;
}

(function main() {
  const pages = loadPagesConfiguration('.github/lighthouse/configurations/performance-desktop.lighthouserc.json');
  const desktopBaselineScores = collectUrlScores('lighthouse-desktop-baseline');
  const mobileBaselineScores = collectUrlScores('lighthouse-mobile-baseline');

  let body = '### Lighthouse Performance Score\n\n';

  body += renderPagePerformanceTable(pages, desktopBaselineScores, mobileBaselineScores);

  body += '> Click on scores to view detailed Lighthouse reports (links are valid for some days).\n';
  body += '> Detailed reports are also available as workflow artifacts.\n';

  // console.log(body);
  fs.writeFileSync('lighthouse-performance-baseline.md', body, 'utf8');
})();
