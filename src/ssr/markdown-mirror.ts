/**
 * Express wiring for the Markdown mirror feature.
 *
 * Serves a Markdown version of every SSR-rendered page under the same URL with a `.md`
 * suffix (e.g. `/en/home` -> `/en/home.md`) for machine consumers such as crawlers and
 * LLMs. The actual HTML-to-Markdown conversion lives in `./html-to-markdown`; this module
 * only registers the route and renders the underlying PWA page via the Angular SSR engine.
 */

import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { join } from 'path';

import { getLogger } from 'ish-core/utils/ssr-logging/ssr-logging.service';
import { REQUEST, REQUEST_ID, RESPONSE } from 'ish-core/utils/ssr/ssr.tokens';

import { APP_BASE_HREF } from '../main.server';

import { htmlToMarkdown } from './html-to-markdown';

const logger = getLogger('Server');

interface MarkdownMirrorDependencies {
  commonEngine: CommonEngine;
  browserFolder: string;
  getRequestId(req: express.Request): string;
  getBaseLogData(req: express.Request): Record<string, unknown>;
  extractBaseHref(url: string): string;
}

// build the public Markdown mirror URL: drop the nginx-injected matrix params (;...), keep a
// real query string, and append `.md` to the path (e.g. `/en/home;lang=..` -> `/en/home.md`)
export function toMarkdownMirrorUrl(url: string): string {
  const [pathAndMatrix, query] = url.split('?');
  const path = pathAndMatrix.split(';')[0];
  return `${path}.md${query ? `?${query}` : ''}`;
}

/**
 * Register the Markdown mirror route on the given Express server. Must be registered before
 * the static file handlers so that URLs ending in `.md` are not treated as static assets.
 */
export function registerMarkdownMirror(server: express.Application, deps: MarkdownMirrorDependencies): void {
  const { commonEngine, browserFolder, getRequestId, getBaseLogData, extractBaseHref } = deps;

  // Markdown mirror: render the underlying PWA page and return its main content as Markdown.
  const renderMarkdownMirror = (req: express.Request, res: express.Response) => {
    // remove the `.md` suffix from the path to obtain the underlying PWA route
    const targetUrl = req.originalUrl.replace(/\.md(?=$|[?;#])/, '');

    logger.info({ ...getBaseLogData(req), url: { full: targetUrl } }, 'MD (Markdown mirror)');

    // set no-cache up-front so every response path (success and error) is consistent with regular routes
    res.set('Cache-Control', 'no-cache');

    const baseHref = extractBaseHref(targetUrl);

    commonEngine
      .render({
        url: `${req.protocol}://${req.headers.host}${targetUrl}`,
        documentFilePath: join(browserFolder, 'index.html'),
        publicPath: browserFolder,
        inlineCriticalCss: false,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseHref },
          { provide: REQUEST, useValue: req },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST_ID, useValue: getRequestId(req) },
        ],
      })
      .then(html => {
        if (!html) {
          const errorMsg = `Markdown mirror failed: No HTML generated for ${targetUrl}`;
          logger.error(
            { ...getBaseLogData(req), http: { response: { status_code: 500 } }, error: { message: errorMsg } },
            'Markdown mirror returned empty HTML'
          );
          return res.status(500).send(errorMsg);
        }

        const markdown = htmlToMarkdown(html);
        res.set('Content-Type', 'text/markdown; charset=UTF-8');
        res.status(res.statusCode).send(markdown);
      })
      .catch(err => {
        logger.error(
          { ...getBaseLogData(req), error: { message: err?.message || String(err), stack_trace: err?.stack } },
          'Markdown mirror rendering error'
        );
        // send a generic message; details are logged, never exposed to the client (OWASP A05:2021)
        res.status(500).send('Internal Server Error');
      });
  };

  // match `.md` either at the end of the path or directly before matrix parameters (`;...`)
  // that nginx appends (e.g. `/help/example.md;lang=en_US;...;baseHref=%2F`)
  server.get(/\.md(;|$)/, renderMarkdownMirror);
}
