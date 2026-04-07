"use client";

import type { MonthTheme } from "./monthThemes";

type Props = {
  currentDate: Date;
  theme: MonthTheme;
  darkMode: boolean;
};

export default function HeroSection({ currentDate, theme, darkMode }: Props) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekends = countWeekends(year, month);
  const weekNum = getWeekNumber(new Date(year, month, 1));

  const codeBg = "var(--highlight)";
  const cardBg = "var(--card)";

  return (
    <div style={{ borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "0 8px 40px " + theme.primary + "18", display: "flex", flexDirection: "column", background: cardBg, border: "1px solid var(--border)", transition: "background 0.3s" }}>
      <div style={{ position: "relative", height: "185px", flexShrink: 0 }}>
        <img src={theme.image} alt={theme.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: darkMode ? "brightness(0.55) saturate(0.8)" : "brightness(0.75)" }}
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80"; }} />
        <div style={{ position: "absolute", inset: 0, background: theme.gradient.replace("linear-gradient(135deg,", "linear-gradient(160deg,"), opacity: 0.65 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.55))" }} />
        <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(13,17,23,0.75)", backdropFilter: "blur(8px)", borderRadius: "6px", padding: "4px 10px", border: "1px solid " + theme.primary + "40", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#28c840" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: theme.primary, fontWeight: "600" }}>{theme.tag}</span>
        </div>
        <div style={{ position: "absolute", bottom: "12px", left: "14px", color: "white" }}>
          <div style={{ fontSize: "1.7rem", fontWeight: "800", letterSpacing: "-0.03em", lineHeight: 1 }}>{theme.name}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", opacity: 0.75, marginTop: "4px", color: theme.secondary }}>{year} - {daysInMonth} days</div>
        </div>
      </div>

      <div style={{ height: "2px", background: theme.gradient, opacity: 0.8 }} />

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.6", padding: "10px 12px", background: "var(--highlight)", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <span style={{ color: theme.primary }}>// </span>{theme.quote}
        </div>

        <div className="code-block" style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "4px", fontSize: "0.62rem" }}>const stats = {"{"}</div>
          <div style={{ display: "flex", gap: "4px" }}><span style={{ color: "var(--text-muted)" }}>  days:</span><span style={{ color: theme.primary }}>{daysInMonth}</span><span style={{ color: "var(--text-muted)" }}>,</span></div>
          <div style={{ display: "flex", gap: "4px" }}><span style={{ color: "var(--text-muted)" }}>  weekends:</span><span style={{ color: theme.primary }}>{weekends}</span><span style={{ color: "var(--text-muted)" }}>,</span></div>
          <div style={{ display: "flex", gap: "4px" }}><span style={{ color: "var(--text-muted)" }}>  week:</span><span style={{ color: theme.primary }}>{weekNum}</span><span style={{ color: "var(--text-muted)" }}>,</span></div>
          <div style={{ color: "var(--text-muted)" }}>{"}"}</div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "7px" }}>{"/* " + theme.name.toLowerCase() + ".map() */"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = new Date(year, month, i + 1);
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const isToday = d.getDate() === new Date().getDate() && d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
              return (
                <div key={i} title={d.toDateString()} style={{ width: "19px", height: "19px", borderRadius: "4px", background: isToday ? theme.primary : isWeekend ? theme.primary + "22" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: "0.5rem", color: isToday ? "var(--bg)" : isWeekend ? theme.primary : "var(--text-muted)", fontWeight: isToday || isWeekend ? "700" : "400", outline: isToday ? "2px solid " + theme.primary : "none", outlineOffset: "1px" }}>
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function countWeekends(year: number, month: number) {
  const days = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let d = 1; d <= days; d++) {
    const day = new Date(year, month, d).getDay();
    if (day === 0 || day === 6) count++;
  }
  return count;
}

function getWeekNumber(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}