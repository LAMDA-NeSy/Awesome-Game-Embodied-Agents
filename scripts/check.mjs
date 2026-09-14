import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { safeUrl, renderCard, filterResources } from '../dist/assets/catalog.mjs';
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
for(const r of data.resources){
 const b=r.bibliography;
 if(b){
  assert(b.authors?.length && b.authors.every(a=>typeof a==='string'&&a.trim()),`Invalid authors: ${r.id}`);
  assert(safeUrl(b.sourceUrl),`Missing bibliography source: ${r.id}`);
  assert(/^\d{4}(-\d{2}){0,2}$/.test(b.date),`Invalid source date: ${r.id}`);
  assert(b.date<=b.checkedAt,`Future metadata date: ${r.id}`);
  assert(b.dateLabel && b.bibtex,`Missing date meaning or citation: ${r.id}`);
  if(b.preview){
   assert(/^assets\/papers\/[a-z0-9-]+\.png$/.test(b.preview),`Invalid preview path: ${r.id}`);
   const bytes=await fs.readFile('dist/'+b.preview);
   assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`Not a PNG: ${r.id}`);
   assert(safeUrl(b.previewSourceUrl || r.links.pdf),`Missing preview source: ${r.id}`);
  }
 }
 for(const [kind,m] of Object.entries(r.metrics||{})){
  assert(Number.isInteger(m.value)&&m.value>=0,`Invalid ${kind} count: ${r.id}`);
  assert(safeUrl(m.sourceUrl)&&m.source&&/^\d{4}-\d{2}-\d{2}$/.test(m.updatedAt),`Missing metric provenance: ${r.id}`);
  if(kind==='citations')assert(m.recordTitle,`Missing indexed title: ${r.id}`);
  if(kind==='github')assert(m.repository,`Missing repository identity: ${r.id}`);
 }
}
// Missing and measured-zero counts must remain distinct in the user-facing rows.
const specimen=structuredClone(selected.find(r=>r.kinds.includes('papers')));
specimen.metrics={citations:{value:null},github:{value:null}};
let card=renderCard(specimen);
assert(!card.includes('Citations:')&&!card.includes('GitHub stars'),'Missing metrics should be hidden');
specimen.metrics.citations={value:0,source:'OpenAlex',sourceUrl:'https://openalex.org/W4409147637',updatedAt:'2026-09-14'};
card=renderCard(specimen);
assert(card.includes('Citations: 0.'),'A verified zero must remain visible');
assert(!card.includes('GitHub stars'),'Missing stars should stay hidden');
assert(filterResources(data.resources,{query:'Hafner',candidates:false,view:'papers',domain:'all',topic:'all',year:'all',sort:'featured'}).some(r=>r.id==='kb-g05'),'Author search failed');
assert(!/[\u3400-\u9fff]/u.test(JSON.stringify(data)), 'Catalogue contains untranslated Chinese text');
const deployed=JSON.parse(await fs.readFile('dist/resources.json','utf8'));
assert.deepEqual(data,deployed,'Website data differs from source');
for(const k of ['articles','papers','projects','datasets','benchmarks','demos'])assert.equal(data.meta.counts[k],selected.filter(r=>r.kinds.includes(k)).length,'Stale count');
const html=await fs.readFile('dist/index.html','utf8');
for(const r of selected)assert(html.includes(`id="resource-${r.id}"`),`Missing static fallback: ${r.id}`);
for(const p of ['dist/assets/app.js','dist/assets/catalog.mjs','dist/assets/style.css','dist/README.md','dist/CITATION.cff','dist/CONTRIBUTING.md','dist/docs/collection-policy.md','dist/docs/metadata.md','dist/selection-audit.json'])await fs.access(p);
assert(html.includes('<html lang="en">'), 'Page language must be English');
for(const p of ['README.md','CONTRIBUTING.md','docs/collection-policy.md','data/selection-audit.json','dist/index.html','dist/assets/app.js','dist/assets/catalog.mjs'])assert(!/[\u3400-\u9fff]/u.test(await fs.readFile(p,'utf8')),`Untranslated text: ${p}`);
assert.equal((html.match(/<video /g)||[]).length,data.meta.counts.demos,'Missing static demo players');
const {execFileSync}=await import('node:child_process');
for(const f of ['dist/assets/app.js','dist/assets/catalog.mjs','scripts/build.mjs','scripts/serve.mjs','scripts/refresh-metrics.mjs'])execFileSync(process.execPath,['--check',f]);
console.log(`Validated ${data.resources.length} unique resources, date rules, sources, counts, static fallbacks, and JavaScript syntax.`);
