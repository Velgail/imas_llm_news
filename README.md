# こたつアイマス速報 — GitHub Pages（Jekyll）版

「全自動こたつ編集部がお届けする、未校閲・とって出しのアイマス日刊紙」を、
**GitHub Pages で配信可能な範囲（＝Jekyll でビルドできる範囲）**に制限して構成したものです。

> ⚠️ サイト名・記事・ランキング等はすべて**架空のサンプル**です。ロゴ等は再現せず、独自の世界観で作っています。

---

## リポジトリ構成

| フォルダ | 役割 |
|---|---|
| `docs/` | **Jekyll ソース一式**。GitHub Pages でそのまま配信できる。 |
| `scripts/` | 誕生日データ自動取得スクリプト等。 |

---

## デプロイ手順

1. GitHub の **Settings → Pages** で、Source を `Deploy from a branch` → ブランチ `main`、フォルダ `/docs` を選ぶ。
2. 数十秒〜数分でビルドされ、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開。

### プロジェクトページに置く場合

`USER.github.io/REPO/` のようにサブパス配信する場合は `docs/_config.yml` の `baseurl` を設定する。

```yaml
baseurl: "/imas_llm_news"
url: "https://your-username.github.io"
```

### ローカルで確認

```bash
cd docs
bundle install
bundle exec jekyll serve
# → http://localhost:4000/
```

---

## 毎日の運用（編集部の作業）

### 記事を追加する

`docs/_posts/YYYY/MM/YYYY-MM-DD-<slug>.md` を作成する。

**ファイル名の命名規則**: `YYYY-MM-DD-BRAND-EVENT[-YYYYMMDD].md`

```
docs/_posts/2026/06/2026-06-05-cg-sousenkyo-20260605.md
```

### 記事の front matter テンプレート

```yaml
---
title: "見出しをここに"
slug: cg-sousenkyo-20260605   # パーマリンク /articles/<slug>/ になる
brand: cg         # sogo / as765 / cg / ml / sc / sidem / gaku / valiv / godo / other
kind: 公式         # 公式 / ファン
badge: "速報"      # 任意（速報・現地 等）。無ければ削除
lead: "リード文（一覧と検索とSNS説明に使う）"
img: "写真プレースホルダの説明"   # 任意。無ければ削除
time: "07:20"
source: "情報源"
pageno: "5面"
size: medium      # lead / large / medium / small（見出しの大きさ）
order: 5          # 紙面内の並び順（小さいほど上）
tags: [新曲, MV]
# featured: true  # トップ記事のときだけ
---

本文（Markdown）。1段落目がリード、2段落目以降が続報。
```

> `edition` フィールドは廃止。書かなくてよい。

### ブランド（brand）選択基準

| brand | 用途 |
|-------|------|
| `sogo` | アイマス全体に等しく関わるニュース・業界動向 |
| `godo` | 2ブランド以上が明示的にコラボ・合同参加するライブ・イベント |
| `other` | グッズ横断、メディア露出など1ブランドに分類しにくいもの |
| その他 | 各ブランド専属の話題 |

### その他の日次データを更新する

| ファイル | 内容 | 更新方法 |
|---|---|---|
| `docs/_data/editions.yml` | 号のメタ情報（日付・面数・アイマス指数） | 手動編集 |
| `docs/_data/ranking.yml` | 24時間話題のアイドル8件 | 手動編集 |
| `docs/_data/editorial.yml` | 社説タイトル・本文 | 手動編集 |
| `docs/_data/birthdays.yml` | 本日の誕生日アイドル | `python3 scripts/update_birthdays.py` で自動更新 |

### 号数について

号数は `docs/_config.yml` の `founding_date` と `masthead.html` が自動計算する（JST 基準）。
手動での管理は不要。

---

## ディレクトリ構成

```
docs/
├── _config.yml          # サイト設定・プラグイン・パーマリンク・創刊日
├── Gemfile
├── _data/               # 編集部が毎日更新する素材（YAML）
│   ├── brands.yml       # 面（ブランド）定義（10ブランド）
│   ├── editions.yml     # 号のメタ情報（1刊のみ）
│   ├── ranking.yml
│   ├── birthdays.yml    # update_birthdays.py が自動更新
│   ├── artpicks.yml
│   ├── editorial.yml
│   └── archive.yml      # 現在未使用（/archive/ は site.posts から自動生成）
├── _includes/           # 部品（題字・ナビ・記事カード・サイドバー…）
├── _layouts/            # default / front / post / brand
├── _posts/              # 記事（年月サブディレクトリ構成）
│   └── 2026/06/         # 例: 2026年6月の記事
├── index.html           # トップページ（最新日付の記事を自動表示）
├── archive.html         # バックナンバー（site.posts から自動生成）
├── brand/*.html         # 面ページ（/brand/<key>/）
├── search.json          # 検索インデックス（Liquidで生成）
└── assets/{css,js}/     # スタイルとクライアントJS
```

---

## 機能一覧

| 機能 | 実現方法 |
|---|---|
| 1記事 | `_posts/YYYY/MM/*.md`（front matter＋本文Markdown） |
| 1日1刷（号） | 最新日付の投稿をトップに自動表示 |
| 号数自動採番 | `founding_date` からJST経過日数で計算 |
| 記事リーダー | 各記事＝独立パーマリンクページ `/articles/<slug>/` |
| 面（ブランド）絞り込み | JSで即時フィルタ＋面ページ `/brand/<key>/` |
| バックナンバー | `/archive/`（`site.posts` から自動生成） |
| 検索 | ビルド時に `search.json` を生成 → クライアントJSで検索 |
| ランキング／誕生日 | `_data/*.yml` |
| RSS／SEO／サイトマップ | `jekyll-feed` / `jekyll-seo-tag` / `jekyll-sitemap` |
