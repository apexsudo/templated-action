# Templated Action

Maintaining consistency across multiple repositories can be challenging,
especially when you need to keep common files like CI configurations,
CODEOWNERS, and pull request templates in sync. This GitHub Action,
`templated-action`, helps solve this problem by automating the synchronization
of these files.

The action uses a central repository as the source for your templates and
values. When changes are made to these source files, the action updates the
target repositories, ensuring they stay consistent. It supports customization
through templating, allowing each repository to have slight variations as
needed.

### What It Solves

- **Consistency:** Ensures that all repositories have the latest version of
  common files.
- **Automation:** Automatically updates repositories by creating pull requests
  with the latest changes.
- **Customization:** Allows for customizations in each repository through a
  templating engine, avoiding the need for manual adjustments.

### Inputs

- **gh_token** (required): A GitHub token with permissions to clone the source
  repository and create pull requests in the target repository.
- **license** (optional): A license string obtained from `http://example.com`.
  Optional for public repositories.
- **config_file** (optional): Path to the configuration file in the current
  repository. Defaults to `.github/templated-files-config.yaml`.
- **branch_name** (optional): Name of the branch to be created in GitHub while
  creating a pull request. Defaults to `automated/sync_files`.
- **commit_message** (optional): Commit message for the changes to be committed.
  Defaults to `chore: sync files from source`.
- **pr_title** (optional): Title for the pull request. Defaults to
  `chore: sync files from source`.
- **left_delimiter** (optional): Overrides the left delimiter for template
  files. Defaults to `[[`.
- **right_delimiter** (optional): Overrides the right delimiter for template
  files. Defaults to `]]`.
- **base_branch** (optional): Base branch name for the pull requests.

### Configuration File

The configuration file specifies the source of templates and the target files to
be synchronized. Here is an example configuration file with explanations:

```yaml
from:
  repository: premiumactions/testfiles # Source repository containing the templates
  defaultValuesFile: templated/values.yaml # Path to the default values file in the source repository

targets:
  - src: .github/workflows/templates/build.yaml # Path to the template file in the source repository
    dest: .github/workflows/build.yaml # Path where the rendered template should be placed in the target repository

values: # Custom values to be used in the templates
  name: Something
  extraEnvs:
    myValue: ${{ secrets.MY_VALUE }}
```

#### Explanation

- **from.repository:** Specifies the source repository where the template files
  are located.
- **from.defaultValuesFile:** Path to a default values file in the source
  repository. This file contains default values for the templates.
- **targets:** A list of mappings from source template files to their
  destinations in the target repository.
  - **src:** Path to the template file in the source repository.
  - **dest:** Path where the rendered template should be placed in the target
    repository.
- **values:** Custom values to be made available to the templates. These values
  can include static values or dynamic ones, such as GitHub secrets.

#### Values Merging

The action merges the values from the default values file specified in the
`from.defaultValuesFile` with the `values` section provided in the configuration
file. The values from the configuration file take precedence over those in the
default values file. This allows for overriding default values with custom ones
specific to the target repository.

For example, if the default values file contains:

```yaml
name: DefaultName
extraEnvs:
  myValue: defaultValue
```

And the configuration file contains:

```yaml
values:
  name: CustomName
  extraEnvs:
    myValue: ${{ secrets.MY_VALUE }}
```

The resulting merged values used in the templates will be:

```yaml
name: CustomName
extraEnvs:
  myValue: ${{ secrets.MY_VALUE }}
```

### Usage

To use this action, include it in your GitHub workflow file. Here is an example
of how to invoke the action:

```yaml
name: Sync Files

on:
  schedule:
    - cron: '0 0 * * *' # Runs daily at midnight
  workflow_dispatch: # Allows manual triggering

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Sync files from source
        uses: apexsudo/templated-action@v1
        with:
          gh_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          license: 'MIT'
          config_file: '.github/templated-files-config.yaml'
          branch_name: 'automated/sync_files'
          commit_message: 'chore: sync files from source'
          pr_title: 'chore: sync files from source'
          left_delimiter: '[['
          right_delimiter: ']]'
          base_branch: 'main'
```

### Notes

- Ensure the `gh_token` has the necessary permissions to clone the source
  repository and create pull requests in the target repository.
- The default delimiters are set to `[[` and `]]` to avoid conflicts with GitHub
  Actions' syntax.
