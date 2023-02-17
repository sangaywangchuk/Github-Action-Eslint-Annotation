import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { PullRequest } from './types';
import inputs from './inputs';

/**
 * The ownership object for the Github repository.
 * @typedef {Object} Ownership
 * @property {string} owner - The name of the repository owner.
 * @property {string} repo - The name of the repository.
 */

/**
 * The configuration object for the Github context.
 * @typedef {Object} GithubContextConfig
 * @property {string} sha - The sha of the last commit.
 * @property {Ownership} ownership - The ownership of the repository.
 * @property {PullRequest} pullRequest - The pull request associated with the event.
 * @property {string} githubWorkSpace - The path to the Github workspace.
 * @property {Object} githubContext - The Github context object.
 * @property {string} owner - The name of the repository owner.
 * @property {string} repo - The name of the repository.
 * @property {InstanceType<typeof GitHub>} octokit - The Octokit instance for the Github repository.
 */

const ownership = {
  owner: github.context.repo.owner,
  repo: github.context.repo.repo,
};

const prEvents = ['pull_request', 'pull_request_target'];
const pushEvents = ['push'];
const pullRequest = (
  prEvents.includes(github.context.eventName) ? github.context.payload.pull_request : false
) as PullRequest;

/**
 * Returns the sha of the last commit associated with the event.
 * For pull request events, the sha is on github.context.payload.pull_request.head.sha.
 * For push events, the sha is on github.context.sha.
 * @returns {string} The sha of the last commit.
 */
const getSha = (): string => {
  let sha = github?.context?.sha;
  if (prEvents.includes(github?.context?.eventName)) {
    const pullReq = github?.context?.payload?.pull_request as PullRequest;
    sha = pullReq?.head?.sha;
  }
  if (pushEvents.includes(github?.context?.eventName)) {
    sha = github?.context?.sha;
  }
  return sha;
};

/**
 * Returns the Octokit instance for the Github repository.
 * @returns {InstanceType<typeof GitHub>} The Octokit instance.
 */
const getOctokit = (): InstanceType<typeof GitHub> => {
  const octokit = github.getOctokit(inputs?.token);
  return octokit;
};

/**
 * The Github context configuration object.
 * @type {GithubContextConfig}
 */
export default {
  sha: getSha(),
  ownership,
  pullRequest,
  githubWorkSpace: process?.env?.GITHUB_WORKSPACE as string,
  githubContext: github?.context,
  owner: github?.context?.repo?.owner,
  repo: github?.context?.repo?.repo,
  octokit: getOctokit(),
};
