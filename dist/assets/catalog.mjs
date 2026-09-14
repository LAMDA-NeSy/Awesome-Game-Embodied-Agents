export const escapeHtml = (value = '') => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function externalLink(url, label) {
  const href = safeUrl(url);
  return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>` : '';
}
export function renderCard(r) {
  const cross = r.domains.length > 1;
  const domain = cross ? 'cross-domain' : r.domains[0];
  const label = cross ? 'GAME × EMBODIED' : domain === 'game' ? 'GAME AGENT' : 'EMBODIED AI';
  const candidate = r.status === 'candidate';
  const evidence = candidate ? '候选待核验' : r.selectionTrack === 'recent-arxiv' ? '重要预印本 · 编辑精选' : r.sourceType === 'knowledge' ? '知识库精选' : '官方来源补充';
  const field = (name, value) => value ? `<p><b>${name}：</b>${escapeHtml(value)}</p>` : '';
  return `<article class="resource-card" id="resource-${escapeHtml(r.id)}">
    <div class="card-top"><span class="domain-tag ${domain}">${label}</span><span class="resource-type">${escapeHtml(r.venue)}</span></div>
    <h3>${escapeHtml(r.name)}</h3><p class="full-title">${escapeHtml(r.title)}</p>
    <p class="summary">${escapeHtml(r.summary)}</p>
    <div class="tags">${r.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div>
    <div class="card-footer">${Object.entries(r.links).map(([k,v])=>externalLink(v, {paper:'论文',code:'代码',project:'项目'}[k] || k)).join('')}<span class="${candidate?'candidate-badge':''}">${evidence}</span></div>
    <details><summary>任务、接口与收录依据</summary>${field('环境与任务',r.environment)}${field('观察与动作',r.interface)}${field('结论边界',r.limits)}${field('收录理由',r.selectionReason)}${field('证据状态',r.evidence)}${field('知识库原始核验标记',r.sourceEvidence)}${field('发表时间说明',r.publicationNote)}${field('首次提交',r.publicationDate)}${r.influenceSources?.length?`<p>重要性判断的证据：${r.influenceSources.map(s=>externalLink(s,'官方研究报告')).join(' · ')}</p>`:''}<p class="checked-date">核对日期 ${escapeHtml(r.checkedAt)}${r.sourceId?` · 知识库编号 ${escapeHtml(r.sourceId)}`:''}</p></details>
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
    && terms.every(term => [r.name,r.title,r.summary,r.venue,r.environment,r.interface,...r.tags,...(r.gameTypes||[])].join(' ').normalize('NFKC').toLocaleLowerCase().includes(term)))
    .sort((a,b) => state.sort === 'newest' ? (b.year||0)-(a.year||0)||a.rank-b.rank : state.sort === 'name' ? a.name.localeCompare(b.name,'en') : a.rank-b.rank);
}
