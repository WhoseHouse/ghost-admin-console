import { I } from '../components/icons.jsx';
import { SITES, fmtNum } from '../data/mockData.js';

const TIERS = [
  { id:"founding", name:"Founding Member",     icon:"Tiers",      price:"$25/mo",  members:842,  features:["Unlimited posts","Ad-free","Discord sync"],           mrr:21050, legacy:false },
  { id:"pro",      name:"Pro Publisher",        icon:"Offers",     price:"$99/mo",  members:156,  features:["Custom domain","API access","Priority support"],       mrr:15444, legacy:false },
  { id:"legacy",   name:"Early Bird (Legacy)",  icon:"Newsletter", price:"$10/mo",  members:2142, features:["Discounted access","Non-renewable"],                   mrr:21420, legacy:true  },
];

const OFFERS = [
  { code:"HOLIDAY24",  value:"20% OFF",  uses:"1,204 / ∞", note:"Expires in 12 days",  cls:"accent" },
  { code:"LAUNCHFREE", value:"100% OFF", uses:"45 / 100",   note:"1 month trial",        cls:"teal"   },
  { code:"WELCOME10",  value:"$10 OFF",  uses:"8,231 / ∞", note:"Permanent base",       cls:"amber"  },
];

const TRANSACTIONS = [
  { initials:"JD", name:"James Dalton",  email:"james@dalton.io",      tier:"Founding Member", siteId:"wd", code:"HOLIDAY24",  amount:"$20.00", status:"success" },
  { initials:"SK", name:"Sarah K.",      email:"sarah@creative.co",    tier:"Pro Publisher",   siteId:"qm", code:"—",          amount:"$99.00", status:"success" },
  { initials:"MT", name:"Mark Thompson", email:"mark@thompson.net",    tier:"Founding Member", siteId:"wd", code:"WELCOME10",  amount:"$15.00", status:"failed"  },
  { initials:"PR", name:"Priya Rao",     email:"priya@rao.dev",        tier:"Pro Publisher",   siteId:"qm", code:"—",          amount:"$99.00", status:"success" },
  { initials:"AO", name:"Anita Owens",   email:"a.owens@outlook.com",  tier:"Founding Member", siteId:"rh", code:"LAUNCHFREE", amount:"$0.00",  status:"success" },
];

const REVENUE_DIST = [
  { label:"Quiet Machines",  siteId:"qm", pct:52 },
  { label:"Wavelength Daily",siteId:"wd", pct:27 },
  { label:"Roomhouse",       siteId:"rh", pct:13 },
  { label:"Others",          siteId:"fl", pct:8  },
];

export default function TiersOffers() {
  const totalMRR  = TIERS.reduce((a, t) => a + t.mrr, 0);
  const totalSubs = TIERS.reduce((a, t) => a + t.members, 0);

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Tiers &amp; Offers</h1>
          <p className="page-sub">Global revenue management · <span className="mono">Stripe integrated</span></p>
        </div>
        <div className="head-tools">
          <button className="btn">Download report</button>
          <button className="btn primary"><I.Plus size={13} /> New tier</button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total MRR',          val: '$' + fmtNum(totalMRR), sub: '↑ 12.4% vs last mo', cls: 'up', accent: true },
          { label: 'Active Subscribers', val: fmtNum(totalSubs),       sub: '↑ 243 this week',    cls: 'up' },
          { label: 'Churn Rate',         val: '1.24%',                  sub: '↓ 0.15% improvement',cls: 'up' },
          { label: 'Coupon Conversions', val: '8.7%',                   sub: 'From active campaigns',cls: 'flat' },
        ].map(m => (
          <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize: 28, marginTop: 10, color: m.accent ? 'var(--accent)' : 'var(--text)' }}>
              {m.val}
            </div>
            <div className="metric-foot">
              <span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="tw-col" style={{ gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="sec-head">
            <div className="sec-title">
              Global Tiers <span className="sec-count">{TIERS.filter(t => !t.legacy).length} active</span>
            </div>
            <div className="sec-actions">
              <span className="status online" style={{ fontSize: 10 }}>
                <span className="d" />Stripe live
              </span>
            </div>
          </div>

          {TIERS.map(t => {
            const Ic = I[t.icon] || I.Tiers;
            return (
              <div key={t.id} className={'tier-card' + (t.legacy ? ' tier-legacy' : '')}>
                <div className="tier-head">
                  <div className="tier-icon"><Ic size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.legacy ? 'var(--text-3)' : 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                      {t.features.slice(0, 2).join(' · ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 600, color: t.legacy ? 'var(--text-3)' : 'var(--accent)' }}>{t.price}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--teal)' }}>{fmtNum(t.members)} members</div>
                  </div>
                </div>
                {!t.legacy && (
                  <div className="tier-foot">
                    <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: 'var(--text-2)' }}>
                      {t.features.map((f, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <I.Check size={11} style={{ color: 'var(--teal)' }} />{f}
                        </span>
                      ))}
                    </div>
                    <button className="btn" style={{ height: 24, fontSize: 11, padding: '0 10px' }}>
                      Edit <I.Ext size={10} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300, flexShrink: 0 }}>
          <div className="sec-head">
            <div className="sec-title">Active Offers</div>
            <button className="btn" style={{ height: 24, fontSize: 11, padding: '0 10px' }}>
              <I.Plus size={11} /> Create code
            </button>
          </div>
          <div className="data-table" style={{ marginBottom: 0 }}>
            <div className="dt-head" style={{ gridTemplateColumns: '1fr 80px 80px' }}>
              <div>Code</div><div className="r">Value</div><div className="r">Uses</div>
            </div>
            {OFFERS.map((o, i) => (
              <div key={i} className="dt-row" style={{ gridTemplateColumns: '1fr 80px 80px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{o.code}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)' }}>{o.note}</div>
                </div>
                <div className="r" style={{
                  fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
                  color: o.cls === 'teal' ? 'var(--teal)' : o.cls === 'amber' ? 'var(--amber)' : 'var(--accent)',
                }}>{o.value}</div>
                <div className="r mono-sm" style={{ color: 'var(--text-2)' }}>{o.uses}</div>
              </div>
            ))}
          </div>

          <div className="widget" style={{
            background: 'linear-gradient(135deg,oklch(0.74 0.15 35 / 0.14),oklch(0.74 0.15 35 / 0.06))',
            borderColor: 'oklch(0.74 0.15 35 / 0.25)',
          }}>
            <div className="widget-title" style={{ color: 'var(--text)' }}>Revenue Distribution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {REVENUE_DIST.map((r, i) => {
                const site = SITES.find(s => s.id === r.siteId);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: site.hue, display: 'inline-block' }} />
                        {r.label}
                      </span>
                      <span style={{ fontFamily: 'var(--mono)' }}>{r.pct}%</span>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width: r.pct + '%', background: site.hue }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div className="sec-head">
          <div className="sec-title">Recent Transactions</div>
          <button className="btn" style={{ height: 24, fontSize: 11, padding: '0 10px' }}>View all</button>
        </div>
        <div className="data-table">
          <div className="dt-head" style={{ gridTemplateColumns: '1fr 120px 80px 90px 70px 80px' }}>
            <div>Customer</div><div>Tier</div><div>Site</div><div>Offer Code</div>
            <div className="r">Amount</div><div className="r">Status</div>
          </div>
          {TRANSACTIONS.map((tx, i) => {
            const site = SITES.find(s => s.id === tx.siteId);
            return (
              <div key={i} className="dt-row" style={{ gridTemplateColumns: '1fr 120px 80px 90px 70px 80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="m-av" style={{
                    background: site.hue.replace(')', '/0.15)'),
                    color: site.hue,
                    borderColor: site.hue.replace(')', '/0.3)'),
                  }}>{tx.initials}</div>
                  <div>
                    <div className="dt-title" style={{ fontWeight: 500 }}>{tx.name}</div>
                    <div className="dt-sub">{tx.email}</div>
                  </div>
                </div>
                <div className="dt-sub">{tx.tier}</div>
                <div><span className="pill pill-dim">{site.initials}</span></div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: tx.code === '—' ? 'var(--text-3)' : 'var(--teal)' }}>{tx.code}</div>
                <div className="r" style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{tx.amount}</div>
                <div className="r">
                  <span className={'pill ' + (tx.status === 'success' ? 'pill-teal' : 'pill-red')}>{tx.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
