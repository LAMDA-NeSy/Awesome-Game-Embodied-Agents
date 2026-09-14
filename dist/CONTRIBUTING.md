# Contributing

Contributions on game and embodied agents are welcome: papers, research articles, tools, datasets, benchmarks, and source-linked video demonstrations.

1. Read the [collection policy](docs/collection-policy.md) and check the publication window and venue for papers.
2. Add or update a record in `data/resources.json`. Check titles, DOIs, and arXiv IDs for duplicates.
3. Write the summary, environment, observation/action interface, limitations, and inclusion rationale in English. Include official paper, code, data, or project links where available.
4. For a recent preprint, provide its first submission date and specific evidence of significance. Use `status: "candidate"` when verification is incomplete.
5. Keep peer review, source verification, and independent reproduction distinct. Identify workshops separately from main conferences. Do not submit credentials, private reading records, or materials you lack permission to share.
6. For a demo, use a playable video hosted by its original author or project. Include the source page, credit, demonstration setting, and associated resource IDs. Separate real robots, simulation, gameplay, teleoperation, and generated frames. Report speed changes where documented; selected clips are not benchmark success rates.
7. Run `npm run build` and `npm run check`. Submit the catalogue and generated README/website files together.

## Catalogue conventions

- `year` is the conference year or journal publication year for papers. Use `publicationNote` when proceedings are published in a different year.
- `kinds` can contain more than one category. A dataset or benchmark paper can share one record with its dataset or benchmark listing; do not duplicate it just to populate two views.
- `paperType` distinguishes `survey`, `method`, `dataset`, and `benchmark` contributions.
- Standalone infrastructure may use `year: null` to avoid mistaking a review date for an original release year.
- Article and video dates describe the original source, when known. Do not invent a day when only a year is available.
- `relatedIds` links an article or demonstration to an existing paper or project. Distinct demonstrations may have separate records with unique titles.
- External links must be verified HTTPS URLs. Video URLs must be traceable to the credited source page; do not rehost third-party media in this repository.
- Keep official-source claims and editorial judgments explicit. No automated citation, star, or view counts should be added without a reliable retrieval source and date.

The site and README are generated from the same catalogue. Edit resource data first, then rebuild to keep counts and lists consistent.

For paper rows, include verified authors, the source date and its meaning, and a PDF URL when available. Link any citation count and repository star count to its exact source and record the retrieval date. Leave unverified optional fields absent. See [metadata maintenance](docs/metadata.md).
