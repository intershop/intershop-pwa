#!/usr/bin/env node

const fs = require('fs');

const { collectUrlScores, formatScore, loadPagesConfiguration, normalizeUrl } = require('./lighthouse-utils');

function renderAccessibilityTable(pagesDesktop, pagesMobile, resultsDesktop, resultsMobile) {
  // track if all pages pass their thresholds
  let allPass = true;

  let md = `| Page | Desktop | Mobile |\n`;
  md += `|:---|---:|---:|\n`;

  for (const url of Object.keys(pagesDesktop)) {
    const desktopResult = resultsDesktop.get(url)?.accessibility;
    const mobileResult = resultsMobile.get(url)?.accessibility;
    const desktopThreshold = pagesDesktop[url][1] || 100;
    const mobileThreshold = pagesMobile[url][1] || 100;

    // check if this page meets its thresholds
    if (!(desktopResult >= desktopThreshold) || !(mobileResult >= mobileThreshold)) {
      allPass = false;
    }

    const row = [
      pagesDesktop[url][0] || normalizeUrl(url),
      formatScore(desktopResult, resultsDesktop.get(url)?.reportUrl, desktopThreshold),
      formatScore(mobileResult, resultsMobile.get(url)?.reportUrl, mobileThreshold),
    ];
    md += `| ${row.join(' | ')} |\n`;
  }
  md += `\n`;

  if (allPass) {
    md += `✅ **All pages passed their accessibility thresholds!**\n`;
  } else {
    md += `❌ **Some pages scored below their required thresholds.**\n`;
  }

  return { md, allPass };
}

(function main() {
  const pagesDesktop = loadPagesConfiguration(
    '.github/lighthouse/configurations/accessibility-desktop.lighthouserc.json'
  );
  const pagesMobile = loadPagesConfiguration(
    '.github/lighthouse/configurations/accessibility-mobile.lighthouserc.json'
  );
  const desktopAccessibilityScores = collectUrlScores('lighthouse-desktop-accessibility');
  const mobileAccessibilityScores = collectUrlScores('lighthouse-mobile-accessibility');

  const { md, allPass } = renderAccessibilityTable(
    pagesDesktop,
    pagesMobile,
    desktopAccessibilityScores,
    mobileAccessibilityScores
  );

  let body = '## Lighthouse Accessibility Results\n\n';
  body += md;
  body += '> Click on scores to view detailed Lighthouse reports (links are valid for some days).\n';
  body += '> Detailed reports are also available as workflow artifacts.\n';

  // console.log(body);
  fs.writeFileSync('lighthouse-accessibility.md', body, 'utf8');
  // Write allPass value to file for workflow output
  fs.writeFileSync('allPass.txt', allPass.toString(), 'utf8');
})();
