import fs from 'node:fs/promises';
import { renderCatalogue } from '../dist/assets/catalog.mjs';
const data = JSON.parse(await fs.readFile('data/resources.json', 'utf8'));
const selected = data.resources.filter(r => r.status === 'selected').sort((a, b) => a.rank - b.rank);
const candidates = data.resources.filter(r => r.status === 'candidate');
const count = kind => selected.filter(r => r.kinds.includes(kind)).length;
data.meta.counts = Object.fromEntries(['articles', 'papers', 'projects', 'datasets', 'benchmarks', 'demos'].map(k => [k, count(k)]));
await fs.writeFile('data/resources.json', JSON.stringify(data, null, 2) + '\n');
await fs.copyFile('data/resources.json', 'dist/resources.json');
let html = await fs.readFile('dist/index.html', 'utf8');
html = html.replace(/(<!-- CATALOGUE:START -->)[\s\S]*?(<!-- CATALOGUE:END -->)/, () => `<!-- CATALOGUE:START -->${renderCatalogue(selected,'all',data.resources)}<!-- CATALOGUE:END -->`);
for (const [id, value] of [['nav-total', selected.length], ['stat-total', selected.length], ['stat-papers', count('papers')], ['stat-projects', count('projects')], ['stat-benchmarks', count('benchmarks')], ['stat-articles', count('articles')], ['stat-datasets', count('datasets')], ['stat-demos', count('demos')]]) {
  html = html.replace(new RegExp(`(id="${id}">)[^<]*`), `$1${value}`);
}
html = html.replace(/(<p id="result-count"[^>]*>)[\s\S]*?<\/p>/, `$1${selected.length} resources · all categories</p>`);
const about = `<h2>About the collection</h2>
<p>A research index connecting game agents and embodied intelligence. Game research starts from the supplied <a href="${data.meta.knowledgeUrl}" target="_blank" rel="noopener noreferrer">Game Agent knowledge base</a>; robotics and additional game resources come from official proceedings, research reports, and project repositories.</p>
<p>The organization and website layout are inspired by <a href="${data.meta.referenceUrl}" target="_blank" rel="noopener noreferrer">Awesome Robot Use Agent</a>. This collection has its own scope, categories, and resource summaries.</p>
<div class="notice"><b>Snapshot · ${data.meta.snapshotDate}</b><p>${selected.length} unique curated resources: ${count('articles')} articles, ${count('papers')} papers, ${count('projects')} standalone projects, ${count('datasets')} datasets, ${count('benchmarks')} benchmarks or environments, and ${count('demos')} video demonstrations. Dataset and benchmark papers appear in multiple views, so these counts overlap. ${candidates.length} candidates are listed separately.</p></div>
<h3>Selection criteria</h3>
<div class="table-wrap"><table><thead><tr><th>Track</th><th>Publication window</th><th>Selection basis</th></tr></thead><tbody>
<tr><td>Leading conferences & journals</td><td>14 Sep 2021 – 14 Sep 2026</td><td>Relevant main-conference papers and journal articles with official publication records. Priority venues include NeurIPS, ICLR, ICML, CVPR, ICCV, ECCV, AAAI, IJCAI, RSS, CoRL, ICRA, IROS, Nature, Science, T-RO, IJRR, TPAMI, JMLR, and TMLR.</td></tr>
<tr><td>Selected arXiv research</td><td>14 Sep 2025 – 14 Sep 2026</td><td>First submission date, with a specific editorial rationale and supporting sources. Evidence can include systematic evaluations, released models or environments, and substantial research reports. No citation ranking is claimed.</td></tr>
<tr><td>Tools & environments</td><td>Reviewed for current research use</td><td>Standalone infrastructure is assessed by purpose, interface, and setup requirements. The paper publication window does not apply.</td></tr></tbody></table></div>
<p>This venue list reflects the collection's subject-specific editorial policy, rather than a single official ranking. Workshops and unconfirmed submissions are distinguished from main-conference publications. See the <a href="docs/collection-policy.md">full collection policy</a>.</p>
<h3>Sources and verification</h3>
<p>The source table contained ${data.meta.sourceSnapshot.rows} rows. Removing ${data.meta.sourceSnapshot.emptyRows} untitled rows and merging ${data.meta.sourceSnapshot.duplicateRows} duplicates produced ${data.meta.sourceSnapshot.uniqueTitledRows} distinct titled leads. Historical counts on the knowledge-base homepage were not used for this snapshot.</p>
<p>Checks primarily cover bibliographic records, project descriptions, and abstracts. Original knowledge-base review labels are retained as source claims, translated into English. They do not represent a fresh full-text review or independent experiment reproduction.</p>
<p><a href="selection-audit.json" download>Selection audit ↓</a> · <a href="resources.json" download>Resource data ↓</a> · <a href="${data.meta.knowledgeUrl}" target="_blank" rel="noopener noreferrer">Source knowledge base ↗</a> (original access permissions apply)</p>
<h3>Paper records and metrics</h3><p>Paper rows include full titles, credited authors, source dates, PDF links, and original first-page previews where available. The byline date comes from the linked bibliographic record; an arXiv first-submission date or proceedings publication date may differ from the conference year. Expand Details &amp; sources for the complete author list and a BibTeX citation.</p><p>Citations come from the linked OpenAlex or Crossref record, and stars from the linked GitHub repository. Each count carries its retrieval date. Counts are cached snapshots and can differ across paper versions and databases. Unavailable fields are omitted. See <a href="docs/metadata.md">metadata sources and maintenance</a>.</p><h3>Comparing game and embodied agents</h3>
<div class="table-wrap"><table><thead><tr><th>Dimension</th><th>Game research</th><th>Embodied research</th></tr></thead><tbody>
<tr><td>Environment & task</td><td>Game, map, mode, and task scope</td><td>Hardware, scene, objects, and manipulation tasks</td></tr>
<tr><td>Observation access</td><td>Pixels, audio, text, or engine state</td><td>Images, depth, touch, and proprioception</td></tr>
<tr><td>Action abstraction</td><td>Keyboard/mouse, program APIs, or skills</td><td>Joints, end-effector poses, or navigation/manipulation skills</td></tr>
<tr><td>Data & learning</td><td>Player traces, online interaction, video pretraining</td><td>Demonstrations, teleoperation, simulation, real interaction</td></tr>
<tr><td>Execution constraints</td><td>Decision latency, frame rate, paused execution</td><td>Control frequency, collisions, hardware limits</td></tr>
<tr><td>Evaluation</td><td>Map splits, task metrics, samples, and seeds</td><td>Task success, generalization, and human intervention</td></tr></tbody></table></div>
<p>Shared methods do not by themselves establish transfer between domains. Frame generation, game navigation, robot planning, and physical execution retain their respective evidence boundaries.</p>
<h3>Video demonstrations</h3><p>The video gallery embeds original research-team videos, with source links, credits, and related work. Game control, generated frames, real robots, and simulation are labeled separately. Selected clips illustrate behavior; they do not replace benchmark evaluations. Videos load as you approach them and play only when requested. If an external host is unavailable, use the source link on the card.</p><h3>Maintenance and contributions</h3>
<p>The README and website share the same catalogue. This is a manually curated snapshot. Additions should include official sources and satisfy the selection criteria. Read the <a href="CONTRIBUTING.md">contribution guide</a> or visit the <a href="${data.meta.repositoryUrl}" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>`;
html = html.replace(/(<section id="about" class="about-panel" hidden>)[\s\S]*?<\/section>/, `$1${about}</section>`);
await fs.writeFile('dist/index.html', html);
const md = s => String(s || '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const link = (url, text) => url ? `[${text}](${url})` : '';
const links = r => Object.entries(r.links).map(([k, v]) => link(v, { paper: 'Paper', code: 'Code', project: 'Project', data: 'Data', article: 'Article', video: 'Video', pdf: 'PDF', model: 'Models' }[k] || k)).join(' · ');
const authorLine = r => {const authors=r.bibliography?.authors||[];return authors.slice(0,3).join(', ')+(authors.length>3?' et al.':'');};
const metricsLine = r => [r.metrics?.citations,r.metrics?.github].filter(m=>Number.isInteger(m?.value)).map(m=>link(m.sourceUrl,`${m.value.toLocaleString('en-US')} ${m.source==='GitHub'?'stars':'citations'} · ${m.source} · ${m.updatedAt}`)).join('<br>');
const paperRows = items => items.map(r => `| **${link(r.links.paper, r.title)}**<br>${md(authorLine(r))}<br>${md(r.bibliography?.date || r.publicationDate || r.year)} | ${md(r.venue)} | ${md(r.summary)} | ${links(r)}${metricsLine(r)?'<br>'+metricsLine(r):''} |`).join('\n');
const projectRows = items => items.map(r => `| **${r.name}** | ${md(r.environment)} | ${md(r.interface)} | ${md(r.limits)} | ${links(r)} |`).join('\n');
const tick = String.fromCharCode(96);
let readme = `# Awesome Game & Embodied Agents

A curated collection of research on agents that perceive, plan, and act in games and the physical world.

[**Explore the website ↗**](${data.meta.siteUrl}) · [Articles](#articles) · [Papers](#papers) · [Projects](#projects) · [Datasets](#datasets) · [Benchmarks](#benchmarks) · [Video demos](#video-demos) · [Contributing](CONTRIBUTING.md)

**${count('articles')} articles · ${count('papers')} papers · ${count('projects')} projects · ${count('datasets')} datasets · ${count('benchmarks')} benchmarks · ${count('demos')} video demos**

${candidates.length} candidate papers remain separate from the curated collection.

Snapshot: **${data.meta.snapshotDate}**. There are **${selected.length} unique curated resources**. Dataset and benchmark papers appear in multiple views, so category counts overlap.

Game agents operate in virtual environments through observations, game APIs, or keyboard and mouse actions. Embodied agents connect perception and planning to simulated or physical robot actions. This collection brings their methods together while documenting the interfaces and evaluation conditions that make comparisons meaningful.

## Contents

- [Getting started](#getting-started)
- [Selection criteria](#selection-criteria)
- [Articles](#articles)
- [Papers](#papers)
  - [Surveys](#surveys)
  - [Game agents](#game-agents)
  - [Embodied agents](#embodied-agents)
- [Projects](#projects)
- [Datasets](#datasets)
- [Benchmarks](#benchmarks)
- [Video demos](#video-demos)
- [Candidates](#candidates)
- [Sources and verification](#sources-and-verification)
- [Website and maintenance](#website-and-maintenance)
- [Acknowledgements](#acknowledgements)

## Getting started

- **Read:** Explore [game-agent papers](#game-agents) on world models, exploration, memory, and control, or [embodied-agent papers](#embodied-agents) on robot policies and planning.
- **Build:** Find [open-source projects](#projects) for data collection, policy training, and environment interfaces.
- **Evaluate:** Choose [benchmarks and environments](#benchmarks), then align observation access, action spaces, training budgets, and evaluation protocols.
- **Contribute:** Follow the [contribution guide](CONTRIBUTING.md) to propose a resource with official sources and a clear inclusion rationale.

## Selection criteria

| Track | Window | Required evidence |
| --- | --- | --- |
| Leading conferences and journals | ${data.meta.paperWindow.from} – ${data.meta.paperWindow.to} | Relevant main-conference or journal publication, checked against an official record |
| Important recent arXiv research | ${data.meta.arxivWindow.from} – ${data.meta.arxivWindow.to} | First submission date, explicit editorial rationale, and supporting research evidence |
| Tools and environments | Reviewed for current research use | Official purpose, interfaces, and setup requirements; no paper-age cutoff |

Priority venues include NeurIPS, ICLR, ICML, CVPR, ICCV, ECCV, AAAI, IJCAI, RSS, CoRL, ICRA, IROS, Nature, Science, T-RO, IJRR, TPAMI, JMLR, and TMLR. This is a subject-specific editorial policy, not a claim that every venue belongs to the same official tier.

Unconfirmed work is listed as a candidate. Preprints are labeled separately from peer-reviewed papers. The collection does not claim exhaustive coverage, a citation ranking, or independent reproduction of the listed experiments. See the [full policy](docs/collection-policy.md).

## Papers

### Surveys

| Survey | Venue | Research focus | Sources |
| --- | --- | --- | --- |
${paperRows(selected.filter(r => r.paperType === 'survey'))}

### Game agents

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
${paperRows(selected.filter(r => r.kinds.includes('papers') && r.paperType === 'method' && r.domains.includes('game')))}

### Embodied agents

Cross-domain papers appear in both sections but have a single catalogue record. Where conference and proceedings years differ, the conference year is displayed and the distinction is recorded in ${tick}publicationNote${tick}.

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
${paperRows(selected.filter(r => r.kinds.includes('papers') && r.paperType === 'method' && r.domains.includes('embodied')))}

### Dataset papers

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
${paperRows(selected.filter(r => r.paperType === 'dataset'))}

### Benchmark papers

| Paper | Venue | Research focus | Sources |
| --- | --- | --- | --- |
${paperRows(selected.filter(r => r.paperType === 'benchmark'))}

## Projects

Standalone tools, frameworks, and research infrastructure. Code accompanying a paper is linked from its paper entry.

| Project | Environment / role | Interface | Setup and limitations | Official sources |
| --- | --- | --- | --- | --- |
${projectRows(selected.filter(r => r.kinds.includes('projects')))}

## Benchmarks

Benchmark papers share a record with their environment listing. Report the environment version, action space, observation access, and task subset when using them.

| Benchmark / environment | Environment / task | Interface | Evaluation boundary | Sources |
| --- | --- | --- | --- | --- |
${projectRows(selected.filter(r => r.kinds.includes('benchmarks')))}

## Candidates

These recent leads from the knowledge base need further verification of publication or significance. They are excluded from curated counts.

| Paper | Recorded year | Pending review | Source |
| --- | --- | --- | --- |
${candidates.map(r => `| ${md(r.title)} | ${r.year} | ${md(r.selectionReason)} | ${links(r)} |`).join('\n')}

## Sources and verification

The source table contained ${data.meta.sourceSnapshot.rows} rows: ${data.meta.sourceSnapshot.emptyRows} had no title and ${data.meta.sourceSnapshot.duplicateRows} were duplicates, leaving ${data.meta.sourceSnapshot.uniqueTitledRows} distinct titled leads. See the [selection audit](data/selection-audit.json) for their disposition. Exclusion from this snapshot is not a judgment of research quality.

Entries retain sources, review dates, environments, interfaces, limitations, and inclusion rationales. Original knowledge-base review labels have been translated into English and retained as source claims; they do not mean that a fresh full-text review or independent reproduction was performed. The raw export remains in an ignored local directory and is excluded from the repository and website. The original knowledge base has not been modified.

## Paper metadata

The website shows full titles, author lists, source dates, Paper/PDF links, and original first-page previews. Expand a record for complete authors and a copyable BibTeX citation. Citation and GitHub star counts link to their sources and carry retrieval dates; unavailable fields are omitted. Indexed versions can have different citation counts. The byline date is identified in the record details and can differ from the conference year.

See [metadata sources and refresh instructions](docs/metadata.md).

## Website and maintenance

[**Live website**](${data.meta.siteUrl}) · [GitHub repository](${data.meta.repositoryUrl})

The public website is hosted on GitHub Pages. It supports domain, resource type, topic, year, and keyword filters, with shareable URL state. The static HTML includes the complete curated list and remains readable if interactive data loading fails.

No third-party frontend dependencies are required. With Node.js 20 or later:

\`\`\`sh
npm run build
npm run check
npm run dev
\`\`\`

Open the local URL printed by the server.

- **Catalogue:** ${tick}data/resources.json${tick} is the source of truth. Keep summaries and labels in English.
- **Website:** ${tick}dist/${tick} contains the static page and browser assets.
- **Generated content:** The build synchronizes the README, resource list, website data, and supporting documents. Edit the catalogue and build script rather than generated resource rows.
- **Publishing:** In repository Settings → Pages, select GitHub Actions. Pushes to ${tick}main${tick} check, build, and publish automatically. The **Publish GitHub Pages** workflow also supports manual runs.
- **Forks:** Update ${tick}repositoryUrl${tick} and ${tick}siteUrl${tick} in the catalogue and the repository links in the page before publishing your own copy.

This is a manually maintained snapshot; there is no scheduled paper scraper or automatic write-back to Feishu.

## Acknowledgements

The game research starts from the supplied [Game Agent knowledge base](${data.meta.knowledgeUrl}) (original access permissions apply). Additional game and embodied resources were collected from official sources. The resource organization and website layout are inspired by [Awesome Robot Use Agent](${data.meta.referenceUrl}) by [Kairun Wen](https://github.com/kairunwen).

## License

Original website code is released under the [MIT License](LICENSE). Papers, third-party code, models, datasets, and knowledge-base materials retain their respective rights. This index does not relicense referenced works.
`;
const articleSection = `## Articles

Official author and research-team articles provide context and implementation guidance; they are not counted as peer-reviewed papers.

| Article | Author / team | Date | Research focus |
| --- | --- | --- | --- |
${selected.filter(r => r.kinds.includes('articles')).map(r => `| ${link(r.links.article, md(r.title))} | ${md(r.credit)} | ${r.sourceDate || r.year} | ${md(r.summary)} |`).join('\n')}

`;
const datasetSection = `## Datasets

These four datasets share records with their peer-reviewed papers. Follow the official data links for downloads, documentation, and license terms.

| Dataset | Domain | Contents | Sources |
| --- | --- | --- | --- |
${selected.filter(r => r.kinds.includes('datasets')).map(r => `| **${r.name}** | ${r.domains.join(' / ')} | ${md(r.summary)} | ${links(r)} |`).join('\n')}

`;
const demoSection = `## Video demos

[**Watch the playable video gallery**](${data.meta.siteUrl}#demos). Videos are embedded from original project hosts; no third-party video is copied into this repository. Games, generated worlds, real robots, and simulation have separate filters. The year identifies the source project release, not the exact recording date. Clips are qualitative author-reported evidence, not independently measured success rates.

| Demo | Setting | Credit | Watch / source | Related work |
| --- | --- | --- | --- | --- |
${selected.filter(r => r.kinds.includes('demos')).map(r => `| **${md(r.name)}** | ${md(r.demoType)} | ${md(r.credit)} | ${links(r)} | ${(r.relatedIds || []).map(id => {const item=data.resources.find(x=>x.id===id);return link(item.links.paper || item.links.project || item.links.code, item.name);}).join(' · ')} |`).join('\n')}

`;
readme = readme.replace('## Papers\n', articleSection + '## Papers\n').replace('## Benchmarks\n', datasetSection + '## Benchmarks\n').replace('## Candidates\n', demoSection + '## Candidates\n');
readme = readme.replace('## License\n', '## Citation\n\nIf this collection helps your work, cite the repository and the individual resources you use. A machine-readable [citation file](CITATION.cff) is included.\n\n## License\n');
await fs.writeFile('README.md', readme);
await fs.mkdir('dist/docs', { recursive: true });
for (const f of ['README.md', 'CONTRIBUTING.md', 'LICENSE', 'CITATION.cff']) await fs.copyFile(f, 'dist/' + f);
await fs.copyFile('docs/collection-policy.md', 'dist/docs/collection-policy.md');
await fs.copyFile('docs/metadata.md', 'dist/docs/metadata.md');
await fs.copyFile('data/selection-audit.json', 'dist/selection-audit.json');
console.log(`Built ${selected.length} selected resources and ${candidates.length} candidates.`);
