export const escapeHtml = (value = '') => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function externalLink(url, label) {
  const href = safeUrl(url);
  return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>` : '';
}
export function renderCard(r, lookup = new Map()) {
  if(r.kinds.includes('demos'))return renderDemo(r,lookup);
  const cross = r.domains.length > 1;
  const domain = cross ? 'cross-domain' : r.domains[0];
  const label = cross ? 'GAME + EMBODIED' : domain === 'game' ? 'GAME' : 'EMBODIED';
  const candidate = r.status === 'candidate';
  const evidence = candidate ? 'Candidate · pending review' : r.selectionTrack === 'recent-arxiv' ? 'Selected preprint' : r.selectionTrack === 'peer-reviewed' ? 'Peer-reviewed' : r.kinds.includes('articles') ? 'Research article' : 'Research infrastructure';
  const field = (name, value) => value ? `<p><b>${name}:</b> ${escapeHtml(value)}</p>` : '';
  const primary = safeUrl(r.links.paper || r.links.article || r.links.code || r.links.data || r.links.project);
  const title = primary ? `<a href="${escapeHtml(primary)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.name)}</a>` : escapeHtml(r.name);
  return `<article class="resource-card" id="resource-${escapeHtml(r.id)}">
    <div class="resource-marker"><span class="domain-tag ${domain}">${label}</span><span class="resource-year">${escapeHtml(r.year || 'TOOL')}</span><span class="resource-venue">${escapeHtml(r.venue)}</span></div>
    <div class="resource-body"><h3>${title}</h3>${r.title!==r.name?`<p class="full-title">${escapeHtml(r.title)}</p>`:''}
    <p class="summary">${escapeHtml(r.summary)}</p>
    <div class="tags">${r.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div>
    <details><summary>Details &amp; evidence</summary>${field('Credit',r.credit)}${field('Environment & tasks',r.environment)}${field('Observations & actions',r.interface)}${field('Scope & limitations',r.limits)}${field('Why included',r.selectionReason)}${field('Evidence status',r.evidence)}${field('Original knowledge-base review label',r.sourceEvidence)}${field('Publication note',r.publicationNote)}${field(r.selectionTrack==='recent-arxiv'?'First submitted':'Publication date',r.publicationDate)}${r.influenceSources?.length?`<p>Evidence for editorial selection: ${r.influenceSources.map(s=>externalLink(s,'Official research report')).join(' · ')}</p>`:''}<p class="checked-date">Checked ${escapeHtml(r.checkedAt)}${r.sourceId?` · Knowledge-base ID ${escapeHtml(r.sourceId)}`:''}</p>${relatedLinks(r,lookup)}</details></div>
    <nav class="resource-links" aria-label="Sources for ${escapeHtml(r.name)}">${Object.entries(r.links).map(([k,v])=>externalLink(v, {paper:'Paper',code:'Code',project:'Project',data:'Data',article:'Read article',video:'Video'}[k] || k)).join('')}<span class="evidence-badge ${candidate?'candidate-badge':''}">${evidence}</span></nav>
  </article>`;
}
export function filterResources(resources, state) {
  const query = state.query.trim().normalize('NFKC').toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  return resources.filter(r => (state.candidates ? r.status === 'candidate' : r.status === 'selected')
    && (state.view === 'all' || r.kinds.includes(state.view))
    && (state.domain === 'all' || r.domains.includes(state.domain))
    && (state.topic === 'all' || r.tags.includes(state.topic))
    && (state.year === 'all' || String(r.year) === state.year)
    && (!state.code || Boolean(r.links.code))
    && (!state.paperType || state.paperType === 'all' || r.paperType === state.paperType)
    && (!state.demoType || state.demoType === 'all' || r.demoType === state.demoType)
    && terms.every(term => [r.name,r.title,r.summary,r.venue,r.environment,r.interface,r.credit||'',...r.tags,...(r.gameTypes||[])].join(' ').normalize('NFKC').toLocaleLowerCase().includes(term)))
    .sort((a,b) => state.sort === 'newest' ? (b.year||0)-(a.year||0)||a.rank-b.rank : state.sort === 'name' ? a.name.localeCompare(b.name,'en') : a.rank-b.rank);
}

const kindNames={articles:'Research articles',papers:'Papers',projects:'Open-source projects',datasets:'Datasets',benchmarks:'Benchmarks & environments',demos:'Video demos'};
const settingNames={'game-control':'Game control','generated-world':'Generated world','real-robot':'Real robot',simulation:'Simulation'};
function relatedLinks(r,lookup){
  const related=(r.relatedIds||[]).map(id=>lookup.get(id)).filter(Boolean);
  return related.length?`<p class="related-links"><b>Related work:</b> ${related.map(item=>`<a href="#${item.kinds[0]}?q=${encodeURIComponent(item.name)}">${escapeHtml(item.name)}</a>`).join(' · ')}</p>`:'';
}
function renderDemo(r,lookup){
  const video=safeUrl(r.video?.src);
  return `<article class="demo-card" id="resource-${escapeHtml(r.id)}"><div class="demo-media"><video controls playsinline muted preload="none" src="${escapeHtml(video)}" aria-label="${escapeHtml(r.name)} video"><a href="${escapeHtml(video)}">Watch the original video</a></video><button class="video-load" type="button" hidden aria-label="Play ${escapeHtml(r.name)}"><span aria-hidden="true">▶</span><strong>${escapeHtml(r.name)}</strong><small>Play official demo</small></button></div><div class="demo-content"><div class="demo-meta"><span class="domain-tag ${r.domains[0]}">${escapeHtml(settingNames[r.demoType])}</span><span>${escapeHtml(r.year)}</span></div><p class="demo-credit">${escapeHtml(r.credit)}</p><h3>${escapeHtml(r.name)}</h3><p class="summary">${escapeHtml(r.summary)}</p><nav class="demo-links" aria-label="Sources for ${escapeHtml(r.name)}">${externalLink(r.links.project,'Original source')}${externalLink(video,'Video')}${r.links.code?externalLink(r.links.code,'Code'):''}</nav><p class="video-error" hidden>Playback is unavailable here. <a href="${escapeHtml(r.links.project)}" target="_blank" rel="noopener noreferrer">Watch on the original source site ↗</a></p><details><summary>Details &amp; evidence</summary><p><b>Setting:</b> ${escapeHtml(r.environment)}</p><p><b>Interface:</b> ${escapeHtml(r.interface)}</p><p><b>Playback &amp; limitations:</b> ${escapeHtml(r.limits)}</p><p><b>Evidence:</b> ${escapeHtml(r.evidence)}</p>${relatedLinks(r,lookup)}<p class="checked-date">Checked ${escapeHtml(r.checkedAt)}. Year identifies the source project release, not the exact recording date.</p></details></div></article>`;
}
export function renderCatalogue(resources,view='all',allResources=resources){
  const lookup=new Map(allResources.map(r=>[r.id,r]));
  if(view!=='all')return `<div class="${view==='demos'?'demo-grid':'resource-list'}">${resources.map(r=>renderCard(r,lookup)).join('')}</div>`;
  return Object.entries(kindNames).map(([kind,label])=>{
    const items=resources.filter(r=>r.kinds[0]===kind);
    return items.length?`<section class="resource-group" aria-label="${label}"><h3 class="group-title">${label}<span>${items.length}</span></h3><div class="${kind==='demos'?'demo-grid':'resource-list'}">${items.map(r=>renderCard(r,lookup)).join('')}</div></section>`:'';
  }).join('');
}
