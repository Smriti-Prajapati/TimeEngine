"use client";

import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import Calendar from "./Calendar";
import NotesPanel from "./NotesPanel";
import themes from "./monthThemes";

export type SelectedRange = {
  start: string | null;
  end: string | null;
};

export default function CalendarContainer() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [range, setRange] = useState<SelectedRange>({ start: null, end: null });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    setCurrentDate(new Date());
    setMounted(true);
    try {
      const savedNotes = localStorage.getItem("smartcalendar-notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      const savedTheme = localStorage.getItem("smartcalendar-theme");
      if (savedTheme === "light") setDarkMode(false);
    } catch { }
  }, []);

  useEffect(() => {
    if (!currentDate) return;
    const t = themes[currentDate.getMonth()];
    const root = document.documentElement;
    root.style.setProperty("--accent", t.primary);
    root.style.setProperty("--accent2", t.secondary);
    root.style.setProperty("--gradient", t.gradient);
    if (darkMode) {
      root.style.setProperty("--bg", "#0d1117");
      root.style.setProperty("--card", "#161b22");
      root.style.setProperty("--text-primary", "#c9d1d9");
      root.style.setProperty("--text-muted", "#484f58");
      root.style.setProperty("--border", "#21262d");
      root.style.setProperty("--highlight", t.highlight);
      root.style.setProperty("--range-bg", t.rangeBg);
      root.style.setProperty("--shadow", "0 2px 20px rgba(0,0,0,0.4)");
    } else {
      root.style.setProperty("--bg", t.bg);
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--text-primary", t.text);
      root.style.setProperty("--text-muted", t.muted);
      root.style.setProperty("--border", t.border);
      root.style.setProperty("--highlight", t.highlight);
      root.style.setProperty("--range-bg", t.rangeBg);
      root.style.setProperty("--shadow", "0 2px 20px rgba(0,0,0,0.07)");
    }
  }, [currentDate, darkMode]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("smartcalendar-theme", next ? "dark" : "light");
  };

  const saveNote = (key: string, value: string) => {
    const updated = { ...notes, [key]: value };
    setNotes(updated);
    localStorage.setItem("smartcalendar-notes", JSON.stringify(updated));
  };

  if (!mounted || !currentDate) {
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", paddingTop: "8rem" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--accent)" }}>
          loading...
        </span>
      </div>
    );
  }

  const theme = themes[currentDate.getMonth()];
  const monthKey = currentDate.getFullYear() + "-" + currentDate.getMonth();
  const rangeNoteKey = range.start && range.end
    ? "range-" + range.start + "--" + range.end
    : range.start ? "range-" + range.start : null;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }} className="fade-up">
      <header style={{
        marginBottom: "2rem", padding: "14px 20px",
        background: "var(--card)", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px", boxShadow: "var(--shadow)",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {darkMode ? (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#28c840" }} />
            </div>
          ) : (
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
              📅
            </div>
          )}
          <div>
            <h1 className="gradient-text" style={{ fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.03em", lineHeight: 1 }}>
              TimeEngine
            </h1>
            {darkMode ? (
              <p style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "3px" }}>
                <span style={{ color: "#98c379" }}>~/dev/</span>
                <span style={{ color: theme.primary }}>time-engine</span>
                <span style={{ color: "var(--text-muted)" }}> on </span>
                <span style={{ color: "#e5c07b" }}>main</span>
                <span className="cursor" />
              </p>
            ) : (
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>Plan your days · capture your thoughts</p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ fontFamily: darkMode ? "var(--mono)" : "inherit", fontSize: "0.7rem", fontWeight: "600", color: theme.primary, background: theme.highlight, border: "1px solid " + theme.border, borderRadius: darkMode ? "6px" : "20px", padding: "4px 12px" }}>
            {darkMode ? theme.tag : theme.name + " " + currentDate.getFullYear()}
          </div>
          <button onClick={toggleDark} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "50px", padding: "6px 14px", cursor: "pointer", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px", transition: "all 0.2s", fontFamily: "inherit", fontWeight: "500" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>
      <div className="calendar-grid">
        <HeroSection currentDate={currentDate} theme={theme} darkMode={darkMode} />
        <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} range={range} setRange={setRange} theme={theme} darkMode={darkMode} />
        <NotesPanel rangeNoteKey={rangeNoteKey} monthKey={monthKey} notes={notes} saveNote={saveNote} range={range} theme={theme} darkMode={darkMode} />
      </div>
    </div>
  );
}