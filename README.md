
# ESLint Annotate from JSON Report and reporting using checks and annotations

## Version `1.0.0`

## Description

Analyzes an ESLint a report JSON file and posts the results.

On `pull_request` annotates the pull request diff with warnings and errors

On `push` creates a `ESLint Report Analysis` with a summary of errors and warnings, including links to the line numbers of the violations.


## Inputs

| Name | Required | Description | Default Value |
|---|---|---|---|
| `repo-token` | **Yes** | The [`GITHUB_TOKEN` secret](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#about-the-github_token-secret) | N/A |
| `eslint-report-json` | **Yes** | The path to the ESLint JSON report file. | `eslint_report.json` |
| `check-name` | No | The name of the GitHub status check created. | `ESLint Annotation Report Analysis` |


## Usage Example

In `.github/workflows/eslint-annotation.yml`:

```yml
name: Example Eslint Annotation Workflow

on: [pull_request]

jobs:
  node_test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      - name: Restore Cache
        id: 'yarn-cache'
        uses: actions/cache@v2
        with:
          path: '**/node_modules'
          key: ${{ runner.os }}-modules-${{ hashFiles('**/yarn.lock') }}
          restore-keys: | 
            ${{ runner.os }}-modules-
      - name: Install Dependencies
        if: steps.yarn-cache.outputs.cache-hit != 'true'
        run: yarn install
      - name: Test Code Linting
        run: yarn lint
      - name: Save Code Linting Report JSON
        # See https://eslint.org/docs/user-guide/command-line-interface#options
        run: yarn lint:report
      - name: Annotate Code Linting Results
        uses: selisebt/lint-action@v1
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          report-json: "eslint_report.json"
