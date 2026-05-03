export const SITES = [
  {
    id: "wd",
    name: "Wavelength Daily",
    initials: "WD",
    hue: "oklch(0.66 0.13 35)",
    url: "wavelength.daily",
    members: 8420, paidMembers: 612,
    posts: 384, published: 351,
    status: "online",
    last: { title: "The slow internet is winning again", date: "2026-05-02 09:14" },
    delta: { members: +112, posts: +3 },
  },
  {
    id: "fl",
    name: "Field Lab Notes",
    initials: "FL",
    hue: "oklch(0.74 0.11 180)",
    url: "fieldlab.notes",
    members: 1942, paidMembers: 88,
    posts: 127, published: 119,
    status: "online",
    last: { title: "What soil temperature actually tells you", date: "2026-05-01 18:42" },
    delta: { members: +34, posts: +1 },
  },
  {
    id: "qm",
    name: "Quiet Machines",
    initials: "QM",
    hue: "oklch(0.62 0.10 260)",
    url: "quietmachines.io",
    members: 12380, paidMembers: 1247,
    posts: 612, published: 598,
    status: "online",
    last: { title: "Why I'm betting on small models for the long tail", date: "2026-05-02 07:30" },
    delta: { members: +287, posts: +5 },
  },
  {
    id: "tn",
    name: "Tide & Nail",
    initials: "TN",
    hue: "oklch(0.74 0.13 80)",
    url: "tideandnail.shop",
    members: 624, paidMembers: 39,
    posts: 58, published: 52,
    status: "warn",
    last: { title: "Spring restock: a small note on returns", date: "2026-04-28 11:05" },
    delta: { members: +5, posts: 0 },
  },
  {
    id: "rh",
    name: "Roomhouse",
    initials: "RH",
    hue: "oklch(0.55 0.10 320)",
    url: "roomhouse.fm",
    members: 3140, paidMembers: 201,
    posts: 198, published: 184,
    status: "online",
    last: { title: "Mixtape 47 — late lamp light", date: "2026-04-30 22:18" },
    delta: { members: +62, posts: +2 },
  },
  {
    id: "ng",
    name: "Nightgrade",
    initials: "NG",
    hue: "oklch(0.66 0.15 25)",
    url: "nightgrade.club",
    members: 0, paidMembers: 0,
    posts: 12, published: 0,
    status: "offline",
    last: { title: "— draft only —", date: "2026-04-22 02:03" },
    delta: { members: 0, posts: 0 },
  },
];

export const ACTIVITY = [
  { siteId: "qm", title: "Why I'm betting on small models for the long tail", author: "Chris H.", date: "2026-05-02 07:30", tag: "essay" },
  { siteId: "wd", title: "The slow internet is winning again",                 author: "Chris H.", date: "2026-05-02 09:14", tag: "weekly" },
  { siteId: "fl", title: "What soil temperature actually tells you",            author: "Chris H.", date: "2026-05-01 18:42", tag: "field" },
  { siteId: "rh", title: "Mixtape 47 — late lamp light",                        author: "Chris H.", date: "2026-04-30 22:18", tag: "mix" },
  { siteId: "qm", title: "Three weeks with the new evals stack",                author: "Chris H.", date: "2026-04-29 10:11", tag: "log" },
  { siteId: "tn", title: "Spring restock: a small note on returns",             author: "Chris H.", date: "2026-04-28 11:05", tag: "shop" },
  { siteId: "wd", title: "Found objects, vol. 12",                              author: "Chris H.", date: "2026-04-27 08:00", tag: "links" },
  { siteId: "qm", title: "Inference cost is a UX problem now",                  author: "Chris H.", date: "2026-04-26 14:22", tag: "essay" },
  { siteId: "fl", title: "Compost bin temperatures, week 16",                   author: "Chris H.", date: "2026-04-25 19:40", tag: "data" },
  { siteId: "rh", title: "Show notes — Episode 33 with Mira O.",                author: "Chris H.", date: "2026-04-24 21:05", tag: "show" },
];

export const SPARKS = {
  posts:        [12,14,13,16,15,18,17,20,19,21,22,24],
  published:    [10,12,12,14,13,16,15,18,17,19,20,22],
  members:      [80,92,101,118,140,165,180,210,245,278,300,332],
  paidMembers:  [4,6,7,9,11,12,15,16,18,21,23,26],
};

export function sparkPath(values, w = 64, h = 18, pad = 1) {
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => [
    pad + i * stepX,
    h - pad - ((v - min) / span) * (h - pad * 2),
  ]);
  const line = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${line} L${w - pad},${h} L${pad},${h} Z`;
  return { line, area };
}

export function fmtNum(n) {
  return Number(n).toLocaleString("en-US");
}

export function compactDate(iso) {
  const [d, t] = iso.split(" ");
  const [, mo, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[+mo - 1]} ${parseInt(day, 10)} · ${t}`;
}

export function relTime(iso) {
  const now = new Date("2026-05-03T11:00:00");
  const then = new Date(iso.replace(" ", "T"));
  const mins = Math.round((now - then) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return compactDate(iso);
}
