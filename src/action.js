const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
    core.setOutput('success', true)

    let pullRequest;

    try {
        pullRequest = await getPullRequest()
    } catch (e) {
        if (e.message === 'cannot find pull request') {
            core.setOutput('success', false)
            core.info('Cannot find pull request')
            return
        }

        core.setFailed(e.message)
        core.error(e.message)

        throw e;
    }

    const labels = pullRequest.labels
    if (labels.length == 0) {
        core.info("No labels found")
        return;
    }

    for (const label of labels) {
        const environmentVariable = `LABEL_${label.name.toUpperCase()}`
        core.exportVariable(environmentVariable, '1');
        core.info(` Setting env var ${environmentVariable}=1`)
    }
}

/**
 *
 * @return {Promise<Octokit.PullsListResponseItem>}
 */
 async function getPullRequest() {
     if (github.context.payload.pull_request) {
         return github.context.payload.pull_request
     }

    const token = core.getInput('GITHUB_TOKEN');

    if (!token) {
        return Promise.reject(new Error('GITHUB_TOKEN is required'));
    }

    const baseUrl = core.getInput('GITHUB_API_URL');
    core.info(`GITHUB_API_URL: ${baseUrl}`)
    const octokit = github.getOctokit(token,  { baseUrl });

    const { data: pullRequests } = await octokit.rest.pulls.list({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc'
      });

    const pullRequest = pullRequests.find(pull => pull.merge_commit_sha === github.context.sha);

    if (!pullRequest) {
        return Promise.reject(new Error('cannot find pull request'));
    }

    return pullRequest;
}

module.exports = {
    main
};