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
  danger: "#D9432E",
};

const EMPTY_TIP = {
  league: "Premier League",
  kickoff: "15:00",
  confidence: "high",
  units: "3u",
  home: "",
  away: "",
  homeShort: "",
  awayShort: "",
  venue: "",
  pick: "",
  odds: "",
  why: "",
  imageUrl: "",
  likes: 0,
};

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span
        style={{
          display: "block",
          fontFamily: FONT_MONO,
          fontSize: 10.5,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: COLORS.muted,
          marginBottom: 5,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${COLORS.line}`,
  borderRadius: 10,
  padding: "9px 11px",
  fontFamily: FONT_BODY,
  fontSize: 13.5,
  color: COLORS.ink,
  background: COLORS.bg,
  boxSizing: "border-box",
};

function SettingsPanel({ hitRate, onSave }) {
  const [value, setValue] = useState(hitRate);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(hitRate);
  }, [hitRate]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await onSave(value);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div
      style={{
        margin: "0 20px 16px",
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 16,
        padding: 14,
      }}
    >
      <Field label="7-day hit rate (shown on public page)">
        <input
          style={inputStyle}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder="68%"
        />
      </Field>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={save}
          disabled={saving || !value.trim()}
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 12.5,
            padding: "7px 14px",
            borderRadius: 9,
            background: value.trim() ? COLORS.ink : COLORS.line,
            color: value.trim() ? "#fff" : COLORS.muted,
            border: "none",
            cursor: value.trim() ? "pointer" : "not-allowed",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span style={{ fontSize: 12, color: COLORS.teal }}>Saved</span>}
      </div>
    </div>
  );
}

function TipForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const updateLikes = (e) => setForm({ ...form, likes: e.target.value === "" ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0) });

  const canSave = form.home.trim() && form.away.trim() && form.pick.trim() && form.odds.trim();

  return (
    <div
      style={{
        margin: "0 20px 16px",
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Home team">
            <input style={inputStyle} value={form.home} onChange={update("home")} placeholder="Redcliffe" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Away team">
            <input style={inputStyle} value={form.away} onChange={update("away")} placeholder="Aldermoor" />
          </Field>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Home short code">
            <input style={inputStyle} value={form.homeShort} onChange={update("homeShort")} placeholder="RC" maxLength={3} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Away short code">
            <input style={inputStyle} value={form.awayShort} onChange={update("awayShort")} placeholder="AL" maxLength={3} />
          </Field>
        </div>
      </div>

      <Field label="Venue">
        <input style={inputStyle} value={form.venue} onChange={update("venue")} placeholder="Redcliffe Park" />
      </Field>

      <Field label="Image URL (optional)">
        <input
          style={inputStyle}
          value={form.imageUrl}
          onChange={update("imageUrl")}
          placeholder="https://example.com/match-photo.jpg"
        />
      </Field>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Kickoff">
            <input style={inputStyle} value={form.kickoff} onChange={update("kickoff")} placeholder="15:00" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Confidence">
            <select style={inputStyle} value={form.confidence} onChange={update("confidence")}>
              <option value="high">High</option>
              <option value="med">Medium</option>
            </select>
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Units">
            <input style={inputStyle} value={form.units} onChange={update("units")} placeholder="3u" />
          </Field>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Pick">
            <input style={inputStyle} value={form.pick} onChange={update("pick")} placeholder="Redcliffe -1.5" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Odds">
            <input style={inputStyle} value={form.odds} onChange={update("odds")} placeholder="11/10" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Likes">
            <input style={inputStyle} type="number" min={0} value={form.likes} onChange={updateLikes} placeholder="0" />
          </Field>
        </div>
      </div>

      <Field label="Why (reasoning shown to readers)">
        <textarea
          style={{ ...inputStyle, minHeight: 64, resize: "vertical", fontFamily: FONT_BODY }}
          value={form.why}
          onChange={update("why")}
          placeholder="Explain the reasoning behind this pick..."
        />
      </Field>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={() => canSave && onSave(form)}
          disabled={!canSave}
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 13,
            padding: "9px 16px",
            borderRadius: 10,
            background: canSave ? COLORS.ink : COLORS.line,
            color: canSave ? "#fff" : COLORS.muted,
            border: "none",
            cursor: canSave ? "pointer" : "not-allowed",
          }}
        >
          Save tip
        </button>
        <button
          onClick={onCancel}
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 13,
            padding: "9px 16px",
            borderRadius: 10,
            background: "transparent",
            color: COLORS.muted,
            border: `1px solid ${COLORS.line}`,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function TipRow({ tip, onEdit, onDelete, onTogglePublish }) {
  const confBg = tip.confidence === "high" ? COLORS.tealSoft : COLORS.sunSoft;
  const confColor = tip.confidence === "high" ? "#00806E" : "#B8790F";

  return (
    <div
      style={{
        margin: "0 20px 10px",
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 16,
        padding: "12px 14px",
        opacity: tip.published ? 1 : 0.55,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14.5, color: COLORS.ink }}>
          {tip.home} vs {tip.away}
        </span>
        <span
          style={{
            fontFamily: FONT_HEAD,
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 7,
            background: confBg,
            color: confColor,
            whiteSpace: "nowrap",
          }}
        >
          {tip.confidence === "high" ? "High" : "Medium"}
        </span>
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted, marginBottom: 10 }}>
        {tip.kickoff} · {tip.pick} · {tip.odds} · {tip.units}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={onTogglePublish}
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 11.5,
            padding: "6px 10px",
            borderRadius: 8,
            background: tip.published ? COLORS.tealSoft : COLORS.line,
            color: tip.published ? "#00806E" : COLORS.muted,
            border: "none",
            cursor: "pointer",
          }}
        >
          {tip.published ? "Published" : "Draft"}
        </button>
        <button
          onClick={onEdit}
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 11.5,
            padding: "6px 10px",
            borderRadius: 8,
            background: COLORS.bg,
            color: COLORS.ink,
            border: `1px solid ${COLORS.line}`,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 11.5,
            padding: "6px 10px",
            borderRadius: 8,
            background: COLORS.coralSoft,
            color: COLORS.danger,
            border: "none",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function AdminTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [hitRate, setHitRate] = useState("");

  useEffect(() => {
    fetch("/api/tips")
      .then((res) => res.json())
      .then((data) => setTips(data))
      .finally(() => setLoading(false));

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setHitRate(data.hitRate))
      .catch(() => {});
  }, []);

  const editingTip = editingId ? tips.find((t) => t.id === editingId) : null;

  const handleSaveHitRate = async (value) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hitRate: value }),
    });
    const updated = await res.json();
    setHitRate(updated.hitRate);
  };

  const handleCreate = async (form) => {
    const res = await fetch("/api/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newTip = await res.json();
    setTips([newTip, ...tips]);
    setCreating(false);
  };

  const handleUpdate = async (form) => {
    const res = await fetch(`/api/tips/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setTips(tips.map((t) => (t.id === editingId ? updated : t)));
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tips/${id}`, { method: "DELETE" });
    setTips(tips.filter((t) => t.id !== id));
  };

  const togglePublish = async (id) => {
    const tip = tips.find((t) => t.id === id);
    const res = await fetch(`/api/tips/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !tip.published }),
    });
    const updated = await res.json();
    setTips(tips.map((t) => (t.id === id ? updated : t)));
  };

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
              background: COLORS.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            ⚙
          </div>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em" }}>Admin · Tips</div>
        </div>
      </div>

      <div style={{ padding: "2px 20px 16px" }}>
        <p style={{ margin: 0, color: COLORS.muted, fontSize: 13.5 }}>
          {tips.filter((t) => t.published).length} published · {tips.filter((t) => !t.published).length} drafts
        </p>
      </div>

      {!loading && <SettingsPanel hitRate={hitRate} onSave={handleSaveHitRate} />}

      <div style={{ padding: "0 20px 16px" }}>
        {!creating && !editingId && (
          <button
            onClick={() => setCreating(true)}
            style={{
              width: "100%",
              fontFamily: FONT_HEAD,
              fontWeight: 700,
              fontSize: 13.5,
              padding: "11px 16px",
              borderRadius: 12,
              background: COLORS.coral,
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Add new tip
          </button>
        )}
      </div>

      {creating && <TipForm initial={EMPTY_TIP} onSave={handleCreate} onCancel={() => setCreating(false)} />}

      {editingTip && (
        <TipForm
          initial={editingTip}
          onSave={handleUpdate}
          onCancel={() => setEditingId(null)}
        />
      )}

      {!creating &&
        !editingId &&
        tips.map((tip) => (
          <TipRow
            key={tip.id}
            tip={tip}
            onEdit={() => setEditingId(tip.id)}
            onDelete={() => handleDelete(tip.id)}
            onTogglePublish={() => togglePublish(tip.id)}
          />
        ))}

      {loading && (
        <div style={{ margin: "0 20px", textAlign: "center", color: COLORS.muted, fontSize: 13, padding: "40px 0" }}>
          Loading tips…
        </div>
      )}

      {!loading && tips.length === 0 && !creating && (
        <div style={{ margin: "0 20px", textAlign: "center", color: COLORS.muted, fontSize: 13, padding: "40px 0" }}>
          No tips yet — add your first one above.
        </div>
      )}
    </div>
  );
}
