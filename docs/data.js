/* こたつアイマス速報 — 紙面データ
   全自動こたつ編集部がお届けする、未校閲・とって出しのアイマス日刊紙。
   ※ 記事内容はすべて架空のサンプルです。 */
(function () {
  // ブランド（面）の定義。色は公式アイドルカラーの再現ではなく、
  // 低彩度で調和させたオリジナルの分類色（同L・同C・色相のみ可変）。
  const BRANDS = {
    sogo:   { key: "sogo",   label: "総合",       short: "総",  hue: 70 },
    as765:  { key: "as765",  label: "765プロ",    short: "765", hue: 55 },
    cg:     { key: "cg",     label: "シンデレラ", short: "デレ", hue: 255 },
    ml:     { key: "ml",     label: "ミリオン",   short: "ミリ", hue: 350 },
    sc:     { key: "sc",     label: "シャイニー", short: "シャニ", hue: 200 },
    sidem:  { key: "sidem",  label: "SideM",      short: "M",   hue: 150 },
    gaku:   { key: "gaku",   label: "学マス",     short: "学",  hue: 305 },
  };

  const MASTHEAD = {
    title: "こたつアイマス速報",
    yomi: "KOTATSU iM@S TIMES",
    tagline: "全自動こたつ編集部がお届けする、未校閲・とって出しのアイマス日刊紙",
    issue: "第 1,247 号",
    indexLabel: "本日のアイマス指数",
  };

  // 本日の号。1日1刷・正午発行。号数・面数・トップ記事はこの一号で完結する。
  const ISSUE = {
    key: "daily",
    name: "日刊",
    issueNo: "第 1,247 号",
    dateLong: "2026年（令和8年）6月4日　木曜日",
    pages: "全 16 面",
    stamp: "本日 12:00 発行",
    indexValue: "青天井",
    indexNote: "盛り上がり最高潮・夜まで快晴の見込み",
  };

  // 記事。lead=見出し下のリード文。img=画像プレースホルダの説明。
  // size: lead(トップ) / large / medium / small。badge: 速報 等。
  const ARTICLES = [
    {
      id: "a01", brand: "sogo", kind: "公式",
      size: "lead", badge: "速報",
      title: "全ブランド合同　真夏のドームフェス開催決定",
      lead: "各公式アカウントが同時刻に告知。出演ブランド・会場規模ともに過去最大級か。発表直後からSNSは騒然となり、関連ワードが軒並みトレンド入り。チケット最速先行の受付開始日にも注目が集まる。",
      img: "合同フェスのキービジュアル（横長）",
      time: "06:00", source: "各公式同時告知", pageNo: "1面",
      tags: ["ライブ", "速報", "横断"],
    },
    {
      id: "a02", edition: "morning", brand: "as765", kind: "公式",
      size: "large", badge: "",
      title: "765プロ、秋の新曲MV第二弾を公開",
      lead: "透明感のある映像表現にSNSは「作画がエグい」と称賛の嵐。サビの振り付けを巡る考察スレも早速発生している。",
      img: "新曲MVのワンシーン",
      time: "07:20", source: "公式チャンネル", pageNo: "3面",
      tags: ["新曲", "MV"],
    },
    {
      id: "a03", edition: "morning", brand: "cg", kind: "ファン",
      size: "medium", badge: "",
      title: "シンデレラ人気投票、中間結果が波乱の展開",
      lead: "上位常連に新星が割り込み、担当Pの組織票合戦が過熱。最終日に向けて各陣営の動きが活発化している。",
      img: "",
      time: "08:05", source: "ファン集計まとめ", pageNo: "5面",
      tags: ["投票", "まとめ"],
    },
    {
      id: "a04", edition: "morning", brand: "ml", kind: "公式",
      size: "medium", badge: "",
      title: "ミリオン、新ユニット曲の試聴が解禁",
      lead: "イントロだけで「優勝」の声が殺到。発売日に向けて期待値が一気に高まっている。",
      img: "新ユニット曲ジャケット",
      time: "09:10", source: "音楽配信サイト", pageNo: "5面",
      tags: ["新曲", "ユニット"],
    },
    {
      id: "a05", edition: "morning", brand: "sc", kind: "公式",
      size: "medium", badge: "",
      title: "シャイニー、新ストーリー後編が配信開始",
      lead: "重厚な展開に「情緒を破壊された」とタイムラインが崩壊。考察と感想の投稿が深夜まで止まらない。",
      img: "",
      time: "10:00", source: "アプリ内告知", pageNo: "7面",
      tags: ["シナリオ", "イベント"],
    },
    {
      id: "a06", edition: "morning", brand: "gaku", kind: "公式",
      size: "large", badge: "",
      title: "学園アイマス、新アイドル実装で記念ログボ",
      lead: "初日からトレンド上位を独占し、一部ではサーバー混雑の報告も。育成編成の最適解を巡る議論が早くも白熱している。",
      img: "新アイドルの立ち絵",
      time: "11:00", source: "公式・アプリ", pageNo: "9面",
      tags: ["実装", "ゲーム"],
    },
    {
      id: "a07", edition: "morning", brand: "sogo", kind: "ファン",
      size: "small", badge: "",
      title: "【まとめ】「このシーンで泣いた」名場面スレが伸び続ける",
      lead: "深夜に立ったスレッドが一晩で5000レス突破。",
      img: "",
      time: "02:30", source: "掲示板まとめ", pageNo: "11面",
      tags: ["まとめ", "エモ"],
    },
    {
      id: "a08", edition: "morning", brand: "sidem", kind: "公式",
      size: "small", badge: "",
      title: "SideM、生配信で重大告知を予告",
      lead: "「何かが始まる」意味深な投稿にファン身構える。",
      img: "",
      time: "12:00", source: "公式SNS", pageNo: "8面",
      tags: ["生配信", "告知"],
    },
    {
      id: "a09", edition: "morning", brand: "sogo", kind: "ファン",
      size: "small", badge: "",
      title: "受注生産アクスタ、新ラインナップ追加",
      lead: "「全人類分用意してくれ」と注文が殺到中。",
      img: "",
      time: "13:30", source: "通販ページ", pageNo: "13面",
      tags: ["グッズ"],
    },
    {
      id: "a10", edition: "morning", brand: "sogo", kind: "ファン",
      size: "medium", badge: "現地",
      title: "【現地レポ】週末ライブ、二日目も大団円",
      lead: "ラストの煽りに会場総立ち。物販列は朝から長蛇となり、感想ポストが一日中タイムラインを埋め尽くした。",
      img: "ライブ会場の様子（横長）",
      time: "23:40", source: "現地Pレポート", pageNo: "2面",
      tags: ["ライブ", "現地レポ"],
    },

    /* ===== 夕刊 ===== */
    {
      id: "e01", edition: "evening", brand: "sidem", kind: "公式",
      size: "lead", badge: "速報",
      title: "SideM重大告知、ついに正体判明",
      lead: "朝刊で予告された「重大告知」の中身が夕方の生配信で解禁。発表内容にタイムラインは祝祭ムード一色となり、関連ワードが世界トレンド入りした。詳報は次号にて。",
      img: "生配信のキャプチャ（横長）",
      time: "17:00", source: "公式生配信", pageNo: "1面",
      tags: ["速報", "生配信"],
    },
    {
      id: "e02", edition: "evening", brand: "cg", kind: "ファン",
      size: "large", badge: "",
      title: "人気投票、最終日の追い込みで順位入れ替わる",
      lead: "中間から一転、終盤の票読みが各所で飛び交う。締切間際のラストスパートに固唾を呑む担当Pたち。",
      img: "",
      time: "18:20", source: "ファン集計", pageNo: "3面",
      tags: ["投票"],
    },
    {
      id: "e03", edition: "evening", brand: "as765", kind: "ファン",
      size: "medium", badge: "",
      title: "新曲MV、24時間で再生数が大台突破",
      lead: "朝の公開からわずか半日で記録更新。コメント欄は多言語の称賛で埋まっている。",
      img: "",
      time: "19:05", source: "再生数まとめ", pageNo: "5面",
      tags: ["MV", "記録"],
    },
    {
      id: "e04", edition: "evening", brand: "gaku", kind: "ファン",
      size: "medium", badge: "",
      title: "新アイドル編成、早くも最適解の研究が進む",
      lead: "実装初日にして攻略記事が乱立。スコア更新報告が続々と上がっている。",
      img: "",
      time: "20:10", source: "攻略まとめ", pageNo: "6面",
      tags: ["ゲーム", "攻略"],
    },
  ];

  // サイドバー：24時間ランキング（話題のアイドル）。※架空の集計
  const RANKING = [
    { rank: 1, name: "（担当アイドルA）", brand: "gaku", move: "up" },
    { rank: 2, name: "（担当アイドルB）", brand: "sc", move: "up" },
    { rank: 3, name: "（担当アイドルC）", brand: "cg", move: "down" },
    { rank: 4, name: "（担当アイドルD）", brand: "as765", move: "keep" },
    { rank: 5, name: "（担当アイドルE）", brand: "ml", move: "up" },
    { rank: 6, name: "（担当アイドルF）", brand: "sidem", move: "down" },
    { rank: 7, name: "（担当アイドルG）", brand: "cg", move: "keep" },
    { rank: 8, name: "（担当アイドルH）", brand: "sc", move: "up" },
  ];

  // サイドバー：本日のお誕生日
  const BIRTHDAYS = [
    { name: "（アイドル名）", brand: "as765" },
    { name: "（アイドル名）", brand: "ml" },
    { name: "（アイドル名）", brand: "cg" },
  ];

  // サイドバー：本日のPイラスト ピックアップ
  const ARTPICKS = [
    { caption: "ファンアート①（縦長）", by: "@illust_p" },
    { caption: "ファンアート②（正方）", by: "@illust_q" },
    { caption: "ファンアート③（横長）", by: "@illust_r" },
  ];

  // 社説（縦組みコラム）
  const EDITORIAL = {
    head: "社説",
    title: "なぜ我々は\n毎日担当に\n時間を溶かすのか",
    body: "本紙は全自動こたつ編集部の手による。記者は一歩も外へ出ず、こたつから一次・二次情報をかき集めるのみだ。ゆえに誤報も憶測もある。校閲もしていない。それでも毎朝、刷り上がった紙面に担当の名を探してしまう——その衝動こそが、この界隈を二十余年動かし続けてきた原動力なのだと、編集部は信じている。",
  };

  window.KOTATSU = { BRANDS, MASTHEAD, EDITIONS, ARTICLES, RANKING, BIRTHDAYS, ARTPICKS, EDITORIAL };
})();
