import * as core from '@actions/core';
/**
 * The configuration object for the Github action inputs.
 * @typedef {Object} GithubActionInputs
 * @property {string} token - The Github access token.
 * @property {string} checkName - The name of the Github status check.
 * @property {string} eslintReportFile - The path to the eslint report file.
 */

/**
 * Gets the Github action inputs and exports them as an object.
 * @type {GithubActionInputs}
 */
const githubToken = core?.getInput('token', { required: true });
const checkName = core?.getInput('check-name', { required: false });
const eslintReportFile = core?.getInput('eslint-report-json', { required: true });

/**
 * The Github action inputs object.
 * @type {GithubActionInputs}
 */
export default {
  token: githubToken,
  checkName,
  eslintReportFile,
};
