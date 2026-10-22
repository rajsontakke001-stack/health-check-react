import { useEffect, useRef, useState } from 'react';
import { STANDARDS } from '../health.js';

function RangeBar({ value, min, max, zones }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  let from = min;
  return (
    <div className="range">
      <div className="bar">
        {zones.map(([to, tone]) => {
          const flex = to - from;
          from = to;
          return <span key={to} style={{ flex, background: `var(--z-${tone})` }} />;
        })}
      </div>
      <span className="tick" style={{ left: `${pct}%` }} />
    </div>
  );
}

function MetricCard({ m }) {
  return (
    <article className={`metric tone-${m.result.tone}`}>
      <header className="metric-head">
        <h3>{m.title}</h3>
        <span className="chip">{m.result.label}</span>
      </header>
      <p className="metric-value">{m.valueText}</p>
      <RangeBar value={m.value} min={m.min} max={m.max} zones={m.zones} />
      <p className="ref">Reference: {m.ref}</p>
      <p className="note">{m.note}</p>
    </article>
  );
}

export default function Report({ report, onClose }) {
  const [tab, setTab] = useState('results');
  const dialogRef = useRef(null);
  const healthy = report.metrics.filter((m) => m.result.tone === 'good').length;
  const date = report.date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const tabClass = (id) => `tab${tab === id ? ' is-active' : ''}`;

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="report-title" tabIndex={-1} ref={dialogRef}>
        <header className="dialog-head">
          <div>
            <h2 id="report-title">{report.name ? `Report for ${report.name}` : 'Your report'}</h2>
            <time className="muted">{date}</time>
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn ghost sm" onClick={() => window.print()}>Print</button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close report">×</button>
          </div>
        </header>

        <div className="dialog-body">
          {report.urgent && (
            <p className="alert">Urgent: your blood pressure is in the hypertensive crisis range. Seek medical care right away.</p>
          )}

          <p className={`verdict tone-${report.tone}`}>{report.verdictText}</p>

          <dl className="summary">
            <div className="stat"><dt>Measures checked</dt><dd>{report.metrics.length}</dd></div>
            <div className="stat"><dt>In healthy range</dt><dd>{healthy}</dd></div>
            <div className="stat"><dt>Need attention</dt><dd>{report.metrics.length - healthy}</dd></div>
          </dl>

          <div className="tabs" role="tablist" aria-label="Report sections">
            <button type="button" role="tab" aria-selected={tab === 'results'} className={tabClass('results')} onClick={() => setTab('results')}>
              Results
            </button>
            <button type="button" role="tab" aria-selected={tab === 'recs'} className={tabClass('recs')} onClick={() => setTab('recs')}>
              Recommendations
            </button>
          </div>

          {tab === 'results' ? (
            <div role="tabpanel">
              <div className="metric-grid">
                {report.metrics.map((m) => <MetricCard key={m.title} m={m} />)}
              </div>
              <details>
                <summary>Reference standards</summary>
                <div className="std-grid">
                  {STANDARDS.map((s) => (
                    <div key={s.title}>
                      <h3>{s.title}</h3>
                      <table>
                        <tbody>
                          {s.rows.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
                <p className="muted">Based on WHO, American Diabetes Association and ACC/AHA guidance.</p>
              </details>
            </div>
          ) : (
            <div role="tabpanel" className="rec-grid">
              {report.recs.map((rec) => (
                <article className="rec" key={rec.title}>
                  <h3>{rec.title}</h3>
                  <ul>{rec.items.map((t) => <li key={t}>{t}</li>)}</ul>
                </article>
              ))}
            </div>
          )}

          <p className="disclaimer">
            This report gives general screening information, not a diagnosis. Blood sugar and blood pressure often need repeat readings or lab tests to confirm. Check with a qualified doctor before acting on this report or changing any medicine.
          </p>
        </div>
      </div>
    </div>
  );
}
