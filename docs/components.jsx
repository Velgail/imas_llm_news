/* こたつアイマス速報 — 紙面コンポーネント群 */

const { BRANDS } = window.KOTATSU;

/* --- 小物 --------------------------------------------------------------- */
function BrandChip({ brandKey }) {
  const b = BRANDS[brandKey] || BRANDS.sogo;
  return (
    <span className="chip" style={{ "--bh": b.hue }}>{b.label}</span>
  );
}

function KindTag({ kind }) {
  return (
    <span className={"kindtag" + (kind === "公式" ? " koushiki" : "")}>{kind}</span>
  );
}

function Placeholder({ label, className, style }) {
  return <div className={"ph " + (className || "")} data-label={label} style={style} />;
}

/* --- ユーティリティバー ------------------------------------------------- */
function Topbar({ edition, setEdition, query, setQuery, dateLong }) {
  return (
    <div className="topbar">
      <span className="topbar__date">{dateLong}</span>
      <span className="topbar__spacer" />
      <div className="edtoggle" role="group" aria-label="版の切替">
        <button aria-pressed={edition === "morning"} onClick={() => setEdition("morning")}>朝刊</button>
        <button aria-pressed={edition === "evening"} onClick={() => setEdition("evening")}>夕刊</button>
      </div>
      <label className="searchbox">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="紙面を検索"
          aria-label="紙面を検索"
        />
      </label>
      <button className="iconbtn" title="印刷" aria-label="印刷" onClick={() => window.print()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
        </svg>
      </button>
    </div>
  );
}

/* --- 題字 --------------------------------------------------------------- */
function Masthead({ masthead, ed }) {
  return (
    <header className="masthead">
      <div className="rule-double" />
      <div className="masthead__grid">
        <div className="issue-meta">
          <span className="edition-badge">{ed.name}</span>
          <span className="issue-no">{ed.issueNo}</span>
          <span className="date-long">{ed.dateLong}</span>
          <span className="pages">{ed.pages}・{ed.stamp}</span>
        </div>

        <div className="nameplate">
          <h1>こ<span className="kotatsu-mark">た</span>つアイマス速報</h1>
          <span className="yomi">{masthead.yomi}</span>
        </div>

        <div className="index-box">
          <span className="ib-label">{masthead.indexLabel}</span>
          <span className="ib-value">{ed.indexValue}</span>
          <span className="ib-note">{ed.indexNote}</span>
        </div>
      </div>
      <div className="masthead__tagline">{masthead.tagline}</div>
      <div className="rule-double bottom" />
    </header>
  );
}

/* --- ブランドナビ ------------------------------------------------------- */
function BrandNav({ active, setActive, counts }) {
  const items = [{ key: "all", label: "本日の総覧" }, ...Object.values(BRANDS)];
  return (
    <nav className="brandnav" aria-label="面の切替">
      {items.map((it) => (
        <button
          key={it.key}
          aria-pressed={active === it.key}
          onClick={() => setActive(it.key)}
        >
          {it.label}
          {counts[it.key] != null && <span className="cnt">{counts[it.key]}</span>}
        </button>
      ))}
    </nav>
  );
}

/* --- トップ記事（リード）------------------------------------------------ */
function LeadStory({ a, onOpen }) {
  return (
    <section className="lead-zone" onClick={() => onOpen(a)} style={{ cursor: "pointer" }}>
      <div className="lead-head">
        <div className="lead-meta">
          {a.badge && <span className="badge-flash">{a.badge}</span>}
          <BrandChip brandKey={a.brand} />
          <KindTag kind={a.kind} />
        </div>
        <h2>{a.title}</h2>
        <p className="lead-text">{a.lead}</p>
        <div className="byline" style={{ marginTop: 14 }}>
          <span>{a.source}</span><span className="dot">／</span>
          <span>{a.time} 配信</span><span className="dot">／</span>
          <span>{a.pageNo}</span>
        </div>
      </div>
      {a.img ? (
        <figure className="lead-media" style={{ margin: 0 }}>
          <Placeholder label={a.img} />
          <figcaption>＝ {a.img}（こたつ編集部・とって出し）</figcaption>
        </figure>
      ) : (
        <figure className="lead-media" style={{ margin: 0 }}>
          <Placeholder label="トップ記事 写真スペース" />
          <figcaption>＝ 写真は追って差し替え予定</figcaption>
        </figure>
      )}
    </section>
  );
}

/* --- 記事カード（本記）-------------------------------------------------- */
function StoryCard({ a, onOpen }) {
  const span2 = a.size === "large" && a.img;
  return (
    <article
      className={"story size-" + a.size + (span2 ? " span2" : "")}
      onClick={() => onOpen(a)}
    >
      <span className="pageno">{a.pageNo}</span>
      {a.img && <Placeholder label={a.img} />}
      <div className="s-meta">
        {a.badge && <span className="badge-flash">{a.badge}</span>}
        <BrandChip brandKey={a.brand} />
        <KindTag kind={a.kind} />
      </div>
      <h3>{a.title}</h3>
      {a.size !== "small" && <p>{a.lead}</p>}
      <div className="s-foot byline">
        <span>{a.source}</span><span className="dot">／</span><span>{a.time}</span>
      </div>
    </article>
  );
}

/* --- サイドバー：ウィジェット ------------------------------------------ */
function WidgetHead({ title, sub }) {
  return (
    <div className="widget__head">
      <h4>{title}</h4>
      {sub && <span className="sub">{sub}</span>}
    </div>
  );
}

function RankingWidget({ data }) {
  const arrow = { up: "▲", down: "▼", keep: "—" };
  return (
    <section className="widget">
      <WidgetHead title="24時間 話題のアイドル" sub="集計：こたつ調べ" />
      <ol className="rank-list">
        {data.map((r) => (
          <li key={r.rank}>
            <span className="rk">{r.rank}</span>
            <span className="nm">{r.name}</span>
            <BrandChip brandKey={r.brand} />
            <span className={"mv " + r.move}>{arrow[r.move]}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ArtPicksWidget({ data }) {
  return (
    <section className="widget">
      <WidgetHead title="本日のPイラスト" sub="PICK UP" />
      <div className="art-grid">
        {data.map((p, i) => (
          <div className="art-item" key={i}>
            <Placeholder label={p.caption} />
            <div className="art-cap">{p.by}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BirthdayWidget({ data }) {
  return (
    <section className="widget">
      <WidgetHead title="本日のお誕生日" sub="HAPPY BIRTHDAY" />
      <ul className="bday-list">
        {data.map((b, i) => (
          <li key={i}>
            <span className="cake">●</span>
            <span style={{ flex: 1 }}>{b.name}</span>
            <BrandChip brandKey={b.brand} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function EditorialWidget({ data }) {
  return (
    <section className="widget">
      <WidgetHead title={data.head} sub="こたつ編集後記" />
      <div className="editorial">
        <div className="ed-head ed-vert">社説</div>
        <div className="ed-title ed-vert">{data.title}</div>
        <div className="ed-body ed-vert">{data.body}</div>
      </div>
    </section>
  );
}

/* --- バックナンバー ----------------------------------------------------- */
function BackIssues() {
  const issues = [
    { date: "6月3日 朝刊", no: "第 1,246 号", lead: "周年記念配信、発表ラッシュで深夜まで沸騰", ph: "前号トップ" },
    { date: "6月2日 朝刊", no: "第 1,245 号", lead: "新グッズ受注開始、再販希望の声も相次ぐ", ph: "前号トップ" },
    { date: "6月1日 朝刊", no: "第 1,244 号", lead: "月初恒例・今月のイベント一覧まとめ", ph: "前号トップ" },
    { date: "5月31日 朝刊", no: "第 1,243 号", lead: "月末ライブ、二日間の熱気を総括", ph: "前号トップ" },
    { date: "5月30日 朝刊", no: "第 1,242 号", lead: "新ユニット発表、考察スレが乱立", ph: "前号トップ" },
  ];
  return (
    <section className="backissues">
      <div className="backissues__head">
        <h4>バックナンバー棚</h4>
        <span className="byline">過去の号をめくる →</span>
      </div>
      <div className="bi-row">
        {issues.map((it, i) => (
          <div className="bi-card" key={i}>
            <div className="bi-date">{it.date}</div>
            <div className="bi-no">{it.no}</div>
            <Placeholder label={it.ph} className="bi-ph" />
            <div className="bi-lead">{it.lead}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --- 奥付 --------------------------------------------------------------- */
function Colophon() {
  return (
    <footer className="colophon">
      <p className="disclaimer">
        本紙は<strong>全自動こたつ編集部</strong>がお届けする日刊紙です。記者は一歩も外へ出ず、こたつから情報をかき集めて編集しています。
        したがって本紙の記事は<strong>すべて未校閲・とって出し</strong>。誤報・憶測・とんち・記憶違いを含む場合があります。
        正確な情報は必ず各公式の発表をご確認ください。なにとぞ温かい目で。
      </p>
      <div className="seal">未校閲<br />につき<br />要確認</div>
    </footer>
  );
}

/* グローバル公開 */
Object.assign(window, {
  BrandChip, KindTag, Placeholder, Topbar, Masthead, BrandNav,
  LeadStory, StoryCard, RankingWidget, ArtPicksWidget, BirthdayWidget,
  EditorialWidget, BackIssues, Colophon,
});
