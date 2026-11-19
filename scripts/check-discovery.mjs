import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createCandidate, selectDiscoveries } from './discover-papers.mjs';

const [fixture, catalogue, config] = await Promise.all([
  fs.readFile('scripts/fixtures/openalex-discovery.json', 'utf8').then(JSON.parse),
  fs.readFile('data/resources.json', 'utf8').then(JSON.parse),
  fs.readFile('data/discovery-config.json', 'utf8').then(JSON.parse)
]);
const result = selectDiscoveries(fixture.results, catalogue, config, '2026-11-19');
assert.equal(result.matches.length, 2, 'Expected one peer-reviewed and one recent-preprint candidate');
assert.deepEqual(new Set(result.matches.flatMap(match => match.domains)), new Set(['game', 'embodied']));
const entries = result.matches.map((match, index) => createCandidate(match, 1000 + index, '2026-11-19'));
assert(entries.every(entry => entry.status === 'candidate' && entry.selectionTrack === 'candidate'));
assert(entries.some(entry => entry.venue.includes('CoRL')));
assert(entries.some(entry => entry.bibliography.arxivId === '2611.00001'));
assert(!entries.some(entry => entry.title.includes('Clinical Study')));
console.log('Validated scheduled paper discovery, relevance filtering, and candidate generation.');
