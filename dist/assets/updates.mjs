import { escapeHtml as e, sortResources, safeUrl } from './catalog.mjs';

const prettyDate = value => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
const resourceHref = r => `#${r.kinds.includes('papers') ? 'papers' : r.kinds[0]}?q=${encodeURIComponent(r.title)}`;

export function renderUpdates(data, history, maintenance = {}) {
  const selected = data.resources.filter(r => r.status === 'selected');
  const recent = sortResources(selected, 'added').slice(0, 6);
  const revised = sortResources(selected.filter(r => r.updatedAt > r.addedAt), 'updated').slice(0, 6);
  const list = (items, field) => `<ol class="recent-list">${items.map(r => `<li><div><span class="recent-kind">${e(r.domains.join(' + '))} · ${e(r.venue || r.kinds[0])}</span><a href="${e(resourceHref(r))}">${e(r.title)}</a></div><time datetime="${e(r[field])}">${e(prettyDate(r[field]))}</time></li>`).join('')}</ol>`;
  const links = maintenance.linkCheck;
  const metrics = maintenance.metricsRefresh;
  const unresolved = links?.results.filter(r => r.status !== 'ok') || [];
  const statusNames = { broken: 'Missing (404 / 410)', restricted: 'Access restricted', unreachable: 'Inconclusive' };
  return `<div class="updates-heading"><p class="section-eyebrow">COLLECTION JOURNAL</p><h2>What’s new</h2><p>Recent additions, editorial changes, and the latest source checks.</p></div>
    <div class="maintenance-grid">
      <section class="maintenance-card"><span class="maintenance-label">SOURCE LINKS</span><h3>${links ? `${links.total} checked` : 'Awaiting first check'}</h3><p>${links ? `${links.summary.ok} reachable · ${links.summary.broken} missing<br>${links.summary.restricted} access restricted · ${links.summary.unreachable} inconclusive` : 'Checks cover paper, code, data, project, and original video links.'}</p>${links ? `<time datetime="${e(links.checkedAt)}">Last run · ${e(prettyDate(links.checkedAt))}</time>` : ''}</section>
      <section class="maintenance-card"><span class="maintenance-label">CITATIONS &amp; GITHUB STARS</span><h3>${metrics ? `${metrics.refreshed} / ${metrics.total} refreshed` : 'Source-dated snapshots'}</h3><p>${metrics ? `${metrics.preserved} requests kept their previous snapshots.<br>Each paper shows its own retrieval date.` : 'Only exact, previously verified source records are refreshed.'}</p>${metrics ? `<time datetime="${e(metrics.checkedAt)}">Last run · ${e(prettyDate(metrics.checkedAt))}</time>` : ''}</section>
      <section class="maintenance-card maintenance-policy"><span class="maintenance-label">MAINTENANCE</span><h3>Every Monday</h3><p>Scheduled around 09:17 China time.<br>New papers and source corrections are reviewed by a curator.</p><a href="${e(data.meta.repositoryUrl)}/actions/workflows/pages.yml" target="_blank" rel="noopener noreferrer">View maintenance runs ↗</a></section>
    </div>
    <details class="maintenance-details"><summary>Check details &amp; source availability</summary><p>A restricted request or timeout can reflect publisher protections or a temporary outage. Links stay in the collection until reviewed. A “missing” result requires a 404 or 410 response to a GET request.</p><p><a href="maintenance.json" download>Download the latest check report ↓</a></p>${unresolved.length ? `<ul class="link-check-list">${unresolved.map(r => `<li><span>${e(statusNames[r.status])}</span><a href="${e(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer">${e(r.url)}</a></li>`).join('')}</ul>` : ''}${metrics?.failures.length ? `<p>${metrics.failures.length} statistics requests were not verified; their original values and dates were preserved. The report lists each source and result.</p>` : ''}</details>
    <div class="updates-columns"><section><div class="updates-section-title"><h3>Recently added</h3><a href="#all?sort=added">View all ↗</a></div>${list(recent, 'addedAt')}<p class="baseline-note">Collection history begins ${e(prettyDate(history.baselineDate))}. Earlier entries share this baseline date; it is not their publication date.</p>${revised.length ? `<div class="updates-section-title"><h3>Recently revised</h3><a href="#all?sort=updated">View all ↗</a></div>${list(revised, 'updatedAt')}` : ''}</section>
    <section><div class="updates-section-title"><h3>Update log</h3><a href="CHANGELOG.md">Full log ↗</a></div><ol class="update-log">${history.entries.map(entry => `<li><div class="update-log-meta"><time datetime="${e(entry.date)}">${e(prettyDate(entry.date))}</time><span>${e(entry.type)}</span></div><h4>${e(entry.title)}</h4><p>${e(entry.summary)}</p></li>`).join('')}</ol></section></div>`;
}
