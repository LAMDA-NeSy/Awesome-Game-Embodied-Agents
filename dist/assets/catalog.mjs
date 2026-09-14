export const escapeHtml = (value = '') => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function externalLink(url, label) {
  const href = safeUrl(url);
  return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>` : '';
}
// Source dates retain their meaning; a venue year is a separate field.
export function resourceDate(r) {
  const b = r.bibliography;
  if (b?.date) {
    const label = b.dateLabel === 'First arXiv submission' ? 'Preprint'
      : b.source === 'OpenAlex' ? 'Indexed' : 'Published';
    return { value: b.date, label, meaning: b.dateLabel };
  }
  if (r.sourceDate) return { value: r.sourceDate, label: 'Released', meaning: 'Original source date' };
  if (r.publicationDate) return { value: r.publicationDate, label: r.selectionTrack === 'recent-arxiv' ? 'Preprint' : 'Published', meaning: 'Recorded publication date' };
  return { value: '', label: '', meaning: '' };
}
export function sortResources(resources, sort = 'featured') {
  const rank = (a, b) => a.rank - b.rank || a.id.localeCompare(b.id);
  // Missing dates sort last. Year-only records stay year-only in the UI.
  const descendingDate = (a, b, field, tie = rank) => String(field(b) || '').localeCompare(String(field(a) || '')) || tie(a, b);
  const historyRank = (a, b) => Number(Boolean(b.kinds?.includes('papers'))) - Number(Boolean(a.kinds?.includes('papers'))) || rank(a, b);
  return [...resources].sort((a, b) => {
    if (sort === 'venue' || sort === 'newest') return (b.year || 0) - (a.year || 0) || rank(a, b);
    if (sort === 'date') return descendingDate(a, b, r => resourceDate(r).value);
    if (sort === 'added') return descendingDate(a, b, r => r.addedAt, historyRank);
    if (sort === 'updated') return descendingDate(a, b, r => r.updatedAt, historyRank);
    return sort === 'name' ? a.name.localeCompare(b.name, 'en') || rank(a, b) : rank(a, b);
  });
}
const collectionDates = r => `<p class="collection-dates">${r.addedAt ? `Added ${escapeHtml(r.addedAt)}` : ''}${r.updatedAt && r.updatedAt !== r.addedAt ? ` · Revised ${escapeHtml(r.updatedAt)}` : ''}</p>`;
export function renderCard(r, lookup = new Map()) {
  if(r.kinds.includes('demos'))return renderDemo(r,lookup);
  if(r.kinds.includes('papers'))return renderPaper(r,lookup);
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
    <details><summary>Details &amp; evidence</summary>${field('Credit',r.credit)}${field('Environment & tasks',r.environment)}${field('Observations & actions',r.interface)}${field('Scope & limitations',r.limits)}${field('Why included',r.selectionReason)}${field('Evidence status',r.evidence)}${field('Original knowledge-base review label',r.sourceEvidence)}${field('Publication note',r.publicationNote)}${field(r.selectionTrack==='recent-arxiv'?'First submitted':'Publication date',r.publicationDate)}${r.influenceSources?.length?`<p>Evidence for editorial selection: ${r.influenceSources.map(s=>externalLink(s,'Official research report')).join(' · ')}</p>`:''}<p class="checked-date">Checked ${escapeHtml(r.checkedAt)}${r.sourceId?` · Knowledge-base ID ${escapeHtml(r.sourceId)}`:''}</p>${collectionDates(r)}${relatedLinks(r,lookup)}</details></div>
    <nav class="resource-links" aria-label="Sources for ${escapeHtml(r.name)}">${Object.entries(r.links).map(([k,v])=>externalLink(v, {paper:'Paper',code:'Code',project:'Project',data:'Data',article:'Read article',video:'Video'}[k] || k)).join('')}${renderStarBadge(r)}<span class="evidence-badge ${candidate?'candidate-badge':''}">${evidence}</span></nav>
  </article>`;
}
export function filterResources(resources, state) {
  const query = state.query.trim().normalize('NFKC').toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  return sortResources(resources.filter(r => (state.candidates ? r.status === 'candidate' : r.status === 'selected')
    && (state.view === 'all' || r.kinds.includes(state.view))
    && (state.domain === 'all' || r.domains.includes(state.domain))
    && (state.topic === 'all' || r.tags.includes(state.topic))
    && (state.year === 'all' || String(r.year) === state.year)
    && (!state.code || Boolean(r.links.code))
    && (!state.paperType || state.paperType === 'all' || r.paperType === state.paperType)
    && (!state.demoType || state.demoType === 'all' || r.demoType === state.demoType)
    && terms.every(term => [r.name,r.title,r.summary,r.venue,r.environment,r.interface,r.credit||'',...(r.bibliography?.authors||[]),...r.tags,...(r.gameTypes||[])].join(' ').normalize('NFKC').toLocaleLowerCase().includes(term))), state.sort);
}

