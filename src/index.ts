import * as core from '@actions/core';
import eslintJsonReportToJsObject from './parseJsonReport';
import inputs from './inputs';
import { getPullRequestChangedAnalyzedReport } from './analyzedReport';
import { createStatusCheck, onCheckRateLimitingError } from './checksApiServices';

/**
 *  This function that parses the eslint report file and creates a status check for a pull request.
 * @async
 * @function
 * @throws {Error} Throws an error if an exception occurs during the execution.
 */
(async () => {
  try {
    /**
     * Converts the eslint report from JSON to a JavaScript object.
     * @type {Object}
     */
    const parsedEslintReportJs = eslintJsonReportToJsObject(inputs?.eslintReportFile);

    /**
     * Creates a status check for the pull request.
     * @type {Object}
     */
    const { checkId } = await createStatusCheck();

    /**
     * Gets the analyzed report for the pull request.
     * @type {Object}
     */
    const report = await getPullRequestChangedAnalyzedReport(parsedEslintReportJs);

    /**
     * The conclusion of the status check. Can be either "success" or "failure".
     * @type {String}
     */
    const conclusion = report?.success ? 'success' : 'failure';

    /**
     * Sends the status check result to the checks API service.
     */
    await onCheckRateLimitingError(checkId, conclusion, report, 'completed');

    /**
     * Fails the action if the conclusion is "failure".
     */
    if (conclusion === 'failure') {
      core.setFailed('Fix the pipeline to resolve the pull request error');
    }
  } catch (e) {
    /**
     * Handles any exceptions that occur during execution.
     * @type {Error}
     */
    const error = e as Error;
    console.log('From Main: ', error.toString());
    core.setFailed(error.message);
  }
})();
