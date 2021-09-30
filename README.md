# Get Labels in PR 
Get all labels in the PR and assign it to GitHub environment

##Disclaimer
Yes this repo is public by design. :)

## Inputs
- `GITHUB_TOKEN` - set to `secrets.GITHUB_TOKEN`, this is provided by GitHub Actions
- `GITHUB_API_URL` - your GitHub api domain, default is https://api.github.com

## Outputs
- `success` - returns true if action can get labels, otherwise false
Example: let's say your PR has label `major` and `minor`

```yaml
name: Your CI
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: scout24ch/is24-get-labels-in-PR-action@v1.0.0
      id: get_labels
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This is provided by GitHub Actions
        GITHUB_API_URL: ${{ env.GITHUB_API_URL }} # This is optional, default is `https://api.github.com`

    - name: If `major` label is found
      if: steps.get_labels.outputs.success == true && LABEL_MAJOR == 1
      run: echo "do something if major label is found"
    - name: If `minor` label is found
      if: steps.get_labels.outputs.success == true && LABEL_MINOR == 1
      run: echo "do something if minor label is found"
```
