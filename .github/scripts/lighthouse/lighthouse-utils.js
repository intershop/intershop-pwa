#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

/**
 * Shared utility functions for Lighthouse CI scripts.
 * Provides common functionality for parsing CLI arguments, aggregating scores,
 * collecting Lighthouse report files, normalizing URLs, and formatting output.
 *
 * Exported functions:
 * - parseArgs(argv): Parses CLI arguments into an object.
 * - median(arr): Calculates the median of an array of numbers.
 * - mean(arr): Calculates the mean of an array of numbers.
 * - agg(arr, type): Aggregates an array of numbers by type ('mean', 'min', 'max', 'median').
 * - collectFilesRec(dir): Recursively collects Lighthouse report JSON files from a directory.
 * - normalizeUrl(u): Normalizes a URL to its pathname.
 * - fmt(score): Formats a score as a percentage string.
 *
 * @module lighthouse-utils
 */

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.includes('=') ? a.split('=') : [a, argv[i + 1]];
      const key = k.replace(/^--/, '');
      args[key] = v;
      if (!a.includes('=')) {
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

function normalizeUrl(u) {
  try {
    const { pathname } = new URL(u);
    return pathname.replace(/\/$/, '') || '/';
  } catch {
    return (u || '').replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0] || u;
  }
}

function fmt(score) {
  return typeof score === 'number' ? `${score}%` : '-';
}

module.exports = {
  parseArgs,
  median,
  mean,
  agg,
  collectFilesRec,
  normalizeUrl,
  fmt,
};
