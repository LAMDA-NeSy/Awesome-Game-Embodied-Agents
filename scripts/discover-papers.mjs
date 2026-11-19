import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const catalogueFile = 'data/resources.json';
const configFile = 'data/discovery-config.json';
const maintenanceFile = 'data/maintenance.json';
const normalize = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '');
const clean = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const decodeXml = value => clean(String(value || '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))));
const isoDay = date => date.toISOString().slice(0, 10);
const yearsAgo = (today, years) => {
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCFullYear(date.getUTCFullYear() - years);
  return isoDay(date);
};

const venueMatchers = [
  ['NeurIPS', /neural information processing systems|\bneurips\b/i],
  ['ICLR', /international conference on learning representations|\biclr\b/i],
  ['ICML', /international conference on machine learning|\bicml\b/i],
  ['CVPR', /computer vision and pattern recognition|\bcvpr\b/i],
  ['ICCV', /international conference on computer vision|\biccv\b/i],
  ['ECCV', /european conference on computer vision|\beccv\b/i],
  ['AAAI', /aaai conference on artificial intelligence/i],
  ['IJCAI', /international joint conference on artificial intelligence|\bijcai\b/i],
  ['CoRL', /conference on robot learning|\bcorl\b/i],
  ['RSS', /robotics[,: ]+science and systems|robotics science and systems/i],
  ['ICRA', /international conference on robotics and automation|\bicra\b/i],
  ['IROS', /intelligent robots and systems|\biros\b/i],
  ['Nature', /^nature$/i],
  ['Science', /^science$/i],
  ['T-RO', /transactions on robotics/i],
  ['IJRR', /international journal of robotics research/i],
  ['TPAMI', /pattern analysis and machine intelligence/i],
  ['JMLR', /journal of machine learning research/i],
  ['TMLR', /transactions on machine learning research/i]
];

const gamePattern = /\b(game|gaming|gameplay|video games?|minecraft|atari|doom|starcraft|poker|dota|virtual worlds?)\b/i;
const embodiedPattern = /\b(embodied|robot|robotic|manipulation|locomotion|navigation|vision[- ]language[- ]action|\bvla\b|mobile manipulator)\b/i;
const agencyPattern = /\b(agent|policy|control|planning|decision|action|world model|reinforcement learning|imitation learning|behavior cloning|autonomous)\b/i;
const highSignalPattern = /\b(game agent|embodied agent|generalist agent|vision[- ]language[- ]action|\bvla\b|robot foundation model|world model|robot policy)\b/i;

export function abstractFromIndex(index) {
  if (!index || typeof index !== 'object') return '';
  const words = [];
  for (const [word, positions] of Object.entries(index)) for (const position of positions || []) words[position] = word;
  return clean(words.join(' '));
}

function sourceNames(work) {
  const locations = [work.primary_location, ...(work.locations || [])].filter(Boolean);
  return locations.map(location => location.source?.display_name).filter(Boolean);
}

function venueFor(work) {
  const names = sourceNames(work);
  for (const [label, pattern] of venueMatchers) if (names.some(name => pattern.test(name))) return label;
  return '';
}

function arxivIdFor(work) {
  const locations = [work.primary_location, work.best_oa_location, ...(work.locations || [])].filter(Boolean);
  for (const location of locations) {
    for (const url of [location.landing_page_url, location.pdf_url]) {
      const match = String(url || '').match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})/i);
      if (match) return match[1];
    }
  }
  return '';
}

