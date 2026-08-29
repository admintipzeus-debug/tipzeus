import { neon } from "@neondatabase/serverless";

let cachedSql;

function getSql() {
  if (!cachedSql) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    cachedSql = neon(connectionString);
  }
  return cachedSql;
}

const SEED_TIPS = [
  {
    league: "Premier League",
    kickoff: "15:00",
    confidence: "high",
    units: "4u",
    home: "Redcliffe",
    away: "Aldermoor",
    homeShort: "RC",
    awayShort: "AL",
    venue: "Redcliffe Park",
    pick: "Redcliffe -1.5",
    odds: "11/10",
    why: "Redcliffe have won five straight at home while Aldermoor are without their starting centre-back pair.",
    likes: 128,
    published: true,
  },
  {
    league: "Premier League",
    kickoff: "17:30",
    confidence: "med",
    units: "3u",
    home: "Northgate",
    away: "Fenwick",
    homeShort: "NG",
    awayShort: "FW",
    venue: "The Foundry",
    pick: "Both teams to score",
    odds: "4/6",
    why: "Both sides have leaked goals from set pieces this season and rank in the bottom third defensively.",
    likes: 94,
    published: true,
  },
  {
    league: "Premier League",
    kickoff: "20:00",
    confidence: "med",
    units: "2u",
    home: "Ashworth",
    away: "Kelbrook",
    homeShort: "AW",
    awayShort: "KB",
    venue: "Ashworth derby",
    pick: "Under 2.5 goals",
    odds: "5/6",
    why: "Evenly matched form lines and a history of cagey, low-tempo derbies between these two sides.",
    likes: 41,
    published: false,
  },
];

let schemaReady;

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS tips (
          id BIGSERIAL PRIMARY KEY,
          league TEXT NOT NULL DEFAULT 'Premier League',
          kickoff TEXT NOT NULL DEFAULT '15:00',
          confidence TEXT NOT NULL DEFAULT 'high',
          units TEXT NOT NULL DEFAULT '3u',
          home TEXT NOT NULL,
          away TEXT NOT NULL,
          home_short TEXT NOT NULL DEFAULT '',
          away_short TEXT NOT NULL DEFAULT '',
          venue TEXT NOT NULL DEFAULT '',
          pick TEXT NOT NULL,
          odds TEXT NOT NULL,
          why TEXT NOT NULL DEFAULT '',
          likes INTEGER NOT NULL DEFAULT 0,
          published BOOLEAN NOT NULL DEFAULT true,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          image_url TEXT NOT NULL DEFAULT ''
        )
      `;
      await sql`ALTER TABLE tips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`;
      await sql`ALTER TABLE tips ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT ''`;

      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          hit_rate TEXT NOT NULL DEFAULT '68%'
        )
      `;
      const settingsCount = await sql`SELECT COUNT(*)::int AS count FROM settings WHERE id = 1`;
      if (settingsCount[0].count === 0) {
        await sql`INSERT INTO settings (id, hit_rate) VALUES (1, '68%')`;
      }

      const countRows = await sql`SELECT COUNT(*)::int AS count FROM tips`;
      if (countRows[0].count === 0) {
        for (const tip of SEED_TIPS) {
          await sql`
            INSERT INTO tips
              (league, kickoff, confidence, units, home, away, home_short, away_short, venue, pick, odds, why, likes, published)
            VALUES
              (${tip.league}, ${tip.kickoff}, ${tip.confidence}, ${tip.units}, ${tip.home}, ${tip.away},
               ${tip.homeShort}, ${tip.awayShort}, ${tip.venue}, ${tip.pick}, ${tip.odds}, ${tip.why},
               ${tip.likes}, ${tip.published})
          `;
        }
      }
    })();
  }
  return schemaReady;
}

function rowToTip(row) {
  return {
    id: row.id,
    league: row.league,
    kickoff: row.kickoff,
    confidence: row.confidence,
    units: row.units,
    home: row.home,
    away: row.away,
    homeShort: row.home_short,
    awayShort: row.away_short,
    venue: row.venue,
    pick: row.pick,
    odds: row.odds,
    why: row.why,
    likes: row.likes,
    published: row.published,
    updatedAt: row.updated_at,
    imageUrl: row.image_url,
  };
}

export async function listTips() {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT * FROM tips ORDER BY id ASC`;
  return rows.map(rowToTip);
}

export async function createTip(fields) {
  await ensureSchema();
  const tip = {
    league: "Premier League",
    kickoff: "15:00",
    confidence: "high",
    units: "3u",
    homeShort: "",
    awayShort: "",
    venue: "",
    why: "",
    likes: 0,
    imageUrl: "",
    ...fields,
  };

  const sql = getSql();
  const rows = await sql`
    INSERT INTO tips
      (league, kickoff, confidence, units, home, away, home_short, away_short, venue, pick, odds, why, likes, published, image_url)
    VALUES
      (${tip.league}, ${tip.kickoff}, ${tip.confidence}, ${tip.units}, ${tip.home}, ${tip.away},
       ${tip.homeShort}, ${tip.awayShort}, ${tip.venue}, ${tip.pick}, ${tip.odds}, ${tip.why},
       ${tip.likes}, true, ${tip.imageUrl})
    RETURNING *
  `;
  return rowToTip(rows[0]);
}

export async function updateTip(id, fields) {
  await ensureSchema();
  const sql = getSql();
  const existingRows = await sql`SELECT * FROM tips WHERE id = ${id}`;
  if (existingRows.length === 0) return null;

  const current = rowToTip(existingRows[0]);
  const tip = { ...current, ...fields };

  const rows = await sql`
    UPDATE tips SET
      league = ${tip.league},
      kickoff = ${tip.kickoff},
      confidence = ${tip.confidence},
      units = ${tip.units},
      home = ${tip.home},
      away = ${tip.away},
      home_short = ${tip.homeShort},
      away_short = ${tip.awayShort},
      venue = ${tip.venue},
      pick = ${tip.pick},
      odds = ${tip.odds},
      why = ${tip.why},
      likes = ${tip.likes},
      published = ${tip.published},
      image_url = ${tip.imageUrl},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return rowToTip(rows[0]);
}

export async function deleteTip(id) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`DELETE FROM tips WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getSettings() {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT hit_rate FROM settings WHERE id = 1`;
  return { hitRate: rows[0]?.hit_rate ?? "68%" };
}

export async function updateSettings(fields) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    UPDATE settings SET hit_rate = ${fields.hitRate}
    WHERE id = 1
    RETURNING hit_rate
  `;
  return { hitRate: rows[0].hit_rate };
}

export async function incrementLikes(id, delta) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    UPDATE tips SET likes = GREATEST(0, likes + ${delta})
    WHERE id = ${id}
    RETURNING *
  `;
  return rows.length > 0 ? rowToTip(rows[0]) : null;
}
