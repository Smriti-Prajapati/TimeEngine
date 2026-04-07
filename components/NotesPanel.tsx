"use client";

import { useState, useEffect, useRef } from "react";
import type { SelectedRange } from "./CalendarContainer";
import type { MonthTheme } from "./monthThemes";

type Props = {
  rangeNoteKey: string | null;
  monthKey: string;
  notes: Record<string, string>;
  saveNote: (key: string, value: string) => void;
  range: SelectedRange;
  theme: MonthTheme;
  darkMode: boolean;
};

export default function NotesPanel({ rangeNoteKey, monthKey, notes, saveNote, range, theme }: Props) {
  const [activeTab, setActiveTab] = useState<"range" | "month">("range");
  const [rangeText, setRangeText] = useState("");
  const [monthText, setMonthText] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRangeText(rangeNoteKey ? (notes[rangeNoteKey] || "") : "");
  }, [rangeNoteKey, notes]);

  useEffect(() => {
    setMonthText(notes[monthKey] || "");
  }, [monthKey, notes]);

  const flash = () => {
    setShowSaved(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShowSaved(false), 2200);
  };

  const handleRangeChange = (val: string) => {
    setRangeText(val);
    if (rangeNoteKey) { saveNote(rangeNoteKey, val); flash(); }
  };

  const handleMonthChange = (val: string) => {
    setMonthText(val);
    saveNote(monthKey, val);
    flash();
  };

  const rangeLabel = range.start
    ? range.end ? shortDate(range.start) + " -> " + shortDate(range.end) : shortDate(range.start)
    : null;

  const savedEntries = Object.entries(notes).filter(([, v]) => v.trim());

  return (
    <div className="glass-card" style={{ borderRadius: "var(--radius)", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", fontFamily: "var(--mono)" }}>
            <span style={{ color: theme.primary }}>// </span>notes.md
          </h2>
          <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "3px", fontFamily: "var(--mono)" }}>
            auto-saved to localStorage
          </p>
        </div>
        {showSaved && (
          <span className="saved-toast" style={{ fontSize: "0.65rem", fontWeight: "700", color: "#98c379", background: "rgba(152,195,121,0.12)", border: "1px solid rgba(152,195,121,0.25)", borderRadius: "6px", padding: "3px 10px", whiteSpace: "nowrap", fontFamily: "var(--mono)" }}>
            saved
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "4px", background: "var(--bg)", borderRadius: "8px", padding: "3px", border: "1px solid var(--border)" }}>
        <NoteTab active={activeTab === "range"} onClick={() => setActiveTab("range")} label="date_range" theme={theme} />
        <NoteTab active={activeTab === "month"} onClick={() => setActiveTab("month")} label="this_month" theme={theme} />
      </div>

      {activeTab === "range" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rangeLabel ? (
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: "600", color: theme.primary, background: theme.primary + "12", padding: "8px 12px", borderRadius: "6px", border: "1px solid " + theme.primary + "25" }}>
              <span style={{ color: "var(--text-muted)" }}>range: </span>{rangeLabel}
            </div>
          ) : (
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-muted)", background: "var(--bg)", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
              <span style={{ color: "#e06c75" }}>// </span>select a date first
            </div>
          )}
          <textarea value={rangeText} onChange={(e) => handleRangeChange(e.target.value)} placeholder="// write your note here..." disabled={!rangeNoteKey} style={textareaCSS(!rangeNoteKey, theme)} />
          {rangeText && <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)", textAlign: "right" }}>{rangeText.length} chars</div>}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <textarea value={monthText} onChange={(e) => handleMonthChange(e.target.value)} placeholder="// monthly notes..." style={textareaCSS(false, theme)} />
          {monthText && <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)", textAlign: "right" }}>{monthText.length} chars</div>}
        </div>
      )}

      {savedEntries.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "10px" }}>{"/* saved_notes[" + savedEntries.length + "] */"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxHeight: "200px", overflowY: "auto" }}>
            {savedEntries.map(([key, val]) => (
              <div key={key} style={{ background: "var(--bg)", borderRadius: "6px", padding: "9px 12px", borderLeft: "3px solid " + theme.primary }}>
                <div style={{ fontFamily: "var(--mono)", color: theme.primary, fontWeight: "600", marginBottom: "5px", fontSize: "0.62rem" }}>{labelKey(key)}</div>
                <div style={{ color: "var(--text-primary)", lineHeight: "1.55", fontSize: "0.78rem" }}>{val.length > 100 ? val.slice(0, 100) + "..." : val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NoteTab({ active, onClick, label, theme }: { active: boolean; onClick: () => void; label: string; theme: MonthTheme }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: "7px 0", fontSize: "0.7rem", fontWeight: active ? "700" : "400", fontFamily: "var(--mono)", background: active ? "var(--card)" : "transparent", color: active ? theme.primary : "var(--text-muted)", border: active ? "1px solid " + theme.primary + "35" : "1px solid transparent", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s" }}>
      {label}
    </button>
  );
}

function textareaCSS(disabled: boolean, theme: MonthTheme): React.CSSProperties {
  return { width: "100%", minHeight: "140px", padding: "12px", fontSize: "0.82rem", lineHeight: "1.7", border: "1px solid " + (disabled ? "var(--border)" : theme.primary + "40"), borderRadius: "8px", background: "var(--bg)", color: "var(--text-primary)", resize: "vertical", outline: "none", fontFamily: "var(--mono)", opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "text", transition: "border-color 0.2s, box-shadow 0.2s" };
}

function shortDate(key: string) {
  const p = key.split("-");
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return m[parseInt(p[1]) - 1] + " " + parseInt(p[2]);
}

function fullDate(key: string) {
  const p = key.split("-");
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return m[parseInt(p[1]) - 1] + " " + parseInt(p[2]) + ", " + p[0];
}

function labelKey(key: string) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  if (key.startsWith("range-")) {
    const inner = key.slice(6);
    const match = inner.match(/^(\d{4}-\d{2}-\d{2})(?:--(\d{4}-\d{2}-\d{2}))?$/);
    if (match) return "range: " + fullDate(match[1]) + (match[2] ? " -> " + fullDate(match[2]) : "");
    return inner;
  }
  const p = key.split("-");
  return "month: " + months[parseInt(p[1])] + " " + p[0];
}