# Vale Demo

This repository houses a self-contained demo setup of [vale](https://vale.sh/) for linting content in markdown.

Feel free to fork this repository, make a change to a markdown file (or create a new one) and create a new PR. Your changes will be linted by vale!

## Content

* `.github/workflows`: holds everything that is needed to run vale linting via github actions.
* `./*.md`: All markdown files at the root level will be linted using vale.

## Workflows & Steps

### [Vale Linter](./.github/workflows/vale.yml)

* Runs on all PRs:
```yaml
on:
  workflow_dispatch:
  push:
    branches:
      - main
  pull_request:
```

* Needs permissions to read the PRs to run the linter and also needs write permissions to comment with its suggestions:
```yaml
permissions:
  contents: read
  pull-requests: write
```

* Checks out the PRs code:
```yaml
- name: Checkout
  uses: actions/checkout@v3
```

* Builds a list of files to lint from the diff
```yaml
- name: Gather files changed
  uses: trilom/file-changes-action@1.2.4
  with:
    fileOutput: ''
```

* Builds a list of files to lint from the diff and prints them
```yaml
- name: Gather files changed
  uses: trilom/file-changes-action@1.2.4
  with:
    fileOutput: ''

- name: Show files changed
  run: >
    cat $HOME/files.txt
    && cp $HOME/files.txt .
```

* Runs vale ([configured to run only against the changes](./.github/workflows/vale/vale_wrapper))
```yaml
- name: Run vale
  run: ./.github/workflows/vale/vale_wrapper

- name: Show vale output
  run: cat tmp_vale_result.json
```

* Installs and runs the [parser](./.github/workflows/vale/parser/vale-parser.js) to transform vale results into [reviewdog's RDJSON](https://github.com/reviewdog/reviewdog/tree/master/proto/rdf) format:
```yaml
- name: Setup node
  uses: actions/setup-node@v3
  with:
    node-version: "lts/*"
    cache: npm
    cache-dependency-path: .github/workflows/vale/parser/package-lock.json

- name: Generating RDF file
  run: >
    node .github/workflows/vale/parser/vale-parser.js tmp_vale_result.json
    && cat rdf_tmp_vale_result.json
```

* Uses [reviewdog](https://github.com/reviewdog/reviewdog) to write back the findings as comments to the PR:
```yaml
- uses: reviewdog/action-setup@v1
- run:  cat rdf_tmp_vale_result.json | reviewdog -f=rdjson -reporter=github-pr-review
  env:
    REVIEWDOG_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
