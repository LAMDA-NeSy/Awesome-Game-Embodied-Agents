// Content dates are independent from source checks and popularity metrics.
function contentSignature(resource) {
  const { metrics, addedAt, updatedAt, checkedAt, rank, ...content } = resource;
  if (content.bibliography) {
    const { checkedAt: bibliographyCheckedAt, ...bibliography } = content.bibliography;
    content.bibliography = bibliography;
  }
  const canonical = value => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
  return JSON.stringify(canonical(content));
}

export function syncCollectionDates(resources, previous, baselineDate, today) {
  const prior = new Map(previous.map(r => [r.id, r]));
  for (const resource of resources) {
    const old = prior.get(resource.id);
    const promoted = old?.status === 'candidate' && resource.status === 'selected';
    resource.addedAt = promoted ? today : old?.addedAt || resource.addedAt || (old ? baselineDate : today);
    resource.updatedAt = old && contentSignature(old) === contentSignature(resource)
      ? old.updatedAt || resource.updatedAt || resource.addedAt : today;
  }
}
