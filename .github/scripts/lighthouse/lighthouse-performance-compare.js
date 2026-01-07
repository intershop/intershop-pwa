#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const { parseArgs, agg, collectFilesRec, normalizeUrl, fmt } = require('./lighthouse-utils');

function collectScoresPerUrl(dir, aggregate = 'median') {
  if (!dir || !fs.existsSync(dir)) return [];
  const files = fs.statSync(dir).isDirectory()
    ? collectFilesRec(dir)
    : /^lhr-.*\.json$/i.test(path.basename(dir))
    ? [dir]
    : [];
  if (!files.length) return [];

  const perUrlCatRuns = new Map();

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
    perUrlAgg.push({ url, cats: aggCats });
  }

  perUrlAgg.sort((a, b) => (a.url > b.url ? 1 : a.url < b.url ? -1 : 0));
  return perUrlAgg;
}

// Load configuration from lighthouserc config files
function loadConfigFromFile(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(content);
    // Extract pageNames from the config
    const urlConfig = config.urlConfig || {};
    const pageNames = {};

    for (const [url, configArray] of Object.entries(urlConfig)) {
      if (Array.isArray(configArray) && configArray.length >= 1) {
        // Format: ["name"] for performance configs
        const [name] = configArray;
        if (typeof name === 'string') {
          pageNames[url] = name;
        }
      }
    }

    return {
      pageNames,
    };
  } catch (error) {
    console.warn(`Warning: Could not load config from ${configPath}, using empty config`);
    return { pageNames: {} };
  }
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

function colorEmoji(score) {
  if (typeof score !== 'number') return '';
  if (score >= 90) return '🟩';
  if (score >= 50) return '🟨';
  return '🟥';
}

function fmtDelta(curr, base) {
  if (typeof curr !== 'number' || typeof base !== 'number') return '-';
  const diff = curr - base;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff}`;
}

function deltaEmojiFrom(curr, base) {
  if (typeof curr !== 'number' || typeof base !== 'number') return '';
  const diff = curr - base;
  if (diff > 0) return '🟢';
  if (diff < 0) return '🔴';
  return '➖';
}

function renderPerPagePerformanceTable(title, deskBase, deskCurr, mobBase, mobCurr, labels, pageNames = {}) {
  const currentLabel = labels?.current || 'Current';

  const mapScores = list => {
    const m = new Map();
    for (const e of list || []) {
      const perf = e.cats?.performance;
      m.set(e.url, typeof perf === 'number' ? Math.round(perf) : undefined);
    }
    return m;
  };

  const dB = mapScores(deskBase);
  const dC = mapScores(deskCurr);
  const mB = mapScores(mobBase);
  const mC = mapScores(mobCurr);

  // Get all unique URLs and sort by config file order
  const allUrls = Array.from(new Set([...dB.keys(), ...dC.keys(), ...mB.keys(), ...mC.keys()]));
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
  md += `| Page | Desktop ${currentLabel} | Δ Desktop | Mobile ${currentLabel} | Δ Mobile |\n`;
  md += `|---|---:|---:|---:|---:|\n`;
  for (const u of urls) {
    const dBase = dB.get(u);
    const dCurr = dC.get(u);
    const mBase = mB.get(u);
    const mCurr = mC.get(u);
    const row = [
      pageLabel(u, pageNames),
      `${colorEmoji(dCurr)} ${fmt(dCurr)}`.trim(),
      `${deltaEmojiFrom(dCurr, dBase)} ${fmtDelta(dCurr, dBase)}`.trim(),
      `${colorEmoji(mCurr)} ${fmt(mCurr)}`.trim(),
      `${deltaEmojiFrom(mCurr, mBase)} ${fmtDelta(mCurr, mBase)}`.trim(),
    ];
    md += `| ${row.join(' | ')} |\n`;
  }
  md += `\n`;
  return md;
}

(function main() {
  const args = parseArgs(process.argv.slice(2));
  const paths = {
    baselineDesktop: args['baseline-desktop'] || 'baseline-desktop',
    currentDesktop: args['current-desktop'] || 'current-desktop',
    baselineMobile: args['baseline-mobile'] || 'baseline-mobile',
    currentMobile: args['current-mobile'] || 'current-mobile',
    out: args.out || 'lighthouse-performance-comparison.md',
    desktopConfig:
      args['desktop-config'] || path.join(__dirname, '../../lighthouse/performance-desktop.lighthouserc.json'),
    mobileConfig:
      args['mobile-config'] || path.join(__dirname, '../../lighthouse/performance-mobile.lighthouserc.json'),
  };
  const aggregate = args.aggregate || 'median';

  const desktopConfig = loadConfigFromFile(paths.desktopConfig);
  const mobileConfig = loadConfigFromFile(paths.mobileConfig);
  const perUrlBaselineDesktop = collectScoresPerUrl(paths.baselineDesktop, aggregate);
  const perUrlCurrentDesktop = collectScoresPerUrl(paths.currentDesktop, aggregate);
  const perUrlBaselineMobile = collectScoresPerUrl(paths.baselineMobile, aggregate);
  const perUrlCurrentMobile = collectScoresPerUrl(paths.currentMobile, aggregate);

  const hasPerUrl = arr => Array.isArray(arr) && arr.length > 0;

  let body = '## Lighthouse Comparison\n\n';
  if (
    hasPerUrl(perUrlBaselineDesktop) ||
    hasPerUrl(perUrlCurrentDesktop) ||
    hasPerUrl(perUrlBaselineMobile) ||
    hasPerUrl(perUrlCurrentMobile)
  ) {
    body += renderPerPagePerformanceTable(
      'Per Page (Performance)',
      perUrlBaselineDesktop,
      perUrlCurrentDesktop,
      perUrlBaselineMobile,
      perUrlCurrentMobile,
      {
        baseline: 'Baseline',
        current: 'Current',
      },
      { ...desktopConfig.pageNames, ...mobileConfig.pageNames }
    );
  } else {
    body += 'No page-level results found.\n\n';
  }
  body +=
    '> Detailed reports are available as workflow artifacts (baseline from the develop branch and current runs of this PR).\n';

  fs.writeFileSync(paths.out, body, 'utf8');
  console.log(body);
})();
