const NODES = [
  [200, 40], [330, 110], [360, 230], [200, 370], [40, 230], [70, 110],
  [140, 75], [260, 75], [120, 300], [280, 300], [200, 200],
];
const LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [6, 5], [0, 7], [7, 1],
  [6, 10], [7, 10], [10, 8], [10, 9], [8, 3], [9, 3], [2, 9], [4, 8], [10, 0], [10, 3],
];
const HEART = 'M200 330C90 250 50 190 60 140 72 90 140 75 200 140 260 75 328 90 340 140 350 190 310 250 200 330Z';

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ee6d6" />
          <stop offset="1" stopColor="#b59cff" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="8" fill="url(#lg)" fillOpacity=".18" stroke="url(#lg)" />
      <path d="M5 14h4l2-4 3 8 2-4h7" fill="none" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartArt() {
  return (
    <svg className="heart-art" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ee6d6" />
          <stop offset="1" stopColor="#b59cff" />
        </linearGradient>
      </defs>
      <g stroke="url(#hg)" strokeOpacity=".5" fill="none">
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>
      <path d={HEART} fill="url(#hg)" fillOpacity=".25" stroke="url(#hg)" strokeWidth="2.5" />
      <g fill="#dffdf8">
        {NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" />)}
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <>
      <nav className="nav">
        <a className="brand" href="#top">
          <Logo />
          <span>Health check</span>
        </a>
        <div className="nav-links">
          <a href="#check">Check</a>
          <a href="#how">How it works</a>
        </div>
        <a className="btn primary sm" href="#check">Start check</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy">
          <span className="pill"><span className="dot" />Screening for BMI, waist, sugar and blood pressure</span>
          <h1>
            Understand your health numbers <span className="grad">in one clear report</span>
          </h1>
          <p className="lede">
            Enter your measurements and get a color-coded analysis against standard reference ranges, with practical next steps. Everything is calculated in your browser.
          </p>
          <div className="cta-row">
            <a className="btn primary" href="#check">Start health check</a>
            <a className="btn ghost" href="#how">How it works</a>
          </div>
          <dl className="hero-stats">
            <div><dt>4</dt><dd>core measures checked</dd></div>
            <div><dt>3</dt><dd>reference sources used</dd></div>
            <div><dt>0</dt><dd>data stored by this app</dd></div>
          </dl>
        </div>

        <div className="hero-visual">
          <HeartArt />
          <aside className="glass float" id="how">
            <h3>How it works</h3>
            <ol>
              <li>Enter your measurements</li>
              <li>Review color-coded results</li>
              <li>Follow the recommendations</li>
            </ol>
          </aside>
        </div>
      </header>

      <div className="refs">
        <span>Guidance based on</span>
        <b>WHO</b>
        <b>ADA</b>
        <b>ACC/AHA</b>
      </div>
    </>
  );
}
