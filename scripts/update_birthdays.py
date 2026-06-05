#!/usr/bin/env python3
"""
imas-db.jp の誕生日ICSカレンダーを取得して birthdays.yml を更新するスクリプト。

使い方:
  python3 scripts/update_birthdays.py [--date YYYY-MM-DD]

--date を省略すると JST の今日の日付を使用。
"""

import argparse
import re
import sys
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

JST = timezone(timedelta(hours=9))

# imas-db.jp の誕生日ICSエンドポイントとブランドキーの対応
ICS_SOURCES = [
    ("https://imas-db.jp/calendar/birthday/cinderella.ics", "cg"),
    ("https://imas-db.jp/calendar/birthday/765million.ics", "ml"),
    ("https://imas-db.jp/calendar/birthday/sidem.ics",      "sidem"),
    ("https://imas-db.jp/calendar/birthday/shinycolors.ics","sc"),
    ("https://imas-db.jp/calendar/birthday/gakuen.ics",     "gaku"),
    ("https://imas-db.jp/calendar/birthday.ics",            "sogo"),  # 共通（765含む）
]

# 共通ICSで他シリーズとブランドが重複する場合の上書き対応表
BRAND_OVERRIDES = {
    # "キャラ名": "brand_key"
}


def fetch_ics(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "imas-birthday-bot/1.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        return res.read().decode("utf-8", errors="replace")


def parse_birthdays(ics_text: str, mmdd: str) -> list[str]:
    """DTSTART が指定 mmdd の VEVENT から SUMMARY を抽出する。"""
    names = []
    in_event = False
    current_summary = None
    current_dtstart = None

    for line in ics_text.splitlines():
        line = line.strip()
        if line == "BEGIN:VEVENT":
            in_event = True
            current_summary = None
            current_dtstart = None
        elif line == "END:VEVENT":
            if in_event and current_dtstart and current_summary:
                # DTSTART;VALUE=DATE:20260605 または DTSTART:20260605 の両方に対応
                m = re.search(r"(\d{8})", current_dtstart)
                if m and m.group(1)[4:8] == mmdd:
                    names.append(current_summary)
            in_event = False
        elif in_event:
            if line.startswith("SUMMARY"):
                current_summary = line.split(":", 1)[-1].strip()
            elif line.startswith("DTSTART"):
                current_dtstart = line

    return names


def clean_name(raw: str) -> str:
    """ICSのSUMMARY文字列からアイドル名だけを取り出す。"""
    # 「〇〇の誕生日」→「〇〇」
    name = re.sub(r"の誕生日$", "", raw).strip()
    # 「〇〇Birthday」「〇〇 Birthday」も念のため除去
    name = re.sub(r"\s*Birthday$", "", name, flags=re.IGNORECASE).strip()
    return name


def brand_from_name(name: str, default: str) -> str:
    """765プロ系のキャスト誕生日エントリを sogo/as765 に振り分ける補助。"""
    # CV名（役名）パターンは除外
    if re.search(r"役\)|役）", name):
        return None  # キャスト誕生日は除外
    return BRAND_OVERRIDES.get(name, default)


def generate_yaml(birthdays: list[tuple[str, str]], date_str: str) -> str:
    lines = [f"# 本日のお誕生日（毎日更新）— {date_str}"]
    if not birthdays:
        lines.append("# imas-db.jp 全シリーズICSを確認した結果、本日登録のアイドル誕生日なし")
        return "\n".join(lines) + "\n"
    for name, brand in birthdays:
        lines.append(f'- name: "{name}"')
        lines.append(f"  brand: {brand}")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="対象日 YYYY-MM-DD（省略時は JST 今日）")
    parser.add_argument(
        "--output",
        default=str(Path(__file__).parent.parent / "docs/_data/birthdays.yml"),
        help="出力先 YAMLファイルパス",
    )
    args = parser.parse_args()

    if args.date:
        target = datetime.strptime(args.date, "%Y-%m-%d").date()
    else:
        target = datetime.now(JST).date()

    mmdd = target.strftime("%m%d")
    date_str = target.strftime("%Y年%-m月%-d日")
    print(f"対象日: {target}（mmdd={mmdd}）", file=sys.stderr)

    seen = set()
    birthdays: list[tuple[str, str]] = []

    for url, brand_key in ICS_SOURCES:
        try:
            print(f"取得中: {url}", file=sys.stderr)
            ics = fetch_ics(url)
            names = parse_birthdays(ics, mmdd)
            for raw_name in names:
                resolved_brand = brand_from_name(raw_name, brand_key)
                if resolved_brand is None:
                    continue  # キャスト誕生日はスキップ
                name = clean_name(raw_name)
                if name not in seen:
                    seen.add(name)
                    birthdays.append((name, resolved_brand))
        except Exception as e:
            print(f"警告: {url} の取得に失敗しました: {e}", file=sys.stderr)

    yaml_content = generate_yaml(birthdays, date_str)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(yaml_content, encoding="utf-8")
    print(f"書き込み完了: {output_path}", file=sys.stderr)
    if birthdays:
        print(f"誕生日アイドル {len(birthdays)} 名:", file=sys.stderr)
        for name, brand in birthdays:
            print(f"  {name} ({brand})", file=sys.stderr)
    else:
        print("本日の誕生日アイドル: なし", file=sys.stderr)


if __name__ == "__main__":
    main()
