import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { safeUrl } from '../dist/assets/catalog.mjs';
const data=JSON.parse(await fs.readFile('data/resources.json','utf8'));
const ids=new Set();const titles=new Set();
const selected=data.resources.filter(r=>r.status==='selected');
const allowed=/NeurIPS|ICLR|ICML|CVPR|ICCV|ECCV|AAAI|IJCAI|CoRL|RSS|ICRA|IROS|Nature|Science|TMLR|JMLR|T-RO|IJRR|TPAMI/;
for(const r of data.resources){
 assert(!ids.has(r.id),`Duplicate ID: ${r.id}`);ids.add(r.id);
 const title=r.title.toLowerCase().replace(/[^a-z0-9]/g,'');assert(!titles.has(title),`Duplicate title: ${r.title}`);titles.add(title);
 for(const field of ['name','title','summary','environment','interface','limits','evidence','selectionReason','checkedAt'])assert(r[field],`${r.id}: missing ${field}`);
 assert(r.domains.length&&r.domains.every(d=>['game','embodied'].includes(d)),`Invalid domain: ${r.id}`);
 assert(r.kinds.length&&r.kinds.every(k=>['articles','papers','projects','datasets','benchmarks','demos'].includes(k)),`Invalid kind: ${r.id}`);
 assert(Object.values(r.links).length>0,`No sources: ${r.id}`);
 for(const u of [...Object.values(r.links),...(r.influenceSources||[])])assert(safeUrl(u),`Invalid HTTPS source: ${r.id}`);
 if(r.status==='selected'&&r.kinds.includes('papers')){
  assert(r.links.paper,`Missing paper source: ${r.id}`);
  if(r.selectionTrack==='recent-arxiv'){
   assert(r.publicationDate>=data.meta.arxivWindow.from&&r.publicationDate<=data.meta.arxivWindow.to,`Outside arXiv window: ${r.id}`);
   assert(r.influenceSources?.length,`Missing influence evidence: ${r.id}`);
  }else{
   assert(r.selectionTrack==='peer-reviewed'&&allowed.test(r.venue),`Unapproved venue: ${r.id}`);
   assert(r.year>=2021&&r.year<=2026,`Outside paper window: ${r.id}`);
   if(r.year===2021)assert(r.publicationDate>='2021-09-14',`Missing precise boundary date: ${r.id}`);
  }
 }
}
for(const r of data.resources){
 if(r.kinds.includes('papers'))assert(['survey','method','dataset','benchmark'].includes(r.paperType),`Missing paper contribution: ${r.id}`);
 for(const id of r.relatedIds||[])assert(ids.has(id),`Unknown related resource: ${r.id} -> ${id}`);
 if(r.kinds.includes('demos')){
  assert(safeUrl(r.video?.src),`Invalid video URL: ${r.id}`);
  assert(r.video.type==='video/mp4',`Unsupported video type: ${r.id}`);
  assert(r.credit && r.relatedIds?.length && r.links.project,`Missing video credit or source: ${r.id}`);
  assert(['game-control','generated-world','real-robot','simulation'].includes(r.demoType),`Missing demo setting: ${r.id}`);
 }
}
assert(!/[\u3400-\u9fff]/u.test(JSON.stringify(data)), 'Catalogue contains untranslated Chinese text');
const deployed=JSON.parse(await fs.readFile('dist/resources.json','utf8'));
assert.deepEqual(data,deployed,'Website data differs from source');
for(const k of ['articles','papers','projects','datasets','benchmarks','demos'])assert.equal(data.meta.counts[k],selected.filter(r=>r.kinds.includes(k)).length,'Stale count');
const html=await fs.readFile('dist/index.html','utf8');
for(const r of selected)assert(html.includes(`id="resource-${r.id}"`),`Missing static fallback: ${r.id}`);
for(const p of ['dist/assets/app.js','dist/assets/catalog.mjs','dist/assets/style.css','dist/README.md','dist/CITATION.cff','dist/CONTRIBUTING.md','dist/docs/collection-policy.md','dist/selection-audit.json'])await fs.access(p);
assert(html.includes('<html lang="en">'), 'Page language must be English');
for(const p of ['README.md','CONTRIBUTING.md','docs/collection-policy.md','data/selection-audit.json','dist/index.html','dist/assets/app.js','dist/assets/catalog.mjs'])assert(!/[\u3400-\u9fff]/u.test(await fs.readFile(p,'utf8')),`Untranslated text: ${p}`);
assert.equal((html.match(/<video /g)||[]).length,data.meta.counts.demos,'Missing static demo players');
const {execFileSync}=await import('node:child_process');
for(const f of ['dist/assets/app.js','dist/assets/catalog.mjs','scripts/build.mjs','scripts/serve.mjs'])execFileSync(process.execPath,['--check',f]);
console.log(`Validated ${data.resources.length} unique resources, date rules, sources, counts, static fallbacks, and JavaScript syntax.`);
