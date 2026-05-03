import { I } from '../components/icons.jsx';
import { SITES, fmtNum } from '../data/mockData.js';
import { useLiveTiers, useLiveOffers } from '../hooks/useLiveData.js';
import useSiteStore from '../store/siteStore.js';

const HUE_PALETTE = [
  'oklch(0.66 0.13 35)', 'oklch(0.74 0.11 180)', 'oklch(0.62 0.10 260)',
  'oklch(0.74 0.13 80)', 'oklch(0.55 0.10 320)', 'oklch(0.66 0.15 25)',
];

const MOCK_TIERS = [
  { id:"founding", name:"Founding Member",    icon:"Tiers",      price:"$25/mo",  members:842,  features:["Unlimited posts","Ad-free","Discord sync"],         mrr:21050, legacy:false },
  { id:"pro",      name:"Pro Publisher",       icon:"Offers",     price:"$99/mo",  members:156,  features:["Custom domain","API access","Priority support"],     mrr:15444, legacy:false },
  { id:"legacy",   name:"Early Bird (Legacy)", icon:"Newsletter", price:"$10/mo",  members:2142, features:["Discounted access","Non-renewable"],                 mrr:21420, legacy:true  },
];

const MOCK_OFFERS = [
  { code:"HOLIDAY24",  value:"20% OFF",  uses:"1,204 / ∞", note:"Expires in 12 days",  cls:"accent" },
  { code:"LAUNCHFREE", value:"100% OFF", uses:"45 / 100",   note:"1 month trial",       cls:"teal"   },
  { code:"WELCOME10",  value:"$10 OFF",  uses:"8,231 / ∞", note:"Permanent base",      cls:"amber"  },
];

const MOCK_TRANSACTIONS = [
  { initials:"JD", name:"James Dalton",  email:"james@dalton.io",     tier:"Founding Member", siteId:"wd", code:"HOLIDAY24",  amount:"$20.00", status:"success" },
  { initials:"SK", name:"Sarah K.",      email:"sarah@creative.co",   tier:"Pro Publisher",   siteId:"qm", code:"—",          amount:"$99.00", status:"success" },
  { initials:"MT", name:"Mark Thompson", email:"mark@thompson.net",   tier:"Founding Member", siteId:"wd", code:"WELCOME10",  amount:"$15.00", status:"failed"  },
  { initials:"PR", name:"Priya Rao",     email:"priya@rao.dev",       tier:"Pro Publisher",   siteId:"qm", code:"—",          amount:"$99.00", status:"success" },
  { initials:"AO", name:"Anita Owens",   email:"a.owens@outlook.com", tier:"Founding Member", siteId:"rh", code:"LAUNCHFREE", amount:"$0.00",  status:"success" },
];

const MOCK_REVENUE_DIST = [
  { label:"Quiet Machines",   siteId:"qm", pct:52 },
  { label:"Wavelength Daily", siteId:"wd", pct:27 },
  { label:"Roomhouse",        siteId:"rh", pct:13 },
  { label:"Others",           siteId:"fl", pct:8  },
];

function fmtPrice(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 0 }).format(amount);
}

function offerLabel(o) {
  if (o.type === 'percent') return `${o.discountAmount}% OFF`;
  if (o.type === 'fixed')   return `${fmtPrice(o.discountAmount / 100, o.currency)} OFF`;
  if (o.type === 'trial')   return `${o.discountAmount} day trial`;
  return '—';
}

export default function TiersOffers() {
  const { dataSource } = useSiteStore();
  const isLive = dataSource === 'live';

  const { data: liveTiers  = [], isLoading: tiersLoading,  error: tiersError  } = useLiveTiers();
  const { data: liveOffers = [], isLoading: offersLoading, error: offersError } = useLiveOffers();

  const mockTotalMRR  = MOCK_TIERS.reduce((a, t) => a + t.mrr, 0);
  const mockTotalSubs = MOCK_TIERS.reduce((a, t) => a + t.members, 0);

  const livePaidTiers = liveTiers.filter(t => t.type === 'paid');
  const liveActiveOffers = liveOffers.filter(o => o.status === 'active');

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Tiers &amp; Offers</h1>
          <p className="page-sub">
            {isLive
              ? (tiersError ? <span style={{ color: 'var(--red)' }}>API error: {tiersError.message}</span>
                : <>Live membership config · <span className="mono">{liveTiers.length} tiers</span></>)
              : <>Global revenue management · <span className="mono">Stripe integrated</span></>
            }
          </p>
        </div>
        <div className="head-tools">
          {!isLive && <button className="btn">Download report</button>}
          <button className="btn primary"><I.Plus size={13} /> New tier</button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 24 }}>
        {isLive ? [
          { label: 'Total Tiers',   val: tiersLoading  ? '…' : String(liveTiers.length),         sub: 'configured' },
          { label: 'Paid Tiers',    val: tiersLoading  ? '…' : String(livePaidTiers.length),      sub: 'with pricing', cls: livePaidTiers.length > 0 ? 'up' : 'flat' },
          { label: 'Active Offers', val: offersLoading ? '…' : String(liveActiveOffers.length),   sub: 'running', cls: liveActiveOffers.length > 0 ? 'up' : 'flat' },
          { label: 'Total Offers',  val: offersLoading ? '…' : String(liveOffers.length),         sub: 'all time' },
        ].map(m => (
          <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize: 28, marginTop: 10 }}>{m.val}</div>
            <div className="metric-foot"><span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span></div>
          </div>
        )) : [
          { label: 'Total MRR',          val: '$' + fmtNum(mockTotalMRR), sub: '↑ 12.4% vs last mo', cls: 'up', accent: true },
          { label: 'Active Subscribers', val: fmtNum(mockTotalSubs),       sub: '↑ 243 this week',    cls: 'up' },
          { label: 'Churn Rate',         val: '1.24%',                     sub: '↓ 0.15% improvement', cls: 'up' },
          { label: 'Coupon Conversions', val: '8.7%',                      sub: 'From active campaigns', cls: 'flat' },
        ].map(m => (
          <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize: 28, marginTop: 10, color: m.accent ? 'var(--accent)' : 'var(--text)' }}>
              {m.val}
            </div>
            <div className="metric-foot"><span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span></div>
          </div>
        ))}
      </div>

      <div className="tw-col" style={{ gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="sec-head">
            <div className="sec-title">
              {isLive ? 'Tiers' : 'Global Tiers'}{' '}
              <span className="sec-count">{isLive ? `${livePaidTiers.length} paid` : `${MOCK_TIERS.filter(t => !t.legacy).length} active`}</span>
            </div>
          </div>

          {isLive ? (
            tiersLoading ? (
              <div style={{ padding: '16px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>Loading tiers…</div>
            ) : liveTiers.map((t, i) => {
              const hue    = HUE_PALETTE[i % HUE_PALETTE.length];
              const isPaid = t.type === 'paid';
              const isArchived = t.status !== 'active';
              return (
                <div key={t.id} className={'tier-card' + (isArchived ? ' tier-legacy' : '')}>
                  <div className="tier-head">
                    <div className="tier-icon" style={{ color: isArchived ? 'var(--text-3)' : hue }}>
                      <I.Tiers size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isArchived ? 'var(--text-3)' : 'var(--text)' }}>
                        {t.name}
                        {t.type === 'free' && <span className="pill pill-dim" style={{ marginLeft: 8, fontSize: 10 }}>free</span>}
                        {isArchived && <span className="pill pill-dim" style={{ marginLeft: 8, fontSize: 10 }}>archived</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                        {t.description || t.siteLabel}
                      </div>
                    </div>
                    {isPaid && (
                      <div style={{ textAlign: 'right' }}>
                        {t.monthlyPrice !== null && (
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 600, color: isArchived ? 'var(--text-3)' : 'var(--accent)' }}>
                            {fmtPrice(t.monthlyPrice, t.currency)}/mo
                          </div>
                        )}
                        {t.yearlyPrice !== null && (
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>
                            {fmtPrice(t.yearlyPrice, t.currency)}/yr
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {t.benefits.length > 0 && (
                    <div className="tier-foot">
                      <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: 'var(--text-2)', flexWrap: 'wrap' }}>
                        {t.benefits.map((b, j) => (
                          <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <I.Check size={11} style={{ color: 'var(--teal)' }} />{b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            MOCK_TIERS.map(t => {
              const Ic = I[t.icon] || I.Tiers;
              return (
                <div key={t.id} className={'tier-card' + (t.legacy ? ' tier-legacy' : '')}>
                  <div className="tier-head">
                    <div className="tier-icon"><Ic size={18} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.legacy ? 'var(--text-3)' : 'var(--text)' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{t.features.slice(0, 2).join(' · ')}</div>
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
                      <button className="btn" style={{ height: 24, fontSize: 11, padding: '0 10px' }}>Edit <I.Ext size={10} /></button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300, flexShrink: 0 }}>
          <div className="sec-head">
            <div className="sec-title">
              {isLive ? 'Offers' : 'Active Offers'}
            </div>
            <button className="btn" style={{ height: 24, fontSize: 11, padding: '0 10px' }}>
              <I.Plus size={11} /> Create code
            </button>
          </div>
          <div className="data-table" style={{ marginBottom: 0 }}>
            {isLive ? (
              <>
                <div className="dt-head" style={{ gridTemplateColumns: '1fr 90px 70px' }}>
                  <div>Code</div><div className="r">Discount</div><div className="r">Uses</div>
                </div>
                {offersLoading && (
                  <div style={{ padding: '12px 16px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 11 }}>Loading…</div>
                )}
                {liveOffers.length === 0 && !offersLoading && (
                  <div style={{ padding: '12px 16px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 11 }}>No offers configured.</div>
                )}
                {liveOffers.map((o, i) => (
                  <div key={o.id || i} className="dt-row" style={{ gridTemplateColumns: '1fr 90px 70px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 12.5, fontWeight: 600, color: o.status === 'active' ? 'var(--text)' : 'var(--text-3)' }}>
                        {o.code}
                        {o.status !== 'active' && <span className="pill pill-dim" style={{ marginLeft: 6, fontSize: 9 }}>archived</span>}
                      </div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)' }}>{o.name}</div>
                    </div>
                    <div className="r" style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                      {offerLabel(o)}
                    </div>
                    <div className="r mono-sm" style={{ color: 'var(--text-2)' }}>{o.redemptionCount}</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="dt-head" style={{ gridTemplateColumns: '1fr 80px 80px' }}>
                  <div>Code</div><div className="r">Value</div><div className="r">Uses</div>
                </div>
                {MOCK_OFFERS.map((o, i) => (
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
              </>
            )}
          </div>

          {!isLive && (
            <div className="widget" style={{
              background: 'linear-gradient(135deg,oklch(0.74 0.15 35 / 0.14),oklch(0.74 0.15 35 / 0.06))',
              borderColor: 'oklch(0.74 0.15 35 / 0.25)',
            }}>
              <div className="widget-title">Revenue Distribution</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                {MOCK_REVENUE_DIST.map((r, i) => {
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
          )}
        </div>
      </div>

      {!isLive && (
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
            {MOCK_TRANSACTIONS.map((tx, i) => {
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
      )}
    </div>
  );
}
