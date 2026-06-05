# こたつアイマス速報  — GitHub Pages（Jekyll）版

「全自動こたつ編集部がお届けする、未校閲・とって出しのアイマス日刊紙」を、
**GitHub Pages で配信可能な範囲（＝Jekyll でビルドできる範囲）**に制限して構成したものです。

> ⚠️ サイト名・記事・ランキング等はすべて**架空のサンプル**です。ロゴ等は再現せず、独自の世界観で作っています。

---

## このフォルダの中身

| フォルダ | 役割 |
|---|---|
| `site-built/` | **ビルド後の静的サイト**（Jekyll が吐く成果物の見本）。そのままブラウザで開ける／GitHub Pages にそのまま置いても動く。**プレビューで見るのはこちら**。 |
| `jekyll-source/` | **Jekyll のソース一式**。これを GitHub に push すると、GitHub Pages が `site-built/` 相当を自動ビルドして配信する。 |

`こたつアイマス速報.html`（React版）は、制限前のフル機能プロトタイプです。

---

## デプロイ手順（jekyll-source/ を配信する）

1. `jekyll-source/` の中身をリポジトリの**ルート**に置いて push
   （例：`git init` → 中身をコピー → `git push`）。
2. GitHub の **Settings → Pages** で、Source を `Deploy from a branch` にし、
   ブランチ（例：`main` / `/root`）を選ぶ。
3. 数十秒〜数分でビルドされ、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開。

### プロジェクトページに置く場合（重要）

`USER.github.io/REPO/` のようにサブパス配信する場合は、`_config.yml` の
`baseurl` を**リポジトリ名**に設定してください（コメントアウトを外す）。
全リンクは `relative_url` フィルタを通しているので、これだけでパスが揃います。

```yaml
baseurl: "/kotatsu-imas-sokuho"
```

### ローカルで確認

```bash
cd jekyll-source
bundle install
bundle exec jekyll serve
# → http://localhost:4000/
```

---

## 「毎日1刷」の運用（編集部の作業）

新聞メタファーはそのまま **Jekyll のコンテンツモデル**に対応します。

- **記事を1本足す** → `_posts/2026-06-04-xxxx.md` を作る（front matter に `brand` `kind` `edition` `lead` 等）。
- **その日の号（1刷）** → 同じ日付の投稿がまとまって `index`（朝刊）/ `evening`（夕刊）に並ぶ。
- **トップ記事** → front matter に `featured: true`。
- **ランキング・誕生日・Pイラスト** → `_data/*.yml` を書き換えるだけ（DB不要）。
- **過去の号** → `_data/archive.yml` に号を追加すると `/archive/` に並ぶ。

### 記事の front matter テンプレート

```yaml
---
title: "見出しをここに"
slug: a11            # パーマリンク /articles/a11/ になる
edition: morning     # morning（朝刊）/ evening（夕刊）
brand: cg            # sogo / as765 / cg / ml / sc / sidem / gaku
kind: 公式            # 公式 / ファン
badge: "速報"         # 任意（速報・現地 等）。無ければ削除
lead: "リード文（一覧と検索とSNS説明に使う）"
img: "写真プレースホルダの説明"   # 任意。無ければ削除
time: "07:20"
source: "情報源"
pageno: "5面"
size: medium         # lead / large / medium / small（見出しの大きさ）
order: 11            # 紙面内の並び順
tags: [新曲, MV]
# featured: true     # トップ記事のときだけ
---

本文（Markdown）。1段落目がリード、2段落目以降が続報。
```

---

## React版 → Jekyll版 対応表（何が変わるか）

| React版の機能 | Jekyll版での実現 | 制約による変化 |
|---|---|---|
| 1記事 | `_posts/*.md`（front matter＋本文Markdown） | — |
| 1日1刷（号） | 日付で投稿をグルーピング | 新聞メタファーと好相性 |
| 朝刊／夕刊トグル | `edition` で `/`（朝刊）と `/evening/` の**別ページ**に | 即時トグル → ページ遷移 |
| 記事リーダー（モーダル） | 各記事＝**独立パーマリンクのページ** `/articles/<slug>/` | モーダル → ページ遷移 |
| 面（ブランド）絞り込み | 事前生成の**面ページ** `/brand/<key>/`＋トップではJSで即時フィルタ | 動的 → 事前生成（JSは任意の上乗せ） |
| 検索 | ビルド時に `search.json` を生成 → **クライアントJS**で検索 | サーバ検索 → 生成インデックス＋JS |
| ランキング／誕生日／Pイラスト | `_data/*.yml` | DB → YAML手動更新 |
| バックナンバー棚 | `/archive/`（`_data/archive.yml`） | — |
| RSS／SEO／サイトマップ | `jekyll-feed` / `jekyll-seo-tag` / `jekyll-sitemap` | プラグインは**GH Pages許可リスト内**のみ |

**JavaScript はそのまま使えます**（GitHub Pages は静的ファイルを配信するだけなので、
クライアントJSの面フィルター・検索は問題なく動作します）。サーバ側の動的処理だけが使えません。

---

## ディレクトリ構成（jekyll-source/）

```
jekyll-source/
├── _config.yml          # サイト設定・プラグイン・パーマリンク
├── Gemfile              # github-pages gem
├── _data/               # 編集部が毎日更新する素材（YAML）
│   ├── brands.yml       # 面（ブランド）と分類色
│   ├── editions.yml     # 朝刊・夕刊の号情報
│   ├── ranking.yml  birthdays.yml  artpicks.yml  editorial.yml
│   ├── backissues.yml   archive.yml
├── _includes/           # 部品（題字・ナビ・記事カード・サイドバー…）
├── _layouts/            # default / front / post / brand
├── _posts/              # 記事（1記事＝1ファイル）
├── index.html           # 朝刊トップ（/）
├── evening.html         # 夕刊トップ（/evening/）
├── archive.html         # バックナンバー（/archive/）
├── brand/*.html         # 面ページ（/brand/<key>/）
├── search.json          # 検索インデックス（Liquidで生成）
└── assets/{css,js}/     # スタイルとクライアントJS
```
