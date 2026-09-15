import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { renderCatalogue, resourceDate, sortResources } from '../dist/assets/catalog.mjs';
import { renderUpdates } from '../dist/assets/updates.mjs';
import { syncCollectionDates } from './collection-history.mjs';
const data = JSON.parse(await fs.readFile('data/resources.json', 'utf8'));
const history = JSON.parse(await fs.readFile('data/updates.json', 'utf8'));
let previous = { resources: [] }, maintenance = {};
try { previous = JSON.parse(await fs.readFile('dist/resources.json', 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
try { maintenance = JSON.parse(await fs.readFile('data/maintenance.json', 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
syncCollectionDates(data.resources, previous.resources, history.baselineDate, new Date().toISOString().slice(0, 10));
const selected = data.resources.filter(r => r.status === 'selected').sort((a, b) => a.rank - b.rank);
const candidates = data.resources.filter(r => r.status === 'candidate');
const count = kind => selected.filter(r => r.kinds.includes(kind)).length;
data.meta.counts = Object.fromEntries(['articles', 'papers', 'projects', 'datasets', 'benchmarks', 'demos'].map(k => [k, count(k)]));
await fs.writeFile('data/resources.json', JSON.stringify(data, null, 2) + '\n');
await fs.copyFile('data/resources.json', 'dist/resources.json');
let html = await fs.readFile('dist/index.html', 'utf8');
const styleVersion = createHash('sha256').update(await fs.readFile('dist/assets/style.css')).digest('hex').slice(0, 12);
html = html.replace(/href="assets\/style\.css(?:\?v=[a-f0-9]+)?"/, `href="assets/style.css?v=${styleVersion}"`);
const catalogueVersion = createHash('sha256').update(await fs.readFile('dist/assets/catalog.mjs')).digest('hex').slice(0, 12);
const app = (await fs.readFile('dist/assets/app.js', 'utf8')).replace(/from '\.\/catalog\.mjs(?:\?v=[a-f0-9]+)?'/, `from './catalog.mjs?v=${catalogueVersion}'`);
await fs.writeFile('dist/assets/app.js', app);
const scriptVersion = createHash('sha256').update(app).digest('hex').slice(0, 12);
html = html.replace(/src="assets\/app\.js(?:\?v=[a-f0-9]+)?"/, `src="assets/app.js?v=${scriptVersion}"`);
html = html.replace(/(<!-- CATALOGUE:START -->)[\s\S]*?(<!-- CATALOGUE:END -->)/, () => `<!-- CATALOGUE:START -->${renderCatalogue(selected,'all',data.resources)}<!-- CATALOGUE:END -->`);
for (const [id, value] of [['nav-total', selected.length], ['stat-total', selected.length], ['stat-papers', count('papers')], ['stat-projects', count('projects')], ['stat-benchmarks', count('benchmarks')], ['stat-articles', count('articles')], ['stat-datasets', count('datasets')], ['stat-demos', count('demos')]]) {
  html = html.replace(new RegExp(`(id="${id}">)[^<]*`), `$1${value}`);
}
html = html.replace(/(<p id="result-count"[^>]*>)[\s\S]*?<\/p>/, `$1${selected.length} unique resources</p>`);
html = html.replace(/(<!-- UPDATES:START -->)[\s\S]*?(<!-- UPDATES:END -->)/, () => `<!-- UPDATES:START -->${renderUpdates(data, history, maintenance)}<!-- UPDATES:END -->`);
const latestContentDate = sortResources(data.resources, 'updated')[0]?.updatedAt || history.baselineDate;
html = html.replace(/(<span id="collection-updated">)[^<]*/, `$1Collection revised · ${latestContentDate}`);
html = html.replace(/(<span id="metrics-checked">)[^<]*/, `$1${maintenance.metricsRefresh ? `Metrics checked · ${maintenance.metricsRefresh.checkedAt.slice(0, 10)}` : 'Source-dated metrics'}`);
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
<h3>Paper records and metrics</h3><p>Paper rows include full titles, credited authors, source dates, PDF links, and original first-page previews where available. Dates are labeled Published, Preprint, or Indexed according to their source. Venue / release year and Source date are separate sort options. Year filters use the conference or journal year for papers; proceedings dates can differ. Recently added and Recently revised refer to the collection, not to publication. Expand Details &amp; sources for the complete author list and a BibTeX citation.</p><p>Citations come from the linked OpenAlex or Crossref record, and stars from the linked GitHub repository. Each count carries its retrieval date. Counts are cached snapshots and can differ across paper versions and databases. Missing resource links appear as muted, non-clickable icons; unavailable citation and star counts show an em dash. See <a href="docs/metadata.md">metadata sources and maintenance</a>.</p><h3>Comparing game and embodied agents</h3>
<div class="table-wrap"><table><thead><tr><th>Dimension</th><th>Game research</th><th>Embodied research</th></tr></thead><tbody>
<tr><td>Environment & task</td><td>Game, map, mode, and task scope</td><td>Hardware, scene, objects, and manipulation tasks</td></tr>
<tr><td>Observation access</td><td>Pixels, audio, text, or engine state</td><td>Images, depth, touch, and proprioception</td></tr>
<tr><td>Action abstraction</td><td>Keyboard/mouse, program APIs, or skills</td><td>Joints, end-effector poses, or navigation/manipulation skills</td></tr>
<tr><td>Data & learning</td><td>Player traces, online interaction, video pretraining</td><td>Demonstrations, teleoperation, simulation, real interaction</td></tr>
<tr><td>Execution constraints</td><td>Decision latency, frame rate, paused execution</td><td>Control frequency, collisions, hardware limits</td></tr>
<tr><td>Evaluation</td><td>Map splits, task metrics, samples, and seeds</td><td>Task success, generalization, and human intervention</td></tr></tbody></table></div>
<p>Shared methods do not by themselves establish transfer between domains. Frame generation, game navigation, robot planning, and physical execution retain their respective evidence boundaries.</p>
<h3>Video demonstrations</h3><p>The video gallery embeds original research-team videos, with source links, credits, and related work. Game control, generated frames, real robots, and simulation are labeled separately. Selected clips illustrate behavior; they do not replace benchmark evaluations. Videos load as you approach them and play only when requested. If an external host is unavailable, use the source link on the card.</p><h3>Maintenance and contributions</h3>
<p>The README and website share the same catalogue. New additions are manually curated. Weekly maintenance checks existing source links and refreshes verified statistics. See <a href="#updates">What’s new</a> for recent additions, the update log, and maintenance reports. Additions should include official sources and satisfy the selection criteria. Read the <a href="CONTRIBUTING.md">contribution guide</a> or visit the <a href="${data.meta.repositoryUrl}" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>`;
html = html.replace(/(<section id="about" class="about-panel" hidden>)[\s\S]*?<\/section>/, `$1${about}</section>`);
await fs.writeFile('dist/index.html', html);
const md = s => String(s || '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const link = (url, text) => url ? `[${text}](${url})` : '';
const links = r => Object.entries(r.links).map(([k, v]) => link(v, { paper: 'Paper', code: 'Code', project: 'Project', data: 'Data', article: 'Article', video: 'Video', pdf: 'PDF', model: 'Models' }[k] || k)).join(' · ');
const authorLine = r => {const authors=r.bibliography?.authors||[];return authors.slice(0,3).join(', ')+(authors.length>3?' et al.':'');};
const metricsLine = r => [r.metrics?.citations,r.metrics?.github].filter(m=>Number.isInteger(m?.value)).map(m=>link(m.sourceUrl,`${m.value.toLocaleString('en-US')} ${m.source==='GitHub'?'stars':'citations'} · ${m.source} · ${m.updatedAt}`)).join('<br>');
const paperRows = items => items.map(r => {const date=resourceDate(r);return `| **${link(r.links.paper, r.title)}**<br>${md(authorLine(r))}${date.value?`<br>${date.label}: ${date.value}`:''} | ${md(r.venue)} | ${md(r.summary)} | ${links(r)}${metricsLine(r)?'<br>'+metricsLine(r):''} |`;}).join('\n');
const projectRows = items => items.map(r => `| **${r.name}** | ${md(r.environment)} | ${md(r.interface)} | ${md(r.limits)} | ${links(r)} |`).join('\n');
const tick = String.fromCharCode(96);
let readme = `# Awesome Game & Embodied Agents

**A living, open research collection for agents that perceive, reason, learn, and act—from virtual worlds to the physical world.**

[**Explore the website ↗**](${data.meta.siteUrl}) · [What’s new](${data.meta.siteUrl}#updates) · [Browse papers](#papers) · [Watch demos](#video-demos) · [Contribute](CONTRIBUTING.md)

**${count('papers')} papers · ${count('articles')} articles · ${count('projects')} projects · ${count('datasets')} datasets · ${count('benchmarks')} benchmarks · ${count('demos')} video demos**

## Welcome

Welcome, and thank you for stopping by. This repository is for researchers, engineers, students, and curious builders who want to understand how ideas move between game intelligence and embodied intelligence.

We hope it helps you find a paper worth reading, a codebase worth trying, a benchmark that fits your question, or a new connection between virtual and physical agents. The collection is maintained in the open, and thoughtful contributions of every size are welcome.

If this project saves you time or sparks an idea, please consider giving it a **star**. Stars help more people discover the collection. You can also help by:

- suggesting an important paper, project, dataset, benchmark, or official demo;
- reporting a broken link or correcting a source;
- improving a summary, comparison note, or research category;
- sharing the collection with a lab, reading group, class, or collaborator.

[**Star the repository ↗**](${data.meta.repositoryUrl}) · [**Read the contribution guide ↗**](CONTRIBUTING.md) · [**Open a contribution ↗**](${data.meta.repositoryUrl}/issues)

## Our vision

We want this project to grow from a useful list into a shared research map: one that makes it easier to trace ideas, compare evidence, reproduce systems, and see where game agents and embodied agents can learn from one another.

![Future vision: virtual game worlds and physical robots connected through shared world models, memory, language, planning, data, and continual learning](docs/assets/future-vision.png)

*A continuous research loop: virtual experience informs shared models and methods; physical interaction returns new evidence, constraints, and learning signals.*

Our long-term direction is to:

- **connect research communities** through shared themes such as world models, memory, planning, multimodal learning, and action interfaces;
- **keep evidence traceable** with official paper, code, data, model, project, citation, and demo sources;
- **make comparison more useful** by preserving task definitions, observation access, action spaces, and evaluation boundaries;
- **lower the entry barrier** with readable summaries, curated learning paths, and working examples;
- **stay current together** through reviewed additions, transparent update logs, and regular source checks.

Game agents operate in virtual environments through pixels, language, game APIs, or keyboard and mouse actions. Embodied agents connect perception and planning to simulated or physical robot actions. Similar methods can inspire each other, while every comparison must still respect the environment, interface, and evidence behind the result.

Snapshot: **${data.meta.snapshotDate}**. The collection contains **${selected.length} unique curated resources**. Dataset and benchmark papers appear in multiple views, so category counts overlap. ${candidates.length} candidate papers remain separate until their evidence is reviewed.

## Contents

- [Welcome](#welcome)
- [Our vision](#our-vision)
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

- **Explore the live collection:** Search and filter the [interactive website](${data.meta.siteUrl}) by domain, topic, year, contribution type, and code availability.
- **Follow a research thread:** Start with [game-agent papers](#game-agents) on world models, exploration, memory, and control, or [embodied-agent papers](#embodied-agents) on robot policies and planning.
- **Build and reproduce:** Find [open-source projects](#projects), [datasets](#datasets), and source-linked implementations for data collection, policy training, and environment interfaces.
- **Evaluate carefully:** Browse [benchmarks and environments](#benchmarks), then align observation access, action spaces, training budgets, hardware, and evaluation protocols.
- **See agents in action:** Watch [official-source video demonstrations](#video-demos) from gameplay, generated worlds, simulation, and real robots.
- **Join the community:** Follow the friendly [contribution guide](CONTRIBUTING.md) to recommend a resource, improve a record, or report a problem.

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

The website shows full titles, author lists, source dates, Paper/PDF links, and original first-page previews. Expand a record for complete authors and a copyable BibTeX citation. Citation and GitHub star counts link to their sources and carry retrieval dates. Missing resource links appear as muted, non-clickable icons on the website; unavailable citation and star counts show an em dash. Indexed versions can have different citation counts. Source dates are visibly labeled Published, Preprint, or Indexed. The venue year remains separate, with explicit year and source-date sorting. Category views and homepage groups use the same membership rule; category counts overlap, while All resources counts each record once.

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

Weekly maintenance runs every Monday at approximately 09:17 Asia/Shanghai (01:17 UTC). It refreshes previously verified citation and star records, checks source links, preserves failed snapshots with their original dates, validates the catalogue, and publishes the report. GitHub schedules may run later than the scheduled time. New papers and link corrections remain editorial decisions; there is no automatic paper selection or write-back to Feishu.

See [what’s new](${data.meta.siteUrl}#updates), the [update log](CHANGELOG.md), and [maintenance instructions](docs/metadata.md). The workflow can also be started manually with its refresh option enabled.

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
const conciseReadme = `<div align="center">

<img src="docs/assets/readme-emblem.png" alt="Awesome Game & Embodied Agents emblem: a virtual game world connected to a robotic hand through a shared portal" width="180" />

# Awesome Game & Embodied Agents

[![Awesome](https://img.shields.io/badge/Awesome-List-173c31.svg?style=for-the-badge&labelColor=102c25&logo=awesomelists&logoColor=white)](https://awesome.re) [![Website](https://img.shields.io/badge/Website-Explore-173c31.svg?style=for-the-badge&labelColor=102c25&logo=githubpages&logoColor=white)](${data.meta.siteUrl}) [![Resources](https://img.shields.io/badge/Resources-${selected.length}-173c31.svg?style=for-the-badge&labelColor=102c25&logo=readthedocs&logoColor=white)](${data.meta.siteUrl}#all) [![Papers](https://img.shields.io/badge/Papers-${count('papers')}-173c31.svg?style=for-the-badge&labelColor=102c25&logo=arxiv&logoColor=white)](${data.meta.siteUrl}#papers) [![Demos](https://img.shields.io/badge/Demos-${count('demos')}-173c31.svg?style=for-the-badge&labelColor=102c25&logo=youtube&logoColor=white)](${data.meta.siteUrl}#demos)
<br>
[![PRs welcome](https://img.shields.io/badge/PRs-Welcome-c8a85b.svg?style=for-the-badge&labelColor=8b6c2e&logo=git&logoColor=white)](CONTRIBUTING.md) [![License: MIT](https://img.shields.io/badge/License-MIT-c8a85b.svg?style=for-the-badge&labelColor=8b6c2e)](LICENSE) [![GitHub Stars](https://img.shields.io/github/stars/LAMDA-NeSy/Awesome-Game-Embodied-Agents?style=for-the-badge&label=Stars&labelColor=8b6c2e&color=c8a85b&logo=github&logoColor=white)](${data.meta.repositoryUrl})

[Game research](${data.meta.siteUrl}#papers?domain=game) · [Embodied research](${data.meta.siteUrl}#papers?domain=embodied) · [Projects](${data.meta.siteUrl}#projects) · [Datasets](${data.meta.siteUrl}#datasets) · [Benchmarks](${data.meta.siteUrl}#benchmarks) · [Video demos](${data.meta.siteUrl}#demos)

</div>

> A curated research map for agents that **perceive, reason, learn, and act**—from virtual game worlds to simulated and physical robots.

This repository connects game intelligence and embodied intelligence through papers, projects, datasets, benchmarks, and official demos. The full collection is designed for exploration on the [interactive website](${data.meta.siteUrl}); this README is the short guide.

## Welcome

Researchers, engineers, students, and curious builders are all welcome. If the collection saves you time, please consider giving it a ⭐ and sharing it with your lab, reading group, class, or collaborators.

[![Open the website](https://img.shields.io/badge/Open_the_website-Explore-3975aa?style=flat-square&logo=githubpages&logoColor=white)](${data.meta.siteUrl}) [![Browse game papers](https://img.shields.io/badge/Game-Papers-4f7289?style=flat-square&logo=steam&logoColor=white)](${data.meta.siteUrl}#papers?domain=game) [![Browse embodied papers](https://img.shields.io/badge/Embodied-Papers-577148?style=flat-square&logo=ros&logoColor=white)](${data.meta.siteUrl}#papers?domain=embodied) [![Watch demos](https://img.shields.io/badge/Watch-Demos-b64b45?style=flat-square&logo=youtube&logoColor=white)](${data.meta.siteUrl}#demos)

## Getting started

- **Understand:** begin with [surveys](${data.meta.siteUrl}#papers?paperType=survey) and the collection’s topic filters.
- **Explore:** compare game control, world models, language–action systems, VLA policies, planning, and robot learning.
- **Build:** follow the linked [projects](${data.meta.siteUrl}#projects), code, models, and datasets to the original sources.
- **Evaluate:** use [benchmarks](${data.meta.siteUrl}#benchmarks) while keeping observation access, action spaces, and task definitions aligned.
- **Watch:** open the [video gallery](${data.meta.siteUrl}#demos) for official gameplay, generated-world, simulation, and real-robot demos.

## Collection at a glance

| Research path | Curated resources |
| --- | ---: |
| Papers | **${count('papers')}** |
| Research articles | **${count('articles')}** |
| Open-source projects | **${count('projects')}** |
| Datasets | **${count('datasets')}** |
| Benchmarks & environments | **${count('benchmarks')}** |
| Video demos | **${count('demos')}** |

The snapshot contains **${selected.length} unique curated resources** and **${candidates.length} candidates** awaiting review. Category counts overlap when one resource is both a paper and a dataset or benchmark.

## Our vision

<p align="center">
  <a href="docs/assets/future-vision.png"><img src="docs/assets/future-vision.png" width="860" alt="Future vision: virtual game worlds and physical robots connected through shared world models, memory, language, planning, data, and continual learning" /></a>
</p>

We want this collection to become a shared research map: traceable enough for careful comparison, approachable enough for newcomers, and open enough for the community to improve together.

## Selection criteria

| Track | Window | Standard |
| --- | --- | --- |
| Leading conferences & journals | ${data.meta.paperWindow.from} – ${data.meta.paperWindow.to} | Relevant publication with an official record |
| Important recent arXiv research | ${data.meta.arxivWindow.from} – ${data.meta.arxivWindow.to} | Clear influence or significance with supporting evidence |
| Tools & environments | Current research use | Official purpose, interfaces, and setup information |

Priority venues include NeurIPS, ICLR, ICML, CVPR, ICCV, ECCV, AAAI, IJCAI, CoRL, RSS, ICRA, IROS, Nature, Science, T-RO, IJRR, TPAMI, JMLR, and TMLR. Read the [full collection policy](docs/collection-policy.md) and [metadata notes](docs/metadata.md).

## 🤝 Contributing

Suggestions, corrections, new papers, working demos, and better summaries are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) or [open an issue](${data.meta.repositoryUrl}/issues).

[![Suggest a resource](https://img.shields.io/badge/Suggest-a_resource-268675?style=flat-square&logo=github)](${data.meta.repositoryUrl}/issues) [![Improve the collection](https://img.shields.io/badge/Improve-the_collection-956b27?style=flat-square&logo=git)](CONTRIBUTING.md) [![What’s new](https://img.shields.io/badge/What's_new-Updates-666666?style=flat-square&logo=rss)](${data.meta.siteUrl}#updates)

## 📖 Citation

If this collection helps your work, cite the repository and the individual resources you use. A machine-readable [CITATION.cff](CITATION.cff) is included.

${'```'}bibtex
@misc{awesome-game-embodied-agents,
  title  = {Awesome Game & Embodied Agents},
  author = {Renmin Cheng and contributors},
  year   = {2026},
  url    = {${data.meta.repositoryUrl}}
}
${'```'}

## 🙏 Acknowledgements

The game research starts from the supplied [Game Agent knowledge base](${data.meta.knowledgeUrl}). Additional game and embodied resources come from official papers, project sites, and repositories. The organization and presentation are inspired by [Awesome Robot Use Agent](${data.meta.referenceUrl}) by [Kairun Wen](https://github.com/kairunwen).

Original project code is released under the [MIT License](LICENSE). Papers, code, models, datasets, logos, and demos retain their respective rights.

<div align="center">

**If this research map is useful, a ⭐ helps more people find it.**

</div>
`;
await fs.writeFile('README.md', conciseReadme);
const changelog = `# Collection updates\n\nCollection-history baseline: **${history.baselineDate}**. Added and revised dates describe this index, independently of publication dates and metric retrieval dates.\n\n` + history.entries.map(entry => `## ${entry.date} · ${entry.title}\n\n${entry.type}. ${entry.summary}\n`).join('\n');
await fs.writeFile('CHANGELOG.md', changelog);
await fs.mkdir('dist/docs', { recursive: true });
for (const f of ['README.md', 'CONTRIBUTING.md', 'LICENSE', 'CITATION.cff', 'CHANGELOG.md']) await fs.copyFile(f, 'dist/' + f);
await fs.mkdir('dist/docs/assets', { recursive: true });
await fs.copyFile('docs/assets/future-vision.png', 'dist/docs/assets/future-vision.png');
await fs.copyFile('docs/assets/readme-emblem.png', 'dist/docs/assets/readme-emblem.png');
await fs.copyFile('data/updates.json', 'dist/updates.json');
await fs.writeFile('dist/maintenance.json', JSON.stringify(maintenance, null, 2) + '\n');
await fs.copyFile('docs/collection-policy.md', 'dist/docs/collection-policy.md');
await fs.copyFile('docs/metadata.md', 'dist/docs/metadata.md');
await fs.copyFile('data/selection-audit.json', 'dist/selection-audit.json');
console.log(`Built ${selected.length} selected resources and ${candidates.length} candidates.`);
