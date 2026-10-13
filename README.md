# Yopass microsite

Marketing site and documentation for [yopass.se](https://yopass.se), built with Docusaurus, React, and Tailwind CSS.

## Local development

```sh
npm ci
npm start
```

## Production build

```sh
npm run build
npm run serve
```

Documentation is fetched from [`jhaals/yopass/docs`](https://github.com/jhaals/yopass/tree/master/docs) using a shallow Git fetch (`--depth=1`) before `npm start` and `npm run build`. Only `docs/` is checked out, under the ignored `.yopass-docs/` directory. Make documentation changes in the Yopass repository. Git and network access are required.

By default the build fetches `master`. To build a specific source commit, run `DOCS_REF=<commit-sha> npm run build`. Website components and pages live in `src/`, and static assets live in `static/`.

## Deployment

The deployment workflow publishes to the existing Cloudflare Pages project `yopass-site` from `master`. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the GitHub repository's `Deploy` environment before enabling deployment.

Non-Dependabot changes deploy on push. Dependabot changes are deferred to the daily deployment check. Manual deployment is available through GitHub Actions.

## Documentation webhook

The Yopass repository sends a GitHub `repository_dispatch` event named `docs-updated` whenever `docs/**` changes on `master`. This repository builds and deploys using the source commit SHA included in the event.

In `jhaals/yopass`, set the Actions secret `MICROSITE_DISPATCH_TOKEN` to a fine-grained token with **Contents: read and write** access to `yopass/microsite`. The receiving workflow must be present on this repository's default branch (`master`).
