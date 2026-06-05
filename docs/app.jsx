/* こたつアイマス速報 — メインApp */

const { useState, useMemo, useEffect } = React;
const K = window.KOTATSU;

/* 記事リーダー（クリックで開く） */
function ArticleReader({ a, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  if (!a) return null;
  const paras = [
    a.lead,
    "※ 以下はこたつ編集部が憶測と願望で補った続報である。一次情報は各公式の発表を確認されたい。",
    "発表を受けて、担当を名乗るアカウントのタイムラインは一様に祝祭の様相を呈した。引用の連鎖は途切れることなく、関連タグは数時間にわたり上位を占め続けている。",
    "識者（自称）は「これは事件だ」と興奮気味に語る。一方で冷静な層からは「ソースはどこ」「とりあえず公式を待て」という、極めて健全な指摘も上がっている。",
    "本紙としては、いずれにせよ我々の担当が今日も尊いという揺るぎない事実だけを、ここに記しておきたい。続報は次号にて。",
  ];
  return (
    <div className="reader-scrim" onClick={onClose}>
      <article className="reader" onClick={(e) => e.stopPropagation()}>
        <button className="reader__close" onClick={onClose} aria-label="閉じる">×</button>
        <div className="reader__meta">
          {a.badge && <span className="badge-flash">{a.badge}</span>}
          <BrandChip brandKey={a.brand} />
          <KindTag kind={a.kind} />
          <span className="byline"><span>{a.pageNo}</span></span>
        </div>
        <h1 className="reader__title">{a.title}</h1>
        <div className="byline reader__byline">
          <span>{a.source}</span><span className="dot">／</span>
          <span>{a.time} 配信</span><span className="dot">／</span>
          <span>こたつ編集部</span>
        </div>
        {a.img && <Placeholder label={a.img} className="reader__hero" />}
        <div className="reader__body">
          {paras.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="reader__tags">
          {a.tags.map((t) => <span className="tag" key={t}># {t}</span>)}
        </div>
        <div className="reader__note">
          🛋 この記事はこたつ発・未校閲です。正確な情報は各公式の発表をご確認ください。
        </div>
      </article>
    </div>
  );
}

function App() {
  const [edition, setEdition] = useState("morning");
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);

  const ed = K.EDITIONS[edition];

  const editionArticles = useMemo(
    () => K.ARTICLES.filter((a) => a.edition === edition),
    [edition]
  );

  // ナビの面別件数
  const counts = useMemo(() => {
    const c = { all: editionArticles.length };
    Object.keys(K.BRANDS).forEach((k) => {
      c[k] = editionArticles.filter((a) => a.brand === k).length;
    });
    return c;
  }, [editionArticles]);

  const q = query.trim();
  const filtered = useMemo(() => {
    return editionArticles.filter((a) => {
      const brandOk = active === "all" || a.brand === active;
      const qOk = !q || (a.title + a.lead + a.tags.join("")).includes(q);
      return brandOk && qOk;
    });
  }, [editionArticles, active, q]);

  const lead = filtered.find((a) => a.size === "lead");
  const stories = filtered.filter((a) => a !== lead);

  return (
    <div className="paper">
      <Topbar
        edition={edition}
        setEdition={setEdition}
        query={query}
        setQuery={setQuery}
        dateLong={ed.dateLong}
      />
      <Masthead masthead={K.MASTHEAD} ed={ed} />
      <BrandNav active={active} setActive={setActive} counts={counts} />

      {lead && <LeadStory a={lead} onOpen={setOpen} />}

      <div className="frontpage">
        <div className="col-main">
          <div className="stories">
            {stories.length > 0 ? (
              stories.map((a) => <StoryCard key={a.id} a={a} onOpen={setOpen} />)
            ) : (
              <div className="empty-note">
                該当する記事は本号にありません。<br />別の面・別の版をめくってみてください。
              </div>
            )}
          </div>
        </div>

        <aside className="col-side">
          <RankingWidget data={K.RANKING} />
          <ArtPicksWidget data={K.ARTPICKS} />
          <BirthdayWidget data={K.BIRTHDAYS} />
          <EditorialWidget data={K.EDITORIAL} />
        </aside>
      </div>

      <BackIssues />
      <Colophon />

      {open && <ArticleReader a={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