const kindNames={articles:'Research articles',papers:'Papers',projects:'Open-source projects',datasets:'Datasets',benchmarks:'Benchmarks & environments',demos:'Video demos'};
const settingNames={'game-control':'Game control','generated-world':'Generated world','real-robot':'Real robot',simulation:'Simulation'};
function relatedLinks(r,lookup){
  const related=(r.relatedIds||[]).map(id=>lookup.get(id)).filter(Boolean);
  return related.length?`<p class="related-links"><b>Related work:</b> ${related.map(item=>`<a href="#${item.kinds[0]}?q=${encodeURIComponent(item.name)}">${escapeHtml(item.name)}</a>`).join(' · ')}</p>`:'';
}
function renderDemo(r,lookup){
  const video=safeUrl(r.video?.src);
  return `<article class="demo-card" id="resource-${escapeHtml(r.id)}"><div class="demo-media"><video controls playsinline muted preload="none" src="${escapeHtml(video)}" aria-label="${escapeHtml(r.name)} video"><a href="${escapeHtml(video)}">Watch the original video</a></video><button class="video-load" type="button" hidden aria-label="Play ${escapeHtml(r.name)}"><span aria-hidden="true">▶</span><strong>${escapeHtml(r.name)}</strong><small>Play official demo</small></button></div><div class="demo-content"><div class="demo-meta"><span class="domain-tag ${r.domains[0]}">${escapeHtml(settingNames[r.demoType])}</span><span>${escapeHtml(r.year)}</span></div><p class="demo-credit">${escapeHtml(r.credit)}</p><h3>${escapeHtml(r.name)}</h3><p class="summary">${escapeHtml(r.summary)}</p><nav class="demo-links" aria-label="Sources for ${escapeHtml(r.name)}">${externalLink(r.links.project,'Original source')}${externalLink(video,'Video')}${r.links.code?externalLink(r.links.code,'Code'):''}</nav><p class="video-error" hidden>Playback is unavailable here. <a href="${escapeHtml(r.links.project)}" target="_blank" rel="noopener noreferrer">Watch on the original source site ↗</a></p><details><summary>Details &amp; evidence</summary><p><b>Setting:</b> ${escapeHtml(r.environment)}</p><p><b>Interface:</b> ${escapeHtml(r.interface)}</p><p><b>Playback &amp; limitations:</b> ${escapeHtml(r.limits)}</p><p><b>Evidence:</b> ${escapeHtml(r.evidence)}</p>${relatedLinks(r,lookup)}<p class="checked-date">Checked ${escapeHtml(r.checkedAt)}. Year identifies the source project release, not the exact recording date.</p>${collectionDates(r)}</details></div></article>`;
}
export function renderCatalogue(resources,view='all',allResources=resources,sort='featured'){
  const lookup=new Map(allResources.map(r=>[r.id,r]));
  if(view!=='all' || sort!=='featured')return `<div class="${view==='demos'?'demo-grid':'resource-list'}">${resources.map(r=>renderCard(r,lookup)).join('')}</div>`;
  const rendered = new Set();
  return Object.entries(kindNames).map(([kind,label])=>{
    const items=resources.filter(r=>r.kinds.includes(kind));
    const cards = items.map(r => {
      let card = renderCard(r, lookup);
      if (rendered.has(r.id)) card = card.replace(`id="resource-${escapeHtml(r.id)}"`, `id="resource-${escapeHtml(r.id)}-${kind}"`);
      rendered.add(r.id);
      return card;
    }).join('');
    return items.length?`<section class="resource-group" aria-label="${label}"><h3 class="group-title">${label}<span>${items.length}</span><a href="#${kind}">Explore ${label.toLowerCase()} <span aria-hidden="true">↗</span></a></h3><div class="${kind==='demos'?'demo-grid':'resource-list'}">${cards}</div></section>`:'';
  }).join('');
}


