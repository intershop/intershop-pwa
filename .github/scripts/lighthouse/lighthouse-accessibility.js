#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const { parseArgs, agg, collectFilesRec, normalizeUrl, fmt } = require('./lighthouse-utils');

// Load threshold configuration from lighthouserc config files
function loadThresholdsFromConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(content);
    // Extract thresholds and pageNames from the config
    const urlConfig = config.urlConfig || {};
    const thresholds = { default: 100 };
    const pageNames = {};

    for (const [url, configArray] of Object.entries(urlConfig)) {
      if (Array.isArray(configArray) && configArray.length >= 2) {
        // Format: ["name", threshold]
        const [name, threshold] = configArray;
        if (typeof name === 'string') {
          pageNames[url] = name;
        }
        if (typeof threshold === 'number') {
          thresholds[url] = threshold;
        }
      }
    }

    return {
      default: thresholds.default || 100,
      thresholds,
      pageNames,
    };
  } catch (error) {
    console.warn(`Warning: Could not load thresholds from ${configPath}, using default (100)`);
    return { default: 100, thresholds: {}, pageNames: {} };
  }
}

/**
 * Get the accessibility threshold for a given URL.
 * First tries exact match, then tries normalized URL match, finally falls back to default.
 * @param {Object} thresholdConfig - Configuration object with 'default' and 'thresholds' properties
 * @param {string} url - The URL to look up
 * @returns {number} The threshold value (0-100)
 */
function getThreshold(thresholdConfig, url) {
  // Check if there's a specific threshold for this URL (exact match)
  if (typeof thresholdConfig.thresholds[url] === 'number') {
    return thresholdConfig.thresholds[url];
  }

  // Try to match by checking if any threshold key ends with this path
  // This handles cases where config has full URLs but we're matching against paths
  for (const [key, value] of Object.entries(thresholdConfig.thresholds)) {
    if (key !== 'default' && typeof value === 'number') {
      const normalizedKey = normalizeUrl(key);
      if (normalizedKey === url) {
        return value;
      }
    }
  }

  // Fallback to default
  return thresholdConfig.default || 100;
}

function collectScoresPerUrl(dir, aggregate = 'median') {
  if (!dir || !fs.existsSync(dir)) return [];
  const files = fs.statSync(dir).isDirectory()
    ? collectFilesRec(dir)
    : /^lhr-.*\.json$/i.test(path.basename(dir))
    ? [dir]
    : [];
  if (!files.length) return [];

  const perUrlCatRuns = new Map();

  // Read report URLs from links.json
  const perUrlReportLinks = new Map();
  const linksFile = path.join(dir, 'links.json');
  if (fs.existsSync(linksFile)) {
    try {
      const links = JSON.parse(fs.readFileSync(linksFile, 'utf8'));
      for (const [url, reportUrl] of Object.entries(links)) {
        perUrlReportLinks.set(url, reportUrl);
      }
    } catch (e) {
      // links.json not found or invalid, continue without report URLs
    }
  }

  for (const f of files) {
    let report;
    try {
      report = JSON.parse(fs.readFileSync(f, 'utf8'));
    } catch (e) {
      console.warn(`Warning: Could not parse Lighthouse report file ${f}: ${e.message}`);
      continue;
    }
    const url = report.requestedUrl || report.finalDisplayedUrl || report.finalUrl || 'unknown';
    const cats = report.categories || {};

    if (!perUrlCatRuns.has(url)) perUrlCatRuns.set(url, {});
    const catRuns = perUrlCatRuns.get(url);

    for (const [k, v] of Object.entries(cats)) {
      const score = typeof v.score === 'number' ? v.score * 100 : undefined;
      if (typeof score === 'number') {
        catRuns[k] = catRuns[k] || [];
        catRuns[k].push(score);
      }
    }
  }

  const perUrlAgg = [];
  for (const [url, catRuns] of perUrlCatRuns.entries()) {
    const aggCats = {};
    for (const [k, arr] of Object.entries(catRuns)) {
      const val = agg(arr, aggregate);
      if (typeof val === 'number') aggCats[k] = Math.round(val);
    }
    perUrlAgg.push({ url, cats: aggCats, reportUrl: perUrlReportLinks.get(url) });
  }

  perUrlAgg.sort((a, b) => (a.url > b.url ? 1 : a.url < b.url ? -1 : 0));
  return perUrlAgg;
}

function pageLabel(u, pageNames = {}) {
  const p = normalizeUrl(u);

  // Check if we have a friendly name for this URL in the config
  if (pageNames[u]) {
    return pageNames[u];
  }

  // Fallback to the normalized URL or original URL
  return p || u || 'unknown';
}

function colorEmoji(score, threshold = 100) {
  if (typeof score !== 'number') return '⚪';
  if (score >= threshold) return '🟢';
  return '🔴';
}

/**
 * Helper function to check if a score meets the threshold requirement.
 * @param {number} score - The score to check
 * @param {number} threshold - The threshold value
 * @returns {boolean} True if score meets or exceeds threshold
 */
function doesScoreMeetThreshold(score, threshold) {
  return typeof score === 'number' && Math.round(score) >= threshold;
}

