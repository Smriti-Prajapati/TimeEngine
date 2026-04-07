"use client";

import { useMemo, useState } from "react";
import type { SelectedRange } from "./CalendarContainer";
import type { MonthTheme } from "./monthThemes";
import DateCell from "./DateCell";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type Props = {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  range: SelectedRange;
  setRange: (r: SelectedRange) => void;
  theme: MonthTheme;
  darkMode: boolean;
};

export function toKey(date: Date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function fmtDisplay(key: string) {
  const p = key.split("-");
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return m[parseInt(p[1]) - 1] + " " + parseInt(p[2]) + ", " + p[0];
}

export default function Calendar({ currentDate, setCurrentDate, range, setRange, theme }: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayKey = toKey(currentDate);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const result: { date: Date; isCurrentMonth: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ date: new Date(year, month - 1, daysInPrev - i), isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    const rem = 42 - result.length;
    for (let d = 1; d <= rem; d++) {
      result.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }
    return result;
  }, [year, month]);

  const handleClick = (date: Date) => {
    const key = toKey(date);
    if (!range.start || (range.start && range.end)) {
      setRange({ start: key, end: null });
    } else {
      if (key < range.start) setRange({ start: key, end: range.start });
      else if (key === range.start) setRange({ start: null, end: null });
      else setRange({ start: range.start, end: key });
      setHoverKey(null);
    }
  };

  const isSelectingEnd = !!(range.start && !range.end);

  const previewRange: SelectedRange = useMemo(() => {
    if (isSelectingEnd && hoverKey) {
      if (hoverKey > range.start!) return { start: range.start, end: hoverKey };
      if (hoverKey < range.start!) return { start: hoverKey, end: range.start };
    }
    return range;
  }, [range, hoverKey, isSelectingEnd]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => {
    const n = new Date();
    setCurrentDate(new Date(n.getFullYear(), n.getMonth(), 1));
  };

  const rangeCount = range.start && range.end
    ? Math.round((new Date(range.end).getTime() - new Date(range.start).getTime()) / 86400000) + 1
    : null;

  return (
    <div className="glass-card" style={{ borderRadius: "var(--radius)", padding: "26px 24px", boxShadow: "0 8px 40px " + theme.primary + "15", transition: "box-shadow 0.4s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
        <NavBtn onClick={prevMonth} label="<" theme={theme} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{MONTHS[month]}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px", fontWeight: "500" }}>{year}</div>
        </div>
        <NavBtn onClick={nextMonth} label=">" theme={theme} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <button onClick={goToday} style={{ fontSize: "0.7rem", fontWeight: "600", color: theme.primary, background: theme.primary + "15", border: "1px solid " + theme.primary + "30", borderRadius: "20px", padding: "4px 14px", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = theme.primary + "25")}
          onMouseLeave={(e) => (e.currentTarget.style.background = theme.primary + "15")}>
          Today
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isSelectingEnd && <span style={{ fontSize: "0.68rem", color: theme.primary, fontWeight: "500", fontStyle: "italic" }}>pick end date</span>}
          {rangeCount && <span style={{ fontSize: "0.68rem", fontWeight: "700", background: theme.primary + "18", color: theme.primary, padding: "3px 10px", borderRadius: "20px", border: "1px solid " + theme.primary + "25" }}>{rangeCount}d</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "6px" }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.62rem", fontWeight: "700", color: i === 0 || i === 6 ? theme.primary : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 0 10px", opacity: i === 0 || i === 6 ? 0.8 : 1 }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }} onMouseLeave={() => setHoverKey(null)}>
        {cells.map((cell, i) => (
          <DateCell key={i} date={cell.date} isCurrentMonth={cell.isCurrentMonth} range={previewRange} confirmedRange={range} todayKey={todayKey} isSelectingEnd={isSelectingEnd} theme={theme} onClick={handleClick} onHover={(k) => isSelectingEnd && setHoverKey(k)} />
        ))}
      </div>

      {(range.start || range.end) && (
        <div className="scale-in" style={{ marginTop: "18px", padding: "13px 16px", background: theme.primary + "10", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid " + theme.primary + "25" }}>
          <div>
            <div style={{ fontSize: "0.6rem", color: theme.primary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "700", marginBottom: "3px" }}>Selected range</div>
            <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-primary)" }}>
              {range.start && fmtDisplay(range.start)}
              {range.end && <span style={{ color: "var(--text-muted)", fontWeight: "400" }}>{" -> "}{fmtDisplay(range.end)}</span>}
            </div>
          </div>
          <button onClick={() => { setRange({ start: null, end: null }); setHoverKey(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem", padding: "4px 6px", borderRadius: "6px", transition: "color 0.15s", lineHeight: 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.primary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            x
          </button>
        </div>
      )}
    </div>
  );
}

function NavBtn({ onClick, label, theme }: { onClick: () => void; label: string; theme: MonthTheme }) {
  return (
    <button onClick={onClick} style={{ background: theme.primary + "10", border: "1px solid " + theme.primary + "25", borderRadius: "10px", width: "38px", height: "38px", cursor: "pointer", fontSize: "1rem", color: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", fontFamily: "inherit", fontWeight: "600" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = theme.primary + "22"; e.currentTarget.style.transform = "scale(1.05)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = theme.primary + "10"; e.currentTarget.style.transform = "scale(1)"; }}>
      {label}
    </button>
  );
}