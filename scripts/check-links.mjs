import fs from 'node:fs/promises';
import { safeUrl } from '../dist/assets/catalog.mjs';

export function classifyStatus(status) {
  if (status >= 200 && status < 400) return 'ok';
  if (status === 404 || status === 410) return 'broken';
  if ([401, 403, 429].includes(status)) return 'restricted';
  return 'unreachable';
}

export function collectLinks(resources) {
  const links = new Map();
  for (const r of resources) {
    for (const value of [...Object.values(r.links), r.video?.src, r.bibliography?.sourceUrl, ...(r.influenceSources || [])]) {
      if (!safeUrl(value)) continue;
      const url = new URL(value); url.hash = '';
      if (!links.has(url.href)) links.set(url.href, new Set());
      links.get(url.href).add(r.id);
    }
  }
  return [...links].map(([url, ids]) => ({ url, resourceIds: [...ids].sort() }));
}

export async function probeLink(url, request = fetch) {
  async function probe(method) {
    const response = await request(url, {
      method, redirect: 'follow', signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': 'Awesome-Game-Embodied-Agents-Link-Check/1.0', ...(method === 'GET' ? { Range: 'bytes=0-0' } : {}) }
    });
    await response.body?.cancel();
    return response.status;
  }
  try {
    let status = await probe('HEAD');
    // Confirm missing links with GET; some publishers do not support HEAD.
    if ([404, 405, 410, 501].includes(status)) status = await probe('GET');
    return { status: classifyStatus(status), httpStatus: status };
  } catch (error) {
    return { status: 'unreachable', reason: error.name === 'TimeoutError' ? 'timeout' : 'connection failed' };
  }
}

async function main() {
  const data = JSON.parse(await fs.readFile('data/resources.json', 'utf8'));
  const queue = collectLinks(data.resources);
  const results = [];
  // One worker per host, with four hosts in parallel, avoids bursts to publishers.
  const hosts = Map.groupBy ? Map.groupBy(queue, item => new URL(item.url).hostname) : queue.reduce((map, item) => {
    const host = new URL(item.url).hostname;
    if (!map.has(host)) map.set(host, []);
    map.get(host).push(item); return map;
  }, new Map());
  const groups = [...hosts.values()]; let next = 0;
  async function worker() {
    while (next < groups.length) {
      const group = groups[next++];
      for (const item of group) {
        results.push({ ...item, ...await probeLink(item.url) });
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  const summary = Object.fromEntries(['ok', 'broken', 'restricted', 'unreachable'].map(status => [status, results.filter(r => r.status === status).length]));
  let maintenance = {};
  try { maintenance = JSON.parse(await fs.readFile('data/maintenance.json', 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  maintenance.linkCheck = { checkedAt: new Date().toISOString(), total: results.length, summary, results: results.sort((a, b) => a.url.localeCompare(b.url)) };
  await fs.writeFile('data/maintenance.json', JSON.stringify(maintenance, null, 2) + '\n');
  const report = `Checked ${results.length} source links: ${summary.ok} reachable, ${summary.broken} missing, ${summary.restricted} restricted, ${summary.unreachable} inconclusive.`;
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `### Source link check\n\n${report}\n\nRestrictions and timeouts do not establish that a link is broken. See the published maintenance report for each result.\n`);
}

if (process.argv[1] && new URL(import.meta.url).pathname === (await import('node:path')).resolve(process.argv[1])) await main();