const icons = {
  data: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  model: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10L3 7m9 5 9-5m-9 5v10"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20"/>',
  citations: '<path d="M12 5v16M12 5C8 2 4 3 2 4v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-2-1-6-2-10 1Z"/>',
  stars: '<path d="m12 2 3.1 6.3L22 9.4l-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.3 2 9.4l6.9-1.1L12 2Z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
const hasCount = value => Number.isInteger(value) && value >= 0;
const formatCount = value => new Intl.NumberFormat('en-US').format(value);
function renderStarBadge(r) {
  const metric=r.metrics?.github;
  return hasCount(metric?.value) && safeUrl(metric.sourceUrl) ? `<a class="github-star-badge" href="${escapeHtml(metric.sourceUrl)}" target="_blank" rel="noopener noreferrer" title="GitHub stars · checked ${escapeHtml(metric.updatedAt)}">${icon('stars')} ${formatCount(metric.value)} stars</a>` : '';
}
function metricLink(url,label,type,metric) {
  const isMetric=type==='citations'||type==='stars';
  if(!safeUrl(url)||(isMetric&&!hasCount(metric?.value))){
    const note=`${label} ${isMetric?'count':'link'} not available`;
    return `<span class="paper-stat ${isMetric?'stat-missing-count':'stat-unavailable'}" data-stat="${type}" role="group" aria-disabled="true" aria-label="${escapeHtml(note)}" title="${escapeHtml(note)}">${icon(type)}<span class="stat-label">${escapeHtml(label)}</span>${isMetric?'<strong aria-hidden="true">—</strong>':''}</span>`;
  }
  const counted=hasCount(metric?.value);
  const note=counted?`${metric.source} · checked ${metric.updatedAt}`:label;
  return `<a class="paper-stat" data-stat="${type}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(note)}" aria-label="${escapeHtml(label)}${counted?`: ${formatCount(metric.value)}. ${escapeHtml(note)}`:''}">${icon(type)}<span class="stat-label">${escapeHtml(label)}</span>${counted?`<strong>${formatCount(metric.value)}</strong>`:''}</a>`;
}
function renderPaper(r,lookup) {
  const b=r.bibliography || {};
  const authors=b.authors || [];
  const shownAuthors=authors.slice(0,3).join(', ')+(authors.length>3?' et al.':'');
  const date=resourceDate(r);
  const shortName=r.name.length<=20 && !r.title.toLowerCase().includes(r.name.toLowerCase())?` (${r.name})`:'';
  const domain=r.domains.length>1?'cross-domain':r.domains[0];
  const domainLabel=r.domains.length>1?'GAME + EMBODIED':r.domains[0]==='game'?'GAME':'EMBODIED';
  const candidate=r.status==='candidate';
  const evidence=candidate?'Candidate · pending review':r.selectionTrack==='recent-arxiv'?'Selected preprint':'';
  const citations=r.metrics?.citations;
  const stars=r.metrics?.github;
  const stats=[metricLink(r.links.data,'Data','data'),metricLink(r.links.model,'Models','model'),metricLink(r.links.code,'Code','code'),metricLink(citations?.sourceUrl,'Citations','citations',citations),metricLink(stars?.sourceUrl,'GitHub stars','stars',stars)].join('');
  const sources=[citations,stars].filter(m=>hasCount(m?.value)&&safeUrl(m.sourceUrl));
  const sourceNote=sources.length?`<p class="metrics-updated">${sources.map(m=>externalLink(m.sourceUrl,m.source)).join(' · ')}<br>Checked ${escapeHtml([...new Set(sources.map(m=>m.updatedAt))].join(' / '))}</p>`:'';
  const field=(label,value)=>value?`<p><b>${label}:</b> ${escapeHtml(value)}</p>`:'';
  const preview=b.preview && /^assets\/papers\/[a-z0-9-]+\.png$/.test(b.preview)?`<a class="paper-preview" href="${escapeHtml(safeUrl(r.links.pdf||r.links.paper))}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(b.previewVersion||'Paper first page')}" aria-label="Open ${escapeHtml(r.name)} PDF"><img src="${escapeHtml(b.preview)}" alt="First page of ${escapeHtml(r.title)}" width="320" height="420" loading="lazy" decoding="async"></a>`:'';
  return `<article class="resource-card paper-card ${stats?'has-stats':''}" id="resource-${escapeHtml(r.id)}">
    <div class="paper-visual">${preview}<div class="paper-classification"><span class="domain-tag ${domain}">${domainLabel}</span><span class="resource-venue">${escapeHtml(r.venue)}</span>${evidence?`<span class="evidence-badge ${candidate?'candidate-badge':''}">${evidence}</span>`:''}</div></div>
    <div class="resource-body paper-body"><h3><a href="${escapeHtml(safeUrl(r.links.paper))}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title+shortName)}</a></h3>
    <p class="paper-byline">${date.value?`<span class="paper-date" title="${escapeHtml(date.meaning)}"><span class="date-label">${escapeHtml(date.label)}</span> <time datetime="${escapeHtml(date.value)}">${escapeHtml(date.value)}</time></span>`:''}${shownAuthors?`<span class="paper-authors" title="${escapeHtml(authors.join(', '))}">${escapeHtml(shownAuthors)}</span>`:''}</p>
    <p class="summary">${escapeHtml(r.summary)}</p>
    <nav class="paper-actions" aria-label="Read ${escapeHtml(r.name)}">${externalLink(r.links.paper,'Paper')}${externalLink(r.links.pdf,'PDF')}${externalLink(r.links.project,'Project')}${externalLink(r.links.video,'Video')}${(lookup.size && [...lookup.values()].some(item=>item.kinds.includes('demos') && item.relatedIds?.includes(r.id)))?`<a href="#demos?q=${encodeURIComponent(r.name.split(' / ')[0])}">Watch demos ▷</a>`:''}</nav>
    <div class="tags">${r.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div>
    <details><summary>Details &amp; sources</summary>${field('Authors',authors.join(', '))}${field('Project name',r.name)}${field('PDF preview version',b.previewVersion)}${b.sourceUrl?`<p><b>Bibliographic source:</b> ${externalLink(b.sourceUrl,b.source || 'Official publication record')}</p>`:''}${field(b.dateLabel||'Publication date',b.date)}${field('Credit',r.credit)}${field('Original knowledge-base review label',r.sourceEvidence)}${field('Publication note',r.publicationNote)}${r.influenceSources?.length?`<p>Evidence for editorial selection: ${r.influenceSources.map(s=>externalLink(s,'Official research report')).join(' · ')}</p>`:''}${b.bibtex?`<details class="citation-details"><summary>BibTeX citation</summary><pre class="bibtex"><code>${escapeHtml(b.bibtex)}</code></pre><button class="copy-citation" type="button" hidden>Copy BibTeX</button><span class="copy-status" role="status"></span></details>`:''}<p class="checked-date">Sources checked ${escapeHtml(r.checkedAt)}${r.sourceId?` · Knowledge-base ID ${escapeHtml(r.sourceId)}`:''}</p>${collectionDates(r)}${relatedLinks(r,lookup)}</details></div>
${stats?`<aside class="paper-sidebar" aria-label="Resources and statistics for ${escapeHtml(r.name)}"><nav class="paper-stats">${stats}</nav>${sourceNote}</aside>`:''}
  </article>`;
}
