#!/usr/bin/env node
/*
  Post or update a PR comment with the Lighthouse comparison markdown.
  Usage: node .github/scripts/lighthouse/post-pr-comment.js <path-to-markdown>
*/
const fs = require('fs');
const path = require('path');

async function run() {
  const mdPath = process.argv[2] || 'lhci-comparison.md';
  let body;
  try {
    body = fs.readFileSync(mdPath, 'utf8');
  } catch (e) {
    console.error(`Comparison markdown not found at ${mdPath}: ${e.message}`);
    process.exit(1);
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN is not set.');
    process.exit(1);
  }

  const { Octokit } = require('@octokit/rest');
  const octokit = new Octokit({ auth: token });

  const repoFull = process.env.GITHUB_REPOSITORY;
  if (!repoFull) {
    console.error('GITHUB_REPOSITORY is not available.');
    process.exit(1);
  }
  const [owner, repo] = repoFull.split('/');

  let prNum = '';
  if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    try {
      const evt = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      prNum = String(evt.pull_request.number);
    } catch {}
  }

  if (!prNum && process.env.GITHUB_EVENT_NAME === 'workflow_dispatch') {
    try {
      const evt = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      if (evt.inputs && evt.inputs['issue-number']) prNum = String(evt.inputs['issue-number']);
    } catch {
      // ignore
    }
  }

  if (!prNum) {
    try {
      const sha = process.env.GITHUB_SHA;
      const prs = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/pulls', {
        owner,
        repo,
        ref: sha,
        mediaType: { previews: ['groot'] },
      });
      if (Array.isArray(prs.data) && prs.data.length) prNum = String(prs.data[0].number);
    } catch (e) {
      console.log(`No PR found for commit: ${e.message}`);
    }
  }

  if (!prNum) {
    console.log('No PR number could be resolved. Skipping PR comment.');
    return;
  }

  const issue_number = Number(prNum);
  const marker = '## Lighthouse Comparison';
  try {
    const comments = await octokit.paginate(octokit.rest.issues.listComments, {
      owner,
      repo,
      issue_number,
      per_page: 100,
    });
    const existing = comments.find(c => (c.body || '').includes(marker));
    if (existing) {
      await octokit.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body });
      console.log(`Updated existing PR comment #${existing.id} on PR #${prNum}`);
    } else {
      await octokit.rest.issues.createComment({ owner, repo, issue_number, body });
      console.log(`Created PR comment on PR #${prNum}`);
    }
  } catch (e) {
    console.error(`Failed to post comment: ${e.message}`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