function paperUrl(work) {
  if (/^https:\/\/doi\.org\//.test(work.doi || '')) return work.doi;
  const locations = [work.primary_location, work.best_oa_location, ...(work.locations || [])].filter(Boolean);
  return locations.map(location => location.landing_page_url).find(url => /^https:\/\//.test(url || '')) || work.id;
}

function pdfUrl(work) {
  const locations = [work.best_oa_location, work.primary_location, ...(work.locations || [])].filter(Boolean);
  return locations.map(location => location.pdf_url).find(url => /^https:\/\//.test(url || '')) || '';
}

function relevance(work) {
  const title = clean(work.title || work.display_name);
  const abstract = abstractFromIndex(work.abstract_inverted_index);
  const text = `${title} ${abstract}`;
  if (!agencyPattern.test(text)) return { domains: [], score: 0, title, abstract };
  const domains = [];
  if (gamePattern.test(text)) domains.push('game');
  if (embodiedPattern.test(text)) domains.push('embodied');
  if (!domains.length) return { domains, score: 0, title, abstract };
  let score = domains.length * 2;
  if (gamePattern.test(title)) score += 2;
  if (embodiedPattern.test(title)) score += 2;
  if (agencyPattern.test(title)) score += 2;
  if (highSignalPattern.test(title)) score += 2;
  score += Math.min(3, Math.floor(Number(work.cited_by_count || 0) / 5));
  return { domains, score, title, abstract };
}

function authorsFor(work) {
  return (work.authorships || []).map(item => clean(item.author?.display_name)).filter(Boolean);
}

function shortName(title) {
  const beforeColon = title.split(':')[0].trim();
  return (beforeColon.length >= 3 && beforeColon.length <= 80 ? beforeColon : title.slice(0, 80)).trim();
}

function truncate(text, limit = 360) {
  const value = clean(text);
  if (value.length <= limit) return value;
  const slice = value.slice(0, limit - 1);
  return `${slice.replace(/\s+\S*$/, '')}…`;
}

function bibtex({ id, title, authors, year, url }) {
  return `@misc{${id},\n  title = {${title.replace(/[{}]/g, '')}},\n  author = {${authors.join(' and ').replace(/[{}]/g, '')}},\n  year = {${year}},\n  url = {${url}}\n}`;
}

export function selectDiscoveries(works, catalogue, config, today) {
  const knownTitles = new Set(catalogue.resources.map(resource => normalize(resource.title)));
  const knownOpenAlex = new Set(catalogue.resources.map(resource => resource.metrics?.citations?.sourceUrl).filter(Boolean));
  const knownDoi = new Set(catalogue.resources.flatMap(resource => [resource.links?.paper, resource.bibliography?.doi ? `https://doi.org/${resource.bibliography.doi}` : '']).filter(Boolean).map(normalize));
  const peerFrom = yearsAgo(today, config.peerReviewedWindowYears);
  const knownArxiv = new Set(catalogue.resources.map(r => r.bibliography?.arxivId).filter(Boolean));
  const preprintFrom = yearsAgo(today, config.recentPreprintWindowYears);
  const seen = new Set();
  const matches = [];
  let duplicates = 0;
  for (const work of works) {
    const openAlexId = String(work.id || '');
    const titleKey = normalize(work.title || work.display_name);
    const doiKey = normalize(work.doi);
    if (!openAlexId || !titleKey || seen.has(openAlexId) || knownOpenAlex.has(openAlexId) || knownTitles.has(titleKey) || (doiKey && knownDoi.has(doiKey))) {
      duplicates += 1;
      continue;
    }
    seen.add(openAlexId);
    const publicationDate = work.publication_date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publicationDate) || publicationDate > today || work.language && work.language !== 'en') continue;
    const venue = venueFor(work);
    const arxivId = arxivIdFor(work);
    const related = relevance(work);
    if (!related.domains.length || !authorsFor(work).length || related.abstract.length < 200 || (arxivId && knownArxiv.has(arxivId))) continue;
    const officialHost = /^(?:proceedings\.neurips\.cc|proceedings\.mlr\.press|openaccess\.thecvf\.com|ojs\.aaai\.org|ijcai\.org|www\.ijcai\.org|roboticsproceedings\.org|www\.roboticsproceedings\.org|ieeexplore\.ieee\.org|nature\.com|www\.nature\.com|science\.org|www\.science\.org|jmlr\.org|www\.jmlr\.org|journals\.sagepub\.com)$/;
    const official = (work.locations || []).some(l => { try { return officialHost.test(new URL(l.landing_page_url).hostname); } catch { return false; } });
    const workshop = /workshop|adjunct|non-archival/i.test(work._comment || '') || sourceNames(work).some(n => /workshop|adjunct/i.test(n));
    const isPeerReviewed = Boolean(venue) && official && !workshop && work.type !== 'preprint' && publicationDate >= peerFrom;
    const evaluated = /evaluat|experiment|benchmark/i.test(related.abstract) && /multi.task|multiple.*tasks|across.*tasks|task suites|benchmarks|generalization|real.world/i.test(related.abstract);
    const projectSources = (work._projectSources || []).filter(url => /^https:\/\//.test(url));
    const isRecentPreprint = Boolean(arxivId) && work._provider === 'arXiv' && !workshop && publicationDate >= preprintFrom && evaluated && projectSources.length > 0 && related.score >= 7;
    if (!isPeerReviewed && !isRecentPreprint) continue;
    matches.push({ work, ...related, venue, arxivId, isPeerReviewed, publicationDate, influenceSources: projectSources });
    knownTitles.add(titleKey);
    if (arxivId) knownArxiv.add(arxivId);
    if (doiKey) knownDoi.add(doiKey);
  }
  matches.sort((a, b) => Number(b.isPeerReviewed) - Number(a.isPeerReviewed) || b.score - a.score || Number(b.work.cited_by_count || 0) - Number(a.work.cited_by_count || 0) || b.publicationDate.localeCompare(a.publicationDate));
  return { matches: matches.slice(0, config.maxPapersPerRun), duplicates, peerFrom, preprintFrom };
}

export function createEntry(match, rank, today) {
  const { work, title, abstract, domains, venue, arxivId, isPeerReviewed, publicationDate } = match;
  const sourceKey = arxivId || String(work.id).split('/').pop();
  const id = `auto-${work._provider === 'arXiv' ? 'arxiv-' : ''}${sourceKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const authors = authorsFor(work);
  const url = paperUrl(work);
  const pdf = pdfUrl(work);
  const year = Number(work.publication_year || publicationDate.slice(0, 4));
  const summary = abstract ? truncate(abstract) : 'Automated discovery lead for a potentially relevant game or embodied-agent paper; the abstract and technical claims require curator review.';
  const entry = {
    id,
    name: shortName(title),
    title,
    domains,
    kinds: ['papers'],
    year,
    venue: isPeerReviewed ? `${venue} ${year}` : `arXiv · ${publicationDate.slice(0, 7)}`,
    summary,
    tags: [domains.includes('game') ? 'Game agents' : 'Robot learning'],
    environment: 'Task settings are described in the linked official abstract and research report.',
    interface: 'See the original report for observation access, action representation, and execution protocol.',
    limits: 'Automatically selected from source metadata, task-evaluation evidence, and author-linked resources. Results are author-reported and have not been independently reproduced.',
    status: 'selected',
    evidence: `Automatically discovered through ${work._provider || 'OpenAlex'}; source metadata and evaluation evidence checked automatically; experiments not independently reproduced.`,
    sourceType: 'automated-discovery',
    checkedAt: today,
    links: { paper: url, ...(pdf ? { pdf } : {}), ...(match.influenceSources?.[0] ? { project: match.influenceSources[0] } : {}) },
    rank,
    sourceId: sourceKey,
    selectionTrack: isPeerReviewed ? 'peer-reviewed' : 'recent-arxiv',
    influenceSources: match.influenceSources || [],
    eligibilityWindow: { asOf: today, from: yearsAgo(today, isPeerReviewed ? 5 : 1), to: today },
    selectionReason: isPeerReviewed
      ? `${venue} record within the rolling five-year window, with an official proceedings/publisher location and relevant agent evaluations.`
      : 'Recent official arXiv report with systematic task evaluations and author-linked project or code resources; automated significance proxy, not a citation ranking.',
    paperType: 'method',
    publicationDate,
    bibliography: {
      source: work._provider || 'OpenAlex',
      sourceUrl: work.id,
      checkedAt: today,
      authors: authors.length ? authors : ['Authors pending verification'],
      date: publicationDate,
      dateLabel: work._provider === 'arXiv' ? 'First arXiv submission' : arxivId ? 'First indexed preprint date (verify on arXiv)' : 'Indexed publication date (OpenAlex)',
      ...(arxivId ? { arxivId } : {}),
      ...(work.doi ? { doi: work.doi.replace(/^https:\/\/doi\.org\//, '') } : {}),
      bibtex: bibtex({ id, title, authors: authors.length ? authors : ['Authors pending verification'], year, url })
    },
    ...(work._provider === 'arXiv' ? {} : { metrics: {
      citations: {
        value: Math.max(0, Number(work.cited_by_count || 0)),
        source: 'OpenAlex',
        sourceUrl: work.id,
        updatedAt: today,
        recordTitle: title
      }
    } }),
    addedAt: today,
    updatedAt: today
  };
  return entry;
}

async function fetchOpenAlexWorks(config, today) {
  if (!process.env.OPENALEX_API_KEY) return { works: [], failures: ['OpenAlex enrichment skipped: OPENALEX_API_KEY is not configured.'] };
  const from = yearsAgo(today, config.peerReviewedWindowYears);
  const results = [];
  const failures = [];
  for (const query of config.queries) {
    const url = new URL('https://api.openalex.org/works');
    url.searchParams.set('search', query);
    url.searchParams.set('filter', `from_publication_date:${from},to_publication_date:${today}`);
    url.searchParams.set('per-page', String(config.resultsPerQuery));
    url.searchParams.set('select', 'id,doi,title,display_name,publication_year,publication_date,type,cited_by_count,authorships,primary_location,locations,best_oa_location,abstract_inverted_index,language');
    if (process.env.OPENALEX_API_KEY) url.searchParams.set('api_key', process.env.OPENALEX_API_KEY);
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Awesome-Game-Embodied-Agents/1.0' }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      results.push(...(body.results || []).map(work => ({ ...work, _provider: 'OpenAlex' })));
    } catch (error) {
      failures.push(`OpenAlex query '${query}' failed: ${error.message}`);
    }
  }
  return { works: results, failures };
}

function atomEntries(xml) {
  return [...String(xml).matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(match => match[1]);
}

function atomValue(entry, tag) {
  return decodeXml(entry.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1] || '');
}

export function arxivWork(entry) {
  const rawId = atomValue(entry, 'id');
  const arxivId = rawId.match(/abs\/(\d{4}\.\d{4,5})/i)?.[1];
  if (!arxivId) return null;
  const title = atomValue(entry, 'title');
  const summary = atomValue(entry, 'summary');
  const published = atomValue(entry, 'published').slice(0, 10);
  const authors = [...entry.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)].map(match => ({ author: { display_name: decodeXml(match[1]) } }));
  const pdf = decodeXml(entry.match(/<link\s+[^>]*href="([^"]+)"[^>]*(?:title="pdf"|type="application\/pdf")[^>]*\/?\s*>/i)?.[1] || `https://arxiv.org/pdf/${arxivId}`);
  const words = summary.split(/\s+/).filter(Boolean);
  const abstract_inverted_index = {};
  words.forEach((word, index) => (abstract_inverted_index[word] ||= []).push(index));
  const source = { display_name: 'arXiv' };
  const location = { landing_page_url: `https://arxiv.org/abs/${arxivId}`, pdf_url: pdf.replace(/^http:/, 'https:'), source };
  return {
    id: `https://arxiv.org/abs/${arxivId}`,
    doi: null,
    title,
    display_name: title,
    publication_year: Number(published.slice(0, 4)),
    publication_date: published,
    type: 'preprint',
    cited_by_count: 0,
    authorships: authors,
    primary_location: location,
    locations: [location],
    best_oa_location: location,
    abstract_inverted_index,
    language: 'en',
    _provider: 'arXiv',
    _comment: atomValue(entry, 'arxiv:comment'),
    _projectSources: [...(summary + ' ' + atomValue(entry, 'arxiv:comment')).matchAll(/https:\/\/[^\s<>]+/g)].map(m => m[0].replace(/[.,;)]+$/, '')).filter(u => !/arxiv\.org/.test(u))
  };
}

async function fetchArxivWorks(config) {
  const batches = [];
  for (let index = 0; index < config.queries.length; index += 5) batches.push(config.queries.slice(index, index + 5));
  const works = [];
  const failures = [];
  for (let index = 0; index < batches.length; index += 1) {
    const search = batches[index].map(query => `all:\"${query.replace(/\"/g, '')}\"`).join(' OR ');
    const url = new URL('https://export.arxiv.org/api/query');
    url.searchParams.set('search_query', search);
    url.searchParams.set('start', '0');
    url.searchParams.set('max_results', String(config.arxivResultsPerBatch));
    url.searchParams.set('sortBy', 'submittedDate');
    url.searchParams.set('sortOrder', 'descending');
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Awesome-Game-Embodied-Agents/1.0' }, signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const xml = await response.text();
      works.push(...atomEntries(xml).map(arxivWork).filter(Boolean));
    } catch (error) {
      failures.push(`arXiv query batch ${index + 1} failed: ${error.message}`);
    }
    if (index + 1 < batches.length) await new Promise(resolve => setTimeout(resolve, 3000));
  }
  return { works, failures };
}

