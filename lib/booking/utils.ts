export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function prettyServiceType(s: string) {
  return s.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

