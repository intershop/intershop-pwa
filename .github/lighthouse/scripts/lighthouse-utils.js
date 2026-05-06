#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Shared utility functions for Lighthouse CI scripts.
 *
 * Exported functions:
 * - collectUrlScores(dir): Collects and aggregates Lighthouse scores from report files in a directory
 * - formatDelta(curr, base): Formats the difference between current and base scores with emoji indicators
 * - formatScore(score, link, threshold): Formats a score with color-coded emoji and optional markdown link
 * - loadPagesConfiguration(configPath): Loads page configurations from Lighthouse config files
 * - normalizeUrl(url): Normalizes URLs to their pathname for consistent comparison
 *
 * @module lighthouse-utils
 */

// Calculates the median value of an array of numbers
function median(arr) {
  const a = [...arr].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

// Calculates the arithmetic mean of an array of numbers
function mean(arr) {
  return arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
}

// Aggregates an array of numbers using the specified aggregation type
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

// Recursively collects Lighthouse report JSON files from a directory
function collectFilesRec(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFilesRec(p));
    else if (/^lhr-.*\.json$/i.test(entry.name)) out.push(p);
  }
  return out;
}

// Collects and aggregates Lighthouse scores and report links from report files in a directory
function collectUrlScores(dir) {
  const urlScoreMap = new Map();
  if (!dir || !fs.existsSync(dir)) return urlScoreMap;

  const files = fs.statSync(dir).isDirectory() ? collectFilesRec(dir) : [];
  if (!files.length) return urlScoreMap;

  // Read report URLs from links.json
  const perUrlReportLinks = new Map();
  const linksFile = path.join(dir, 'links.json');
  if (fs.existsSync(linksFile)) {
    try {
      const links = JSON.parse(fs.readFileSync(linksFile, 'utf8'));
      for (const [url, reportUrl] of Object.entries(links)) {
        perUrlReportLinks.set(url, reportUrl);
      }
    } catch {
      // links.json not found or invalid, continue without report URLs
    }
  }

  const perUrlCatRuns = new Map();
  for (const f of files) {
    let report;
    try {
      report = JSON.parse(fs.readFileSync(f, 'utf8'));
    } catch (e) {
      console.warn(`Warning: Could not parse Lighthouse report file ${f}: ${e.message}`);
      continue;
    }
    const url = report.requestedUrl || 'unknown';
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

  for (const [url, catRuns] of perUrlCatRuns.entries()) {
    const aggCats = {};
    for (const [k, arr] of Object.entries(catRuns)) {
      const val = agg(arr, 'median');
      if (typeof val === 'number') aggCats[k] = Math.round(val);
    }

    urlScoreMap.set(url, { ...aggCats, reportUrl: perUrlReportLinks.get(url) });
  }
  return urlScoreMap;
}

// Normalizes a URL to its pathname for consistent comparison and display
function normalizeUrl(url) {
  try {
    const { pathname } = new URL(url);
    return pathname.replace(/\/$/, '') || '/';
  } catch {
    return (url || '').replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0] || url;
  }
}

// Formats a Lighthouse score with color-coded emoji and optional markdown link
function formatScore(score, link, threshold) {
  if (typeof score !== 'number') {
    return '-';
  }
  let emoji = '🔴';
  if ((threshold && score >= threshold) || (!threshold && score >= 90)) {
    emoji = '🟢';
  } else if (!threshold && score >= 50) {
    emoji = '🟡';
  }
  const scoreText = link ? `[${score}%](${link})` : `${score}%`;
  return `${emoji} ${scoreText}`;
}

// Formats the difference between current and base scores with emoji indicators
function formatDelta(curr, base, variance = 0) {
  if (typeof curr !== 'number' || typeof base !== 'number') return '-';
  const diff = curr - base;
  const emoji = diff > variance ? '🟩' : diff < -variance ? '🟥' : '';
  return `${emoji} ${diff > 0 ? '+' : ''}${diff}`;
}

// Loads page configurations from a Lighthouse configuration file.
function loadPagesConfiguration(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const pagesConfig = JSON.parse(content).pages || {};
    return pagesConfig;
  } catch {
    console.warn(`Warning: Could not load pages config from ${configPath}, using empty config`);
    return {};
  }
}

module.exports = {
  collectUrlScores,
  formatDelta,
  formatScore,
  loadPagesConfiguration,
  normalizeUrl,
};
