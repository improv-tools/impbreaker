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

  const toggleEntireLevel = (lvl) => {
    const newSet = new Set(activeCombos);
    let allOn = categories.every((cat) => newSet.has(`${cat}:${lvl}`));
    categories.forEach((cat) => {
      const key = `${cat}:${lvl}`;
      if (allOn) newSet.delete(key);
      else newSet.add(key);
    });
    setActiveCombos(newSet);
    const filtered = prompts.filter((p) => newSet.has(`${p.category}:${p.level}`));
    setCurrentPrompt(filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : null);
  };

  const toggleEntireCategory = (cat) => {
    const newSet = new Set(activeCombos);
    let allOn = levels.every((lvl) => newSet.has(`${cat}:${lvl}`));
    levels.forEach((lvl) => {
      const key = `${cat}:${lvl}`;
      if (allOn) newSet.delete(key);
      else newSet.add(key);
    });
    setActiveCombos(newSet);
    const filtered = prompts.filter((p) => newSet.has(`${p.category}:${p.level}`));
    setCurrentPrompt(filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : null);
  };

  const categoryColors = {
    question: "text-blue-400",
    physical: "text-pink-400",
    game: "text-green-400",
    boundaries: "text-purple-400",
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
        backgroundColor: "#000",
        color: "white",
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#111",
          padding: "0.75rem 1rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #333",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${levels.length + 1}, auto)`,
            gap: "0.5rem",
            alignItems: "center",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "0.875rem",
          }}
        >
          <div></div>
          {levels.map((lvl) => (
            <div
              key={`header-${lvl}`}
              style={{
                cursor: "pointer",
                color: "#ccc",
                padding: "0.25rem 0.5rem",
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleEntireLevel(lvl);
              }}
            >
              Level {lvl}
            </div>
          ))}
          {categories.map((cat) => (
            <React.Fragment key={`cat-header-${cat}`}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEntireCategory(cat);
                }}
                style={{
                  fontWeight: "700",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  color: "#fff",
                  paddingRight: "0.5rem",
                }}
              >
                {cat}
              </div>
              {levels.map((lvl) => {
                const key = `${cat}:${lvl}`;
                const active = activeCombos.has(key);
                const exists = prompts.some((p) => p.category === cat && p.level === lvl);
                return (
                  <div key={key} style={{ width: "100%", textAlign: "center" }}>
                    {exists ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCombo(cat, lvl);
                        }}
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          border: "1px solid #444",
                          backgroundColor: active ? "#2563eb" : "#222",
                          color: active ? "white" : "#aaa",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          userSelect: "none",
                        }}
                      >
                        {active ? "✓" : "✕"}
                      </button>
                    ) : (
                      <div style={{ height: "2rem" }}></div>
                    )}
                  </div>
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
          padding: "1.5rem",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {currentPrompt ? (
          <>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "600", maxWidth: "40rem", color: "#fff" }}>
              {currentPrompt.text}
            </h1>
            <p
              style={{
                marginTop: "1rem",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.05em",
                color: categoryColors[currentPrompt.category] || "#aaa",
              }}
            >
              {currentPrompt.category} · Level {currentPrompt.level}
            </p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666", userSelect: "text" }}>
              (Click anywhere or press Enter/Space to see another prompt)
            </p>
          </>
        ) : (
          <p style={{ color: "#aaa", marginTop: "1.5rem", userSelect: "text" }}>
            No prompts available for the selected filters.
          </p>
        )}
      </main>
    </div>
  );
}