async function fetchWorks(config, today) {
  const [arxiv, openAlex] = await Promise.all([fetchArxivWorks(config), fetchOpenAlexWorks(config, today)]);
  return { works: [...arxiv.works, ...openAlex.works], failures: [...arxiv.failures, ...openAlex.failures] };
}

export async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const fixtureArg = process.argv.find(arg => arg.startsWith('--fixture='));
  const todayArg = process.argv.find(arg => arg.startsWith('--today='));
  const today = todayArg ? todayArg.split('=')[1] : isoDay(new Date());
  const [catalogue, config] = await Promise.all([
    fs.readFile(catalogueFile, 'utf8').then(JSON.parse),
    fs.readFile(configFile, 'utf8').then(JSON.parse)
  ]);
  const fetched = fixtureArg
    ? { works: JSON.parse(await fs.readFile(fixtureArg.slice('--fixture='.length), 'utf8')).results, failures: [] }
    : await fetchWorks(config, today);
  const works = fetched.works;
  const selected = selectDiscoveries(works, catalogue, config, today);
  catalogue.meta.discoveryWindows = { asOf: today, paper: { from: selected.peerFrom, to: today }, arxiv: { from: selected.preprintFrom, to: today } };
  const nextRank = Math.max(0, ...catalogue.resources.map(resource => Number(resource.rank || 0))) + 1;
  const additions = [];
  for (const match of selected.matches) {
    const source = match.influenceSources?.[0] || paperUrl(match.work);
    if (!fixtureArg) {
      try {
        const response = await fetch(source, { signal: AbortSignal.timeout(15000), redirect: 'follow' });
        await response.body?.cancel();
        if (!response.ok) { fetched.failures.push(`Source unavailable for ${match.title}: HTTP ${response.status}`); continue; }
      } catch { fetched.failures.push(`Source unavailable for ${match.title}`); continue; }
    }
    additions.push(createEntry(match, nextRank + additions.length, today));
  }
  if (!dryRun) {
    catalogue.resources.push(...additions);
    await fs.writeFile(catalogueFile, `${JSON.stringify(catalogue, null, 2)}\n`);
  }
  let maintenance = {};
  try { maintenance = JSON.parse(await fs.readFile(maintenanceFile, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  maintenance.paperDiscovery = {
    checkedAt: new Date().toISOString(),
    provider: config.provider,
    rollingPeerReviewedWindow: { from: selected.peerFrom, to: today },
    rollingRecentPreprintWindow: { from: selected.preprintFrom, to: today },
    queries: config.queries.length,
    selectionMode: 'direct',
    scanned: works.length,
    duplicates: selected.duplicates,
    added: additions.length,
    addedIds: additions.map(candidate => candidate.id),
    failures: fetched.failures,
    dryRun
  };
  if (!dryRun) await fs.writeFile(maintenanceFile, `${JSON.stringify(maintenance, null, 2)}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = additions.length ? additions.map(candidate => `- **${candidate.title}** (${candidate.domains.join(' / ')})`).join('\n') : '- No new papers found.';
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `### New-paper discovery\n\nScanned ${works.length} bibliographic records and added ${additions.length} papers. ${fetched.failures.length} provider request(s) were skipped or failed.\n\n${rows}\n`);
  }
  console.log(`Scanned ${works.length} records; ${additions.length} new paper${additions.length === 1 ? '' : 's'}.`);
  return additions;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
