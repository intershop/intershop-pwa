#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.includes('=') ? a.split('=') : [a, argv[i + 1]];
      const key = k.replace(/^--/, '');
      if (a.includes('=')) {
        args[key] = v;
      } else {
        args[key] = v;
        i++;
      }
    }
  }
  return args;
}

function median(arr) {
  const a = [...arr].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function mean(arr) {
  return arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
}

function agg(arr, type) {
  if (!arr.length) return undefined;
  switch (type) {
    case 'mean':
      return mean(arr);
    case 'min':
      return Math.min(...arr);
    case 'max':
      return Math.max(...arr);
    case 'median':
    default:
      return median(arr);
  }
}

function collectFilesRec(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFilesRec(p));
    else if (/^lhr-.*\.json$/i.test(entry.name)) out.push(p);
  }
  return out;
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

  for (const f of files) {
    const report = JSON.parse(fs.readFileSync(f, 'utf8'));
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

function normalizeUrl(u) {
  try {
    const { pathname } = new URL(u);
    return pathname.replace(/\/$/, '') || '/';
  } catch {
    return (u || '').replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0] || u;
  }
}

function pageLabel(u) {
  const p = normalizeUrl(u);
  if (p === '/' || p === '/home') return 'Homepage';
  return p || u || 'unknown';
}

function colorEmoji(score) {
  if (typeof score !== 'number') return '';
  if (score >= 90) return '🟩';
  if (score >= 50) return '🟨';
  return '🟥';
}

function fmt(score) {
  return typeof score === 'number' ? `${score}%` : '-';
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

function renderPerPagePerformanceTable(title, deskBase, deskCurr, mobBase, mobCurr, labels) {
  const currentLabel = labels?.current || 'Current';

  const mapScores = list => {
    const m = new Map();
    for (const e of list || []) {
      const perf = e.cats?.performance;
      m.set(normalizeUrl(e.url), typeof perf === 'number' ? Math.round(perf) : undefined);
    }
    return m;
  };

  const dB = mapScores(deskBase);
  const dC = mapScores(deskCurr);
  const mB = mapScores(mobBase);
  const mC = mapScores(mobCurr);

  const urls = Array.from(new Set([...dB.keys(), ...dC.keys(), ...mB.keys(), ...mC.keys()])).sort();
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
      pageLabel(u),
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
    out: args.out || 'lhci-comparison.md',
  };
  const aggregate = args.aggregate || 'median';

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
      }
    );
  } else {
    body += 'No page-level results found.\n\n';
  }
  body +=
    '> Detailed reports are available as workflow artifacts (baseline from the develop branch and current runs of this PR).\n';

  fs.writeFileSync(paths.out, body, 'utf8');
  console.log(body);
})();
