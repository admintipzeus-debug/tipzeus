import { neon } from "@neondatabase/serverless";

let cachedSql;

function getSql() {
  if (!cachedSql) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    // Next.js patches the global fetch() used internally by the neon driver and
    // will cache identical-looking requests (e.g. our repeated, parameter-free
    // settings queries) unless explicitly told not to.
    cachedSql = neon(connectionString, { fetchOptions: { cache: "no-store" } });
  }
  return cachedSql;
}

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
      await sql`ALTER TABLE tips ADD COLUMN IF NOT EXISTS sort_order INTEGER`;
      await sql`UPDATE tips SET sort_order = id WHERE sort_order IS NULL`;

      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          hit_rate TEXT NOT NULL DEFAULT '68%'
        )
      `;
      await sql`INSERT INTO settings (id, hit_rate) VALUES (1, '68%') ON CONFLICT (id) DO NOTHING`;
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
  const rows = await sql`SELECT * FROM tips ORDER BY sort_order ASC, id ASC`;
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
      (league, kickoff, confidence, units, home, away, home_short, away_short, venue, pick, odds, why, likes, published, image_url, sort_order)
    VALUES
      (${tip.league}, ${tip.kickoff}, ${tip.confidence}, ${tip.units}, ${tip.home}, ${tip.away},
       ${tip.homeShort}, ${tip.awayShort}, ${tip.venue}, ${tip.pick}, ${tip.odds}, ${tip.why},
       ${tip.likes}, true, ${tip.imageUrl}, COALESCE((SELECT MAX(sort_order) FROM tips), 0) + 1)
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

export async function moveTip(id, direction) {
  await ensureSchema();
  const sql = getSql();

  const currentRows = await sql`SELECT id, sort_order FROM tips WHERE id = ${id}`;
  if (currentRows.length === 0) return null;
  const current = currentRows[0];

  const neighborRows =
    direction === "up"
      ? await sql`SELECT id, sort_order FROM tips WHERE sort_order < ${current.sort_order} ORDER BY sort_order DESC LIMIT 1`
      : await sql`SELECT id, sort_order FROM tips WHERE sort_order > ${current.sort_order} ORDER BY sort_order ASC LIMIT 1`;

  if (neighborRows.length > 0) {
    const neighbor = neighborRows[0];
    await sql`UPDATE tips SET sort_order = ${neighbor.sort_order} WHERE id = ${current.id}`;
    await sql`UPDATE tips SET sort_order = ${current.sort_order} WHERE id = ${neighbor.id}`;
  }

  return listTips();
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
