module.exports = async ({ github, context, core }) => {
  const explicitIssue = (process.env.ISSUE_NUMBER || '').trim();
  const compareCommit = (process.env.COMPARE_COMMIT || '').trim();
  const compareRunNumber = (process.env.COMPARE_RUN_NUMBER || '').trim();
  const { owner, repo } = context.repo;

  async function prFromCommit(sha) {
    if (!sha) return '';
    const { data } = await github.rest.repos.listPullRequestsAssociatedWithCommit({ owner, repo, commit_sha: sha });
    if (!data?.length) return '';
    const open = data.find(pr => pr.state === 'open');
    return String((open || data[0]).number);
  }

  async function prFromRunNumber(runNumber) {
    if (!runNumber) return '';
    const workflowId = (process.env.WORKFLOW_ID || 'lighthouse-performance-compare.yml').trim();
    const runs = await github.paginate(github.rest.actions.listWorkflowRuns, {
      owner,
      repo,
      workflow_id: workflowId,
      per_page: 100,
    });
    const run = runs.find(r => String(r.run_number) === String(runNumber));
    if (!run) return '';
    if (run.pull_requests?.[0]?.number) return String(run.pull_requests[0].number);
    return prFromCommit(run.head_sha);
  }

  let prnum = explicitIssue || '';
  if (!prnum) prnum = await prFromCommit(compareCommit);
  if (!prnum) prnum = await prFromRunNumber(compareRunNumber);

  core.info(`Resolved PRNUM: ${prnum || 'none'}`);
  return prnum;
};
