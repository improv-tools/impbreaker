import React, { useState, useEffect, useRef } from "react";
import { prompts, categories, levels } from "./prompts";

export default function App() {
  const [activeCombos, setActiveCombos] = useState(
    new Set(categories.flatMap((cat) => levels.map((lvl) => `${cat}:${lvl}`)))
  );
  const [currentPrompt, setCurrentPrompt] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  const getFilteredPrompts = () =>
    prompts.filter((p) => activeCombos.has(`${p.category}:${p.level}`));

  const getRandomPrompt = () => {
    const filtered = getFilteredPrompts();
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  useEffect(() => {
    setCurrentPrompt(getRandomPrompt());
  }, []);

  const handleClick = () => {
    setCurrentPrompt(getRandomPrompt());
  };

  const toggleCombo = (cat, lvl) => {
    const key = `${cat}:${lvl}`;
    const newSet = new Set(activeCombos);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setActiveCombos(newSet);

    const filtered = prompts.filter((p) => newSet.has(`${p.category}:${p.level}`));
    setCurrentPrompt(filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : null);
  };

  const categoryColors = {
    question: "#60a5fa",   // blue
    physical: "#f472b6",   // pink
    game: "#6ee7b7",       // green
    boundaries: "#c084fc", // purple
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000",
        color: "white",
        fontFamily: `"Inter", sans-serif`,
      }}
    >
      <div
        style={{
          backgroundColor: "#0a0a0a",
          padding: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${levels.length + 1}, minmax(4rem, auto))`,
            gap: "0.5rem",
            alignItems: "center",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "0.875rem",
            color: "#f3f4f6",
          }}
        >
          <div></div>
          {levels.map((lvl) => (
            <div key={`header-${lvl}`} style={{ textTransform: "capitalize" }}>
              Level {lvl}
            </div>
          ))}
          {categories.map((cat) => (
            <React.Fragment key={`cat-header-${cat}`}>
              <div style={{ fontWeight: "700", textTransform: "capitalize" }}>{cat}</div>
              {levels.map((lvl) => {
                const key = `${cat}:${lvl}`;
                const active = activeCombos.has(key);
                const exists = prompts.some((p) => p.category === cat && p.level === lvl);
                return exists ? (
                  <button
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCombo(cat, lvl);
                    }}
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      border: active ? "2px solid #3b82f6" : "1px solid #444",
                      backgroundColor: active ? "#3b82f6" : "#111",
                      color: active ? "white" : "#ccc",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      userSelect: "none",
                    }}
                    aria-pressed={active}
                    title={`Toggle ${cat} Level ${lvl}`}
                  >
                    {active ? "✓" : "✕"}
                  </button>
                ) : (
                  <div key={key}></div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {currentPrompt ? (
          <>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: "white",
                maxWidth: "40rem",
                lineHeight: "1.4",
              }}
            >
              {currentPrompt.text}
            </h1>
            <p
              style={{
                marginTop: "1rem",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.05em",
                color: categoryColors[currentPrompt.category] || "#999",
                fontSize: "0.75rem",
              }}
            >
              {currentPrompt.category} · Level {currentPrompt.level}
            </p>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                color: "#777",
                userSelect: "text",
              }}
            >
              (Click or press Space/Enter to continue)
            </p>
          </>
        ) : (
          <p style={{ color: "#888", marginTop: "1.5rem", userSelect: "text" }}>
            No prompts available for the selected filters.
          </p>
        )}
      </main>
    </div>
  );
}
