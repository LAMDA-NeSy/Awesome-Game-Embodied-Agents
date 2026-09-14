# Paper metadata and statistics

Paper records share the same metadata in the website and README. Unknown optional fields are omitted. A measured count of zero is a valid result; it is distinct from a missing count.

## Bibliography

- `bibliography.authors` stores the complete credited author list. The row shows up to three names followed by “et al.”; expand **Details & sources** for all names. Author names are searchable.
- `bibliography.date` and `dateLabel` identify the date from the linked source. Publisher record dates and first arXiv submission dates can differ from the conference year. Year filters continue to use the curated venue year.
- `bibliography.sourceUrl` identifies the bibliographic record used for the authors and date: official proceedings, arXiv, Crossref, or OpenAlex.
- `links.pdf` points to a source PDF. `bibliography.preview` is a small rendering of its actual first page. Original PDFs are not distributed in the repository. Previews retain the original paper's rights and are provided for identification with source links.
- `bibliography.bibtex` is a basic citation of the curated paper entry. For a publisher's full proceedings or journal citation, follow the Paper link. Dataset and benchmark papers use the same metadata in all views.

## Citation counts and repository stars

`metrics.citations` and `metrics.github` each store `value`, `source`, `sourceUrl`, and `updatedAt`. Citation records also retain the exact indexed title; GitHub records retain the repository name.

Citation counts come from OpenAlex's `cited_by_count` or Crossref's `is-referenced-by-count`, for the specific linked record. Preprint and published records may have different counts; this collection does not combine them or present these numbers as Google Scholar totals. Stars come from GitHub's `stargazers_count`; they describe the repository, not paper quality. Counts are cached snapshots and do not control inclusion.

Missing model, data, code, preview, or count fields are hidden. Available links go to the original team or publisher. Model or dataset collections are shown only when linked by the research project.

## Refresh existing statistics

Use Node.js 20 or later and run:

```sh
npm run refresh-metrics
npm run build
npm run check
```

The refresh script queries verified citation IDs and the listed GitHub repositories. It does not search for new papers or select new citation matches. It checks returned titles before updating citation records. Failed requests preserve the last verified value **and its original retrieval date**; no failed request becomes a zero. Review changes and publish them through the normal repository workflow.

Optional `GITHUB_TOKEN` and `OPENALEX_API_KEY` environment variables may be used for API access or larger rate limits. Tokens are used only by the local refresh process. Do not put them in catalogue data, website files, or commits. The website makes no authenticated requests and contains no API keys.

Authors, dates, links, and previews are reviewed separately against their sources. When adding a citation record, first verify its title and authors and store its canonical source URL. Do not infer a count from a similarly named paper. Metadata refreshes do not modify the collection's selection window or candidate status.
