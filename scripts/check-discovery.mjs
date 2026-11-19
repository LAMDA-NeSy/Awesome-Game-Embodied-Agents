import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createEntry, selectDiscoveries } from './discover-papers.mjs';

const [fixture, catalogue, config] = await Promise.all([
  fs.readFile('scripts/fixtures/openalex-discovery.json', 'utf8').then(JSON.parse),
  fs.readFile('data/resources.json', 'utf8').then(JSON.parse),
  fs.readFile('data/discovery-config.json', 'utf8').then(JSON.parse)
]);
const recent = fixture.results[1]; recent._provider='arXiv'; recent._projectSources=['https://example.org/arena']; recent.abstract_inverted_index=Object.fromEntries('An autonomous game agent learns actions across multiple tasks and benchmarks with systematic experimental evaluations and generalization studies in virtual worlds using visual observations and native keyboard mouse controls under diverse task configurations for long horizon policy learning'.split(' ').map((word,i)=>[word,[i]]));
fixture.results[0].locations=[{landing_page_url:'https://proceedings.mlr.press/v999/example.html'}];
fixture.results[0].abstract_inverted_index=recent.abstract_inverted_index;
const result = selectDiscoveries(fixture.results, catalogue, config, '2026-11-19');
assert.equal(result.matches.length, 2, 'Expected one peer-reviewed and one recent preprint');
assert.deepEqual(new Set(result.matches.flatMap(match => match.domains)), new Set(['game', 'embodied']));
const entries = result.matches.map((match, index) => createEntry(match, 1000 + index, '2026-11-19'));
assert(entries.every(entry => entry.status === 'selected' && ['peer-reviewed','recent-arxiv'].includes(entry.selectionTrack)));
assert(entries.some(entry => entry.venue.includes('CoRL')));
assert(entries.some(entry => entry.bibliography.arxivId === '2611.00001'));
assert(!entries.some(entry => entry.title.includes('Clinical Study')));
console.log('Validated scheduled paper discovery, relevance filtering, and direct inclusion.');

assert.equal(selectDiscoveries(fixture.results,{resources:entries},config,'2026-11-19').matches.length,0,'Reruns must not duplicate selected papers');
const unsupported=structuredClone(fixture.results[1]); unsupported._projectSources=[];
assert.equal(selectDiscoveries([unsupported],{resources:[]},config,'2026-11-19').matches.length,0,'Keywords alone must not establish significance');
const workshop=structuredClone(fixture.results[1]); workshop._comment='Accepted at a workshop';
assert.equal(selectDiscoveries([workshop],{resources:[]},config,'2026-11-19').matches.length,0,'Workshop leads must not enter through the preprint shortcut');