function renderAccessibilityTable(title, deskCurr, mobCurr, desktopThresholds, mobileThresholds, pageNames = {}) {
  const mapData = list => {
    const m = new Map();
    for (const e of list || []) {
      const score = e.cats?.accessibility;
      m.set(e.url, {
        score: typeof score === 'number' ? Math.round(score) : undefined,
        reportUrl: e.reportUrl,
      });
    }
    return m;
  };

  const dC = mapData(deskCurr);
  const mC = mapData(mobCurr);

  // Get all unique URLs and sort by config file order
  const allUrls = Array.from(new Set([...dC.keys(), ...mC.keys()]));
  const configUrls = Object.keys(pageNames);
  const urls = allUrls.sort((a, b) => {
    const aIndex = configUrls.indexOf(a);
    const bIndex = configUrls.indexOf(b);
    // If both are in config, sort by config order
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    // If only one is in config, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // If neither is in config, sort alphabetically
    return a.localeCompare(b);
  });
  if (!urls.length) return '';

  let md = `### ${title}\n\n`;
  md += `| Page | Desktop | Mobile |\n`;
  md += `|---|---:|---:|\n`;

  let allPass = true;
  for (const u of urls) {
    const dData = dC.get(u) || {};
    const mData = mC.get(u) || {};
    const dCurr = dData.score;
    const mCurr = mData.score;
    const dLink = dData.reportUrl;
    const mLink = mData.reportUrl;

    const dThreshold = getThreshold(desktopThresholds, u);
    const mThreshold = getThreshold(mobileThresholds, u);

    if (!doesScoreMeetThreshold(dCurr, dThreshold)) allPass = false;
    if (!doesScoreMeetThreshold(mCurr, mThreshold)) allPass = false;

    const pageName = pageLabel(u, pageNames);

    const formatCell = (score, threshold, link) => {
      const emoji = colorEmoji(score, threshold);
      const scoreText = fmt(score);
      const thresholdText = threshold < 100 ? ` (≥${threshold}%)` : '';
      const linkedScore = link ? `[${scoreText}](${link})` : scoreText;
      return `${emoji} ${linkedScore}${thresholdText}`.trim();
    };

    const desktopCell = formatCell(dCurr, dThreshold, dLink);
    const mobileCell = formatCell(mCurr, mThreshold, mLink);

    const row = [pageName, desktopCell, mobileCell];
    md += `| ${row.join(' | ')} |\n`;
  }
  md += `\n`;

  if (allPass) {
    md += `✅ **All pages passed their accessibility thresholds!**\n\n`;
  } else {
    md += `❌ **Some pages scored below their required thresholds.**\n\n`;
  }

  return md;
}

function checkAllScores(deskCurr, mobCurr, desktopThresholds, mobileThresholds) {
  const checkList = (list, thresholds) => {
    for (const e of list || []) {
      const score = e.cats?.accessibility;
      if (typeof score === 'number') {
        const threshold = getThreshold(thresholds, e.url);
        if (!doesScoreMeetThreshold(score, threshold)) {
          return false;
        }
      }
    }
    return true;
  };

  const dPass = checkList(deskCurr, desktopThresholds);
  const mPass = checkList(mobCurr, mobileThresholds);

  return dPass && mPass;
}

(function main() {
  const args = parseArgs(process.argv.slice(2));

  const paths = {
    currentDesktop: args['current-desktop'] || 'current-desktop',
    currentMobile: args['current-mobile'] || 'current-mobile',
    out: args.out || 'lighthouse-accessibility-comparison.md',
    desktopConfig:
      args['desktop-config'] || path.join(__dirname, '../../lighthouse/accessibility-desktop.lighthouserc.json'),
    mobileConfig:
      args['mobile-config'] || path.join(__dirname, '../../lighthouse/accessibility-mobile.lighthouserc.json'),
  };
  const aggregate = args.aggregate || 'median';

  const desktopThresholds = loadThresholdsFromConfig(paths.desktopConfig);
  const mobileThresholds = loadThresholdsFromConfig(paths.mobileConfig);
  const perUrlCurrentDesktop = collectScoresPerUrl(paths.currentDesktop, aggregate);
  const perUrlCurrentMobile = collectScoresPerUrl(paths.currentMobile, aggregate);

  const hasPerUrl = arr => Array.isArray(arr) && arr.length > 0;

  let body = '## Lighthouse Accessibility Results\n\n';

  if (hasPerUrl(perUrlCurrentDesktop) || hasPerUrl(perUrlCurrentMobile)) {
    body += renderAccessibilityTable(
      'Accessibility Scores',
      perUrlCurrentDesktop,
      perUrlCurrentMobile,
      desktopThresholds,
      mobileThresholds,
      { ...desktopThresholds.pageNames, ...mobileThresholds.pageNames }
    );
  } else {
    body += 'No accessibility results found.\n\n';
  }

  body += '🎯 **Target:** All pages must meet or exceed their configured accessibility thresholds.\n\n';
  body +=
    '> Click on scores to view detailed Lighthouse reports (links valid for 3-5 days). Detailed reports are also available as workflow artifacts.\n';

  fs.writeFileSync(paths.out, body, 'utf8');
  console.log(body);

  // Check if all pages passed their thresholds and exit with appropriate code
  const allPass = checkAllScores(perUrlCurrentDesktop, perUrlCurrentMobile, desktopThresholds, mobileThresholds);

  if (!allPass) {
    console.error('\n❌ ACCESSIBILITY CHECK FAILED: Some pages scored below their required thresholds');
    process.exit(1);
  } else {
    console.log('\n✅ ACCESSIBILITY CHECK PASSED: All pages met or exceeded their thresholds!');
  }
})();
