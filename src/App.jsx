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
        height: "100dvh",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
        outline: "none",
      }}
    >
      {/* Sticky Header Filter Grid */}
      <div
        style={{
          backgroundColor: "#111111",
          padding: "0.75rem 1rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: `repeat(${levels.length + 1}, auto)`,
          gap: "0.5rem",
          alignItems: "center",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "0.875rem",
          width: "100%",
          boxSizing: "border-box",
          color: "#ffffff",
        }}
      >
        <div></div>
        {levels.map((lvl) => (
          <div key={`header-${lvl}`}>{`Level ${lvl}`}</div>
        ))}
        {categories.map((cat) => (
          <React.Fragment key={`cat-${cat}`}>
            <div style={{ fontWeight: "700", textTransform: "capitalize" }}>{cat}</div>
            {levels.map((lvl) => {
              const key = `${cat}:${lvl}`;
              const active = activeCombos.has(key);
              const exists = prompts.some((p) => p.category === cat && p.level === lvl);
              if (!exists) return null;
              return (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCombo(cat, lvl);
                  }}
                  style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    border: active ? "2px solid #ffffff" : "1px solid #666666",
                    backgroundColor: active ? "#ffffff" : "#000000",
                    color: active ? "#000000" : "#ffffff",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    userSelect: "none",
                    fontFamily: "inherit",
                  }}
                  aria-pressed={active}
                >
                  {active ? "✓" : "✕"}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Main Prompt Display */}
      <main
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1.5rem",
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
                color: "#ffffff",
                maxWidth: "40rem",
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
                color: "#cccccc",
              }}
            >
              {currentPrompt.category} · Level {currentPrompt.level}
            </p>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                color: "#888888",
              }}
            >
              (Click anywhere or press Enter/Space to see another prompt)
            </p>
          </>
        ) : (
          <p
            style={{
              color: "#888888",
              marginTop: "1.5rem",
            }}
          >
            No prompts available for the selected filters.
          </p>
        )}
      </main>
    </div>
  );
}
