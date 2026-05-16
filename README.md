# HUKANZEN

ミニマルなポモドーロタイマー × ソーシャル機能。

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=black)

---

## 機能

- **ポモドーロタイマー** — ポモドーロ / 短い休憩 / 長い休憩。数字がスクロールするアニメーション付き
- **オーバータイムモード** — 時間が来ても止めずにカウントアップ継続。集中を途切れさせない
- **ゴール管理** — 色付きゴールを作成してセッションにタグ付け。プロフィールでゴール別の時間内訳を確認
- **セッション記録** — 開始・一時停止・再開・終了理由をリアルタイムでSupabaseに記録
- **週間ランキング** — その週の総集中時間でユーザーをランキング表示
- **プロフィール** — 総時間・セッション数・ストリークを表示する公開プロフィールページ
- **ストリーク** — 毎日継続すると炎アイコンで記録
- **レポート** — 日別の集中セッションを棒グラフで表示
- **設定カスタマイズ** — ポモドーロ・休憩の時間を変更可能
- **ゲストモード** — ログインなしでもタイマーのみ使用可能

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| アニメーション | Motion (Framer Motion) |
| アイコン | Lucide React |
| バックエンド / 認証 | Supabase (Auth + PostgreSQL + RLS) |
| 言語 | TypeScript 5 |

---

## セットアップ

```bash
git clone https://github.com/yamakai7649/HUKANZEN_APP.git
cd HUKANZEN_APP
cp .env.example .env.local
```

`.env.local` に値を入力：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

---

## Supabase セットアップ

以下のテーブルと関数が必要です。

**テーブル**
- `profiles` — ユーザー名・ストリーク・最終アクティブ日・自己紹介
- `goals` — 色付きゴール
- `sessions` — セッション記録（モード・時間・終了理由・ゴールID）

**RPC関数**
- `get_weekly_ranking()` — 週間ランキングデータを返す
- `get_user_stats(p_user_id)` — 総時間・完了セッション数・ストリークを返す

全テーブルにRLS（Row Level Security）を有効化。
