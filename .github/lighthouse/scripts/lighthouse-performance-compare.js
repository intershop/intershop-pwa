#!/usr/bin/env node

const fs = require('fs');

const {
  collectUrlScores,
  formatDelta,
  formatScore,
  loadPagesConfiguration,
  normalizeUrl,
} = require('./lighthouse-utils');

function renderPagePerformanceTable(pages, deskBase, deskCurr, mobBase, mobCurr, mobNoBannerBase, mobNoBannerCurr) {
  let md = `| Page | | Desktop | Δ | | Mobile | Δ | | Mobile (returning user) | Δ |\n`;
  md += `|:---|---|---:|---:|---|---:|---:|---|---:|---:|\n`;

  for (const url of Object.keys(pages)) {
    const row = [
      pages[url][0] || normalizeUrl(url),
      '',
      formatScore(deskCurr.get(url)?.performance, deskCurr.get(url)?.reportUrl),
      formatDelta(deskCurr.get(url)?.performance, deskBase.get(url)?.performance, 3),
      '',
      formatScore(mobCurr.get(url)?.performance, mobCurr.get(url)?.reportUrl),
      formatDelta(mobCurr.get(url)?.performance, mobBase.get(url)?.performance, 3),
      '',
      formatScore(mobNoBannerCurr.get(url)?.performance, mobNoBannerCurr.get(url)?.reportUrl),
      formatDelta(mobNoBannerCurr.get(url)?.performance, mobNoBannerBase.get(url)?.performance, 3),
    ];
    md += `| ${row.join(' | ')} |\n`;
  }
  md += `\n`;
  return md;
}

(function main() {
  const pages = loadPagesConfiguration('.github/lighthouse/configurations/performance-desktop.lighthouserc.json');
  const desktopBaselineScores = collectUrlScores('lighthouse-desktop-baseline');
  const desktopCurrentScores = collectUrlScores('lighthouse-desktop-current');
  const mobileBaselineScores = collectUrlScores('lighthouse-mobile-baseline');
  const mobileCurrentScores = collectUrlScores('lighthouse-mobile-current');
  const mobileNoBannerBaselineScores = collectUrlScores('lighthouse-mobile-no-banner-baseline');
  const mobileNoBannerCurrentScores = collectUrlScores('lighthouse-mobile-no-banner-current');

  let body = '### Lighthouse Performance Score Comparison\n\n';

  body += renderPagePerformanceTable(
    pages,
    desktopBaselineScores,
    desktopCurrentScores,
    mobileBaselineScores,
    mobileCurrentScores,
    mobileNoBannerBaselineScores,
    mobileNoBannerCurrentScores
  );

  body += '> Click on scores to view detailed Lighthouse reports (links are valid for some days).\n';
  body += '> Detailed reports are also available as workflow artifacts.\n';
  body += '> Baseline reports are available as workflow artifacts from the develop branch.\n';

  // console.log(body);
  fs.writeFileSync('lighthouse-performance-comparison.md', body, 'utf8');
})();
