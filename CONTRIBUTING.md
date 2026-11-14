# Contribute a UI component

Fork this repository, make a branch, and submit a pull request to `main`. Maintainers review the component and can publish accepted changes to the Component Commons Vercel project. Your branch can be tested locally with `npm ci` and `npm run dev`.

1. Measure a public reference and document its layout, interactive states, and motion. Build the component in `components/collected/` using React and a CSS Module. Keep its demo data and assets self-contained.
2. Add an entry to `lib/designSystem/collected.tsx` using the [entry template](docs/collected-entry.md). Set a unique slug, the original URL, and the capture date. Include your public GitHub handle if you want it listed. Add a live preview, usage and API, substitutions, and any measured differences. The catalog and frame routes generate from this entry.
3. Check the [component rules](docs/COLLECTED-COMPONENT-RULES.md), desktop and phone renders, pointer and keyboard interactions, and reduced motion. Run `npm run lint && npm run build`. The isolated preview is at `/collected-frame/<slug>`, and the docs are at `/design-system/collected/<slug>`.
4. Open a pull request with the two local route paths, source credit, and a short test report. Submit only code and assets you have permission to share publicly.

## Review demo content before submitting

Use fictional records and self-contained sample media. Review code, docs, rendered previews,
links, file metadata, and every commit in the pull request for credentials, personal information,
private project details, and external profile or personal site references. Keep optional
contributor credit to your public GitHub handle.

## Publish an accepted pull request

From a clean checkout of the merged `main`, a maintainer with Vercel project access runs
these commands from the repository root. Choose the account or team that owns the project.

```sh
npm ci
npm run lint && npm run build
npx vercel link --project component-commons
npx vercel deploy --prod --archive=tgz
```

Verify the new component’s docs and isolated frame on
[Component Commons](https://component-commons.vercel.app/design-system/collected).
