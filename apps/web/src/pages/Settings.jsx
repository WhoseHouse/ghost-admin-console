import { useState } from 'react';
import { I } from '../components/icons.jsx';
import { SITES } from '../data/mockData.js';
import useSiteStore from '../store/siteStore.js';

const API_LOGS = [
  { time:"14:22:01", method:"GET",  path:"/v3/admin/posts/",     status:"200", ms:"142ms" },
  { time:"14:22:15", method:"POST", path:"/v3/admin/webhooks/",  status:"201", ms:"32ms"  },
  { time:"14:23:44", method:"GET",  path:"/v3/admin/members/",   status:"200", ms:"211ms" },
  { time:"14:24:00", method:"GET",  path:"/v3/admin/site/",      status:"200", ms:"88ms"  },
  { time:"14:24:18", method:"PUT",  path:"/v3/admin/posts/7f2b/",status:"200", ms:"64ms"  },
];

function Toggle({ on, onChange }) {
  return (
    <button className={'toggle' + (on ? ' on' : '')} onClick={() => onChange(!on)}>
      <span className="toggle-knob" />
    </button>
  );
}

export default function Settings() {
  const { accent, setAccent, density, setDensity } = useSiteStore();
  const [adminName,  setAdminName]  = useState('Chris Huerta');
  const [adminEmail, setAdminEmail] = useState('chris@itschrishuerta.com');
  const [emailReports, setEmailReports] = useState(true);
  const [slackAlerts,  setSlackAlerts]  = useState(false);

  return (
    <div className="main-inner view-enter" style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Console configuration &amp; site management</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* General */}
        <div className="settings-section">
          <div className="settings-label">
            <div className="settings-label-title">General</div>
            <div className="settings-label-sub">Admin details and contact info</div>
          </div>
          <div className="settings-body">
            <div className="field">
              <label className="field-label">Admin Name</label>
              <input className="field-input" value={adminName} onChange={e => setAdminName(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Email Address</label>
              <input className="field-input" type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary">Save changes</button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <div className="settings-label">
            <div className="settings-label-title">Appearance</div>
            <div className="settings-label-sub">Accent color and display density</div>
          </div>
          <div className="settings-body">
            <div className="field">
              <div className="field-label">Accent Color</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {[
                  { id: 'coral', label: 'Coral',  color: 'oklch(0.74 0.15 35)'  },
                  { id: 'amber', label: 'Amber',  color: 'oklch(0.82 0.13 70)'  },
                  { id: 'blush', label: 'Blush',  color: 'oklch(0.74 0.14 15)'  },
                  { id: 'teal',  label: 'Teal',   color: 'oklch(0.74 0.11 180)' },
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    style={{
                      height: 30, padding: '0 14px', borderRadius: 'var(--radius-sm)',
                      background: accent === a.id ? a.color : 'var(--surface)',
                      border: `1px solid ${accent === a.id ? a.color : 'var(--border)'}`,
                      color: accent === a.id ? '#0f0f10' : 'var(--text-2)',
                      fontFamily: 'var(--mono)', fontSize: 11.5, cursor: 'pointer',
                      fontWeight: accent === a.id ? 600 : 400,
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <div className="field-label">Density</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {['comfortable', 'dense'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    style={{
                      height: 30, padding: '0 14px', borderRadius: 'var(--radius-sm)',
                      background: density === d ? 'var(--accent-soft)' : 'var(--surface)',
                      border: `1px solid ${density === d ? 'var(--accent-line)' : 'var(--border)'}`,
                      color: density === d ? 'var(--accent)' : 'var(--text-2)',
                      fontFamily: 'var(--mono)', fontSize: 11.5, cursor: 'pointer',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sites */}
        <div className="settings-section">
          <div className="settings-label">
            <div className="settings-label-title">Sites</div>
            <div className="settings-label-sub">Connected Ghost instances</div>
          </div>
          <div className="settings-body">
            {SITES.map(s => (
              <div key={s.id} className="site-row-setting">
                <div className="site-fav" style={{
                  width: 32, height: 32, fontSize: 11,
                  background: s.hue.replace(')', '/0.15)'),
                  color: s.hue,
                  borderColor: s.hue.replace(')', '/0.3)'),
                }}>{s.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--text-3)' }}>{s.url}</div>
                </div>
                <div className={'status ' + (s.status === 'online' ? 'online' : s.status === 'warn' ? 'warn' : 'offline')}>
                  <span className="d" />
                  {s.status === 'online' ? 'connected' : s.status === 'warn' ? 'stale' : 'offline'}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="icon-btn"><I.Settings size={13} /></button>
                  <button className="icon-btn"><I.Ext size={13} /></button>
                </div>
              </div>
            ))}
            <button className="add-site-btn">
              <I.Plus size={14} /> Add Ghost site
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-label">
            <div className="settings-label-title">Notifications</div>
            <div className="settings-label-sub">Alerts for health &amp; publishing events</div>
          </div>
          <div className="settings-body">
            <div className="notif-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Email Reports</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Daily summary of all blog performance metrics.</div>
                </div>
                <Toggle on={emailReports} onChange={setEmailReports} />
              </div>
            </div>
            <div className="notif-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Slack Webhooks</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Real-time API error logs pushed to Slack.</div>
                </div>
                <Toggle on={slackAlerts} onChange={setSlackAlerts} />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div className="settings-section">
          <div className="settings-label">
            <div className="settings-label-title">Advanced</div>
            <div className="settings-label-sub">API traffic &amp; system diagnostics</div>
          </div>
          <div className="settings-body">
            <div className="log-shell">
              <div className="log-header">
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  System health: <span style={{ color: 'var(--teal)' }}>operational</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--teal)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2.4s infinite' }} />
                  live logs
                </span>
              </div>
              <div className="log-body">
                {API_LOGS.map((l, i) => (
                  <div key={i} className="log-line" style={{ opacity: i >= 3 ? 0.45 : 1 }}>
                    <span className="log-time">{l.time}</span>
                    <span className={'log-method log-' + l.method.toLowerCase()}>{l.method}</span>
                    <span className="log-path">{l.path}</span>
                    <span className="log-status">→ {l.status}</span>
                    <span className="log-ms">{l.ms}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="danger-zone">
              <I.Bell size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Danger Zone
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                  Purge local cache and reset all API authentication keys.
                </div>
              </div>
              <button className="btn" style={{ borderColor: 'oklch(0.66 0.15 25 / 0.4)', color: 'var(--red)' }}>Reset</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
