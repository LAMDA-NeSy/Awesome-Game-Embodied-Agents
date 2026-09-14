# Paper metadata and statistics

Paper records share the same metadata in the website and README. The website keeps five visible slots for Data, Models, Code, Citations, and GitHub stars. A measured count of zero is a valid result; it is distinct from a missing count.

## Bibliography

- `bibliography.authors` stores the complete credited author list. The row shows up to three names followed by “et al.”; expand **Details & sources** for all names. Author names are searchable.
- `bibliography.date` and `dateLabel` identify the source date, displayed with a visible **Published**, **Preprint**, or **Indexed** label. Indexed dates are not treated as verified first-release dates. The **Source date** sort follows this displayed date, with unknown dates last. **Venue / release year** sorts by `year`; paper-year filters use the curated venue year. Legacy `sort=newest` links map to venue-year sorting. Dates with only a known year remain year-only.
- `bibliography.sourceUrl` identifies the bibliographic record used for the authors and date: official proceedings, arXiv, Crossref, or OpenAlex.
- `links.pdf` points to a source PDF. `bibliography.preview` is a small rendering of its actual first page. Original PDFs are not distributed in the repository. Previews retain the original paper's rights and are provided for identification with source links.
- `bibliography.bibtex` is a basic citation of the curated paper entry. For a publisher's full proceedings or journal citation, follow the Paper link. Dataset and benchmark papers use the same metadata in all views.

## Citation counts and repository stars

`metrics.citations` and `metrics.github` each store `value`, `source`, `sourceUrl`, and `updatedAt`. Citation records also retain the exact indexed title; GitHub records retain the repository name.

Citation counts come from OpenAlex's `cited_by_count` or Crossref's `is-referenced-by-count`, for the specific linked record. Preprint and published records may have different counts; this collection does not combine them or present these numbers as Google Scholar totals. Stars come from GitHub's `stargazers_count`; they describe the repository, not paper quality. Counts are cached snapshots and do not control inclusion.

Missing model, data, or code links appear as muted, non-clickable icons. Unavailable citation and GitHub star counts display “—” with an explanatory tooltip and accessible label. These placeholders are not links and cannot receive keyboard focus. Unknown counts are never displayed as zero. Other missing optional metadata, including previews, remains omitted. Available links go to the original team or publisher. Model or dataset collections are shown only when linked by the research project.

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

## Collection history and counts

`addedAt` records inclusion in the collection; `updatedAt` records a substantive content change. The build compares the previous published catalogue to detect additions and revisions. Source-check dates, metrics, and ranking changes do not reset these dates. Candidate promotion starts a new selected-entry inclusion date. Existing entries use **2026-09-14** as an explicitly labeled history baseline. Keep `dist/resources.json` available as the previous snapshot when rebuilding; new records receive the current UTC date.

**Recently added** and **Recently revised** are independent from publication and venue-year sorting. All-category results use a single flat list for chronological or alphabetical sorts, so grouping cannot override the requested order. Curated-order groups use full category membership: every paper appears in Papers, including dataset and benchmark papers. Group and navigation counts match. All resources counts unique IDs, while category counts overlap.

`data/updates.json` contains human-written release notes, rendered into the website and `CHANGELOG.md`. Add a dated note for meaningful editorial or website changes. Routine metric refreshes appear in the maintenance report rather than filling the editorial update log.

## Weekly maintenance and source checks

The **Publish GitHub Pages** workflow schedules maintenance each Monday at **01:17 UTC / 09:17 Asia/Shanghai**. GitHub may delay scheduled runs. The workflow refreshes verified statistics, checks source links, builds and validates the collection, commits only the maintenance snapshots and their generated pages, then deploys that exact commit. A manual workflow run with **refresh** enabled uses the same path. New records, acceptance changes, source corrections, and selection-window changes still require editorial review.

Run `npm run check-links` locally to produce `data/maintenance.json`. The report includes a timestamp, unique URLs, affected record IDs, and each result. Checks use HEAD requests, with GET confirmation for 404/410 and a GET fallback for servers that do not implement HEAD. GET response bodies are canceled; PDFs and videos are not downloaded. One request per host is made at a time, across up to four hosts.

- **Reachable:** successful HTTP response.
- **Missing:** confirmed GET response of 404 or 410; review the source before editing a link.
- **Access restricted:** 401, 403, or 429; a publisher or host may restrict automated access.
- **Inconclusive:** timeout, network failure, or other server response.

Restrictions and transient failures never remove links or resources. Partial statistics refreshes preserve the last verified values and dates. The website’s **What’s new** page shows both check summaries and links to the full public report. `OPENALEX_API_KEY` can optionally be configured as a repository secret; the workflow uses GitHub’s built-in token for GitHub API requests. Neither credential is published.
