function Icon({ size = 16, sw = 1.5, fill, children }) {
  return (
    <svg
      className="ic"
      width={size} height={size}
      viewBox="0 0 24 24"
      fill={fill || "none"}
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const I = {
  Dashboard: (p) => <Icon {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></Icon>,
  Posts:     (p) => <Icon {...p}><path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 14h8M8 18h5"/></Icon>,
  Pages:     (p) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/></Icon>,
  Members:   (p) => <Icon {...p}><circle cx="9" cy="9" r="3.2"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="8" r="2.4"/><path d="M15.5 14.2c2.6.5 4.5 2.4 4.5 4.8"/></Icon>,
  Newsletter:(p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6.5l8.5 7 8.5-7"/></Icon>,
  Tiers:     (p) => <Icon {...p}><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4"/><path d="M3 17l9 4 9-4"/></Icon>,
  Offers:    (p) => <Icon {...p}><path d="M20 12.5L12.5 20a1.5 1.5 0 0 1-2.1 0L4 13.6V6a2 2 0 0 1 2-2h7.6L20 10.4a1.5 1.5 0 0 1 0 2.1z"/><circle cx="9" cy="9" r="1.3"/></Icon>,
  Settings:  (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>,
  Bell:      (p) => <Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7z"/><path d="M10 19a2 2 0 0 0 4 0"/></Icon>,
  Search:    (p) => <Icon {...p}><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></Icon>,
  Chevron:   (p) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>,
  Plus:      (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  Check:     (p) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7.5"/></Icon>,
  Up:        (p) => <Icon {...p}><path d="M7 14l5-5 5 5"/></Icon>,
  Down:      (p) => <Icon {...p}><path d="M7 10l5 5 5-5"/></Icon>,
  Ext:       (p) => <Icon {...p}><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></Icon>,
  Filter:    (p) => <Icon {...p}><path d="M4 5h16M7 12h10M10 19h4"/></Icon>,
  Refresh:   (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></Icon>,
  Doc:       (p) => <Icon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></Icon>,
  Send:      (p) => <Icon {...p}><path d="M21 3l-9 18-2-9-9-2z"/></Icon>,
  User:      (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></Icon>,
  Sidebar:   (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></Icon>,
  Backup:    (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Icon>,
  Trash:     (p) => <Icon {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></Icon>,
  Clock:     (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></Icon>,
};
