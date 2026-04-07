"use client";

import { useState } from "react";
import type { SelectedRange } from "./CalendarContainer";
import type { MonthTheme } from "./monthThemes";

type Props = {
  date: Date;
  isCurrentMonth: boolean;
  range: SelectedRange;
  confirmedRange: SelectedRange;
  todayKey: string;
  isSelectingEnd: boolean;
  theme: MonthTheme;
  onClick: (date: Date) => void;
  onHover: (key: string) => void;
};

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DateCell({
  date, isCurrentMonth, range, confirmedRange, todayKey,
  isSelectingEnd, theme, onClick, onHover,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const key = toKey(date);
  const isToday = key === todayKey;
  const isStart = key === confirmedRange.start;
  const isEnd = key === confirmedRange.end;
  const isConfirmedStart = isStart && !!confirmedRange.end;
  const isConfirmedEnd = isEnd;
  const isInRange = !!(range.start && range.end && key > range.start && key < range.end);
  const isPreviewEnd = isSelectingEnd && key === range.end;
  const isPreviewStart = isSelectingEnd && key === range.start;
  const isInPreview = isSelectingEnd && isInRange;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isSelected = isStart || isEnd;

  let bg = "transparent";
  if (isSelected) bg = theme.primary;
  else if (isInRange && !isSelectingEnd) bg = `${theme.primary}18`;
  else if (isInPreview || isPreviewEnd) bg = `${theme.primary}12`;
  else if (hovered && isCurrentMonth) bg = `${theme.primary}10`;

  let color = "var(--text-primary)";
  if (isSelected) color = "white";
  else if (!isCurrentMonth) color = "var(--border)";
  else if (isWeekend) color = theme.primary;

  let borderRadius = "9px";
  if (isConfirmedStart) borderRadius = "50px 0 0 50px";
  else if (isConfirmedEnd) borderRadius = "0 50px 50px 0";
  else if (isPreviewStart && isSelectingEnd) borderRadius = "50px 0 0 50px";
  else if (isPreviewEnd) borderRadius = "0 50px 50px 0";
  else if ((isInRange && !isSelectingEnd) || isInPreview) borderRadius = "0";

  return (
    <div
      onClick={() => isCurrentMonth && onClick(date)}
      onMouseEnter={() => { setHovered(true); if (isCurrentMonth) onHover(key); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: "42px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "2px",
        borderRadius,
        background: bg,
        color,
        fontSize: "0.85rem",
        fontWeight: isToday ? "800" : isSelected ? "700" : isWeekend && isCurrentMonth ? "600" : "400",
        cursor: isCurrentMonth ? "pointer" : "default",
        transition: "background 0.12s, transform 0.12s, box-shadow 0.12s",
        transform: hovered && isCurrentMonth && !isSelected ? "scale(1.12)" : "scale(1)",
        userSelect: "none",
        opacity: !isCurrentMonth ? 0.25 : 1,
        position: "relative",
        boxShadow: isSelected
          ? `0 4px 14px ${theme.primary}55`
          : hovered && isCurrentMonth && !isSelected
          ? `0 2px 8px ${theme.primary}25`
          : "none",
        outline: isToday && !isSelected ? `2px solid ${theme.primary}` : "none",
        outlineOffset: "-2px",
      }}
    >
      {date.getDate()}
      {isToday && !isSelected && (
        <span style={{
          width: "3px", height: "3px",
          borderRadius: "50%",
          background: theme.primary,
          flexShrink: 0,
        }} />
      )}
    </div>
  );
}
