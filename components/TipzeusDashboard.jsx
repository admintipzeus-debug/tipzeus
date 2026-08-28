"use client";

import { useEffect, useState } from "react";

const FONT_HEAD = "'Baloo 2', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const COLORS = {
  bg: "#FFFCF5",
  card: "#FFFFFF",
  ink: "#2E2416",
  muted: "#8A7A64",
  line: "#F1E7D4",
  coral: "#FF4E3A",
  coralSoft: "#FFE2DC",
  teal: "#00BFA6",
  tealSoft: "#D8F7F1",
  sun: "#FFC233",
  sunSoft: "#FFF2CF",
  sky: "#2DA9FF",
  skySoft: "#DCF0FF",
};

function FootballScene() {
  return (
    <div
      style={{
        margin: "16px 20px 4px",
        borderRadius: 20,
        overflow: "hidden",
        height: 150,
        position: "relative",
        boxShadow: "0 8px 20px -8px rgba(46,36,22,0.25)",
      }}
    >
      <svg viewBox="0 0 400 172" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id="skyF" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4FD0E9" />
            <stop offset="1" stopColor="#3FC1E0" />
          </linearGradient>
        </defs>
        <rect width="400" height="172" fill="url(#skyF)" />
        <circle cx="345" cy="30" r="24" fill="#FFDD55" />
        <circle cx="345" cy="30" r="32" fill="#FFDD55" opacity="0.35" />
        <ellipse cx="60" cy="26" rx="26" ry="12" fill="#ffffff" opacity="0.85" />
        <ellipse cx="90" cy="20" rx="18" ry="9" fill="#ffffff" opacity="0.85" />
        <rect x="0" y="58" width="400" height="18" fill="#2B2456" />
        <rect x="0" y="76" width="400" height="96" fill="#3CB24B" />
        <rect x="0" y="76" width="400" height="16" fill="#37A644" />
        <rect x="0" y="108" width="400" height="16" fill="#37A644" />
        <rect x="0" y="140" width="400" height="16" fill="#37A644" />
        <circle cx="230" cy="130" r="26" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
        <rect x="-20" y="105" width="60" height="50" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
        <circle cx="205" cy="150" r="8" fill="#ffffff" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 14,
          bottom: 12,
          color: "#fff",
          fontFamily: FONT_HEAD,
          fontWeight: 800,
          fontSize: 15,
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        Kickoff under the lights ⚽
      </div>
    </div>
  );
}

function Crest({ label }) {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        background: COLORS.bg,
        border: `1px solid ${COLORS.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_HEAD,
        fontWeight: 800,
        fontSize: 14,
        color: COLORS.ink,
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
}

function ThumbIcon({ filled }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ transition: "transform .15s", transform: filled ? "translateY(-1px) scale(1.05)" : "none" }}
    >
      <path d="M7 11v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3zm0 0 4.5-9a2 2 0 0 1 2.2.5 2.2 2.2 0 0 1 .5 1.9L13 9h5.5a2 2 0 0 1 2 2.3l-1.3 8A2 2 0 0 1 17.2 21H10a3 3 0 0 1-3-3" />
    </svg>
  );
}

const LIKED_STORAGE_KEY = "tipzeus_liked_tip_ids";

function getLikedIds() {
  try {
    return JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLikedIds(ids) {
  try {
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage failures (private browsing, disabled storage, etc.)
  }
}

function TipCard({ tip }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(tip.likes);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setLiked(getLikedIds().includes(tip.id));
  }, [tip.id]);

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));

    const ids = getLikedIds();
    saveLikedIds(newLiked ? [...new Set([...ids, tip.id])] : ids.filter((id) => id !== tip.id));

    fetch(`/api/tips/${tip.id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liked: newLiked }),
    }).catch(() => {});
  };

  const confBg = tip.confidence === "high" ? COLORS.tealSoft : COLORS.sunSoft;
  const confColor = tip.confidence === "high" ? "#00806E" : "#B8790F";
  const confLabel = tip.confidence === "high" ? "High confidence" : "Medium confidence";

  return (
    <div
      style={{
        margin: "0 20px 12px",
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 18,
        padding: 16,
        fontFamily: FONT_BODY,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10.5,
            color: COLORS.muted,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {tip.league}
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.muted, display: "inline-block" }} />
          {tip.kickoff}
        </span>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <span
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 10.5,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 8,
              background: confBg,
              color: confColor,
              whiteSpace: "nowrap",
            }}
          >
            {confLabel}
          </span>
          <span
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 10.5,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 8,
              background: COLORS.ink,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {tip.units}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <Crest label={tip.homeShort} />
        </div>
        <div>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15.5, lineHeight: 1.25, color: COLORS.ink }}>
            {tip.home} vs {tip.away}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 1 }}>{tip.venue}</div>
        </div>
      </div>

      {tip.imageUrl && !imageFailed && (
        <div
          style={{
            marginBottom: 12,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid ${COLORS.line}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tip.imageUrl}
            alt={`${tip.home} vs ${tip.away}`}
            onError={() => setImageFailed(true)}
            style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: COLORS.bg,
          borderRadius: 12,
          padding: "11px 13px",
          marginBottom: 10,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: COLORS.muted,
              fontFamily: FONT_MONO,
              display: "block",
              marginBottom: 3,
            }}
          >
            Panel call
          </span>
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: COLORS.ink }}>{tip.pick}</span>
        </div>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontWeight: 600,
            fontSize: 13,
            background: COLORS.coral,
            color: "#fff",
            padding: "6px 11px",
            borderRadius: 9,
          }}
        >
          {tip.odds}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          background: COLORS.skySoft,
          borderRadius: 12,
          padding: "10px 12px",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1.3, flexShrink: 0 }}>💡</span>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.48, color: "#2E5A78" }}>
          <b style={{ color: "#1B3D52", fontFamily: FONT_HEAD, fontWeight: 700 }}>Why: </b>
          {tip.why}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 2 }}>
        <span style={{ fontSize: 12.5, color: COLORS.muted }}>
          <b style={{ color: COLORS.ink, fontWeight: 600 }}>{likes}</b> people like this tip
        </span>
        <div
          onClick={toggleLike}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: liked ? COLORS.coralSoft : COLORS.card,
            border: `1px solid ${liked ? COLORS.coral : COLORS.line}`,
            borderRadius: 20,
            padding: "7px 13px 7px 11px",
            cursor: "pointer",
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 12.5,
            color: liked ? COLORS.coral : COLORS.muted,
            userSelect: "none",
          }}
        >
          <ThumbIcon filled={liked} />
          <span>{liked ? "Liked" : "Like"}</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${hours}:${minutes}${ampm}`;
}

export default function TipzeusDashboard() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    fetch("/api/tips")
      .then((res) => res.json())
      .then((data) => {
        const published = data.filter((tip) => tip.published);
        setTips(published);
        const latest = published.reduce(
          (max, tip) => (!max || new Date(tip.updatedAt) > max ? new Date(tip.updatedAt) : max),
          null
        );
        setUpdatedAt(latest);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        maxWidth: 460,
        margin: "0 auto",
        minHeight: "100vh",
        background: COLORS.bg,
        paddingBottom: 40,
        color: COLORS.ink,
        fontFamily: FONT_BODY,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              background: COLORS.coral,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            ⚽
          </div>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em" }}>Tipzeus</div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: COLORS.sunSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B8790F",
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 13,
            border: "2px solid #fff",
            boxShadow: `0 0 0 2px ${COLORS.sunSoft}`,
          }}
        >
          JD
        </div>
      </div>

      <div style={{ padding: "2px 20px 16px" }}>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 24, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
          Today's tips
        </h1>
        <p style={{ margin: 0, color: COLORS.muted, fontSize: 13.5 }}>
          Premier League{updatedAt ? ` — updated ${formatTime(updatedAt)}` : ""}
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "12px 20px 4px" }}>
        <div style={{ flex: 1, background: COLORS.coral, borderRadius: 16, padding: "12px 14px" }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20, color: "#fff" }}>{tips.length}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.82)", marginTop: 2 }}>Tips today</div>
        </div>
        <div style={{ flex: 1, background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "12px 14px" }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20 }}>68%</div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>7-day hit rate</div>
        </div>
      </div>

      <FootballScene />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
        <h2 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 700, margin: 0 }}>Today's fixtures</h2>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: COLORS.muted,
            background: COLORS.line,
            padding: "3px 8px",
            borderRadius: 6,
          }}
        >
          {tips.length} tips
        </span>
      </div>

      {loading && (
        <div style={{ margin: "0 20px", textAlign: "center", color: COLORS.muted, fontSize: 13, padding: "40px 0" }}>
          Loading tips…
        </div>
      )}

      {!loading && tips.length === 0 && (
        <div style={{ margin: "0 20px", textAlign: "center", color: COLORS.muted, fontSize: 13, padding: "40px 0" }}>
          No tips published yet — check back soon.
        </div>
      )}

      {tips.map((tip) => (
        <TipCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
}
