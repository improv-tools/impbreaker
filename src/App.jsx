import React, { useState, useEffect, useRef } from "react";
//import { prompts } from "./prompts.js";
const prompts = [
  // PAUSE / CHECK-IN
  { text: "Take a moment to check in with yourself. How are you feeling?", category: "pause", level: 0 },
  { text: "Would you like to continue, pause, or stop?", category: "pause", level: 0 },

  // QUESTIONS: LEVEL 1 (Casual, light)
  { text: "What’s your favorite comfort food and why?", level: 1, category: "question" },
  { text: "What was your favorite toy or game as a kid?", level: 1, category: "question" },
  { text: "What’s something that always makes you smile?", level: 1, category: "question" },
  { text: "What’s your ideal way to spend a weekend?", level: 1, category: "question" },
  { text: "Would you rather visit the beach or the mountains?", level: 1, category: "question" },
  { text: "What kind of animal would you be and why?", level: 1, category: "question" },
  { text: "What’s a TV show you loved growing up?", level: 1, category: "question" },
  { text: "What’s your favorite holiday tradition?", level: 1, category: "question" },
  { text: "What small thing are you grateful for today?", level: 1, category: "question" },
  { text: "What was your first job and how did it go?", level: 1, category: "question" },

  // QUESTIONS: LEVEL 2 (Personal, normal)
  { text: "What’s a belief you used to have that you’ve changed?", level: 2, category: "question" },
  { text: "When did you last cry in front of someone?", level: 2, category: "question" },
  { text: "What’s something you wish people asked you more often?", level: 2, category: "question" },
  { text: "What does home mean to you?", level: 2, category: "question" },
  { text: "What’s something you long for but rarely talk about?", level: 2, category: "question" },
  { text: "Who in your life shaped your values the most?", level: 2, category: "question" },
  { text: "What memory do you go back to when you need comfort?", level: 2, category: "question" },
  { text: "When do you feel most like your true self?", level: 2, category: "question" },
  { text: "What’s a challenge you overcame that changed you?", level: 2, category: "question" },
  { text: "What part of your personality do you feel misunderstood?", level: 2, category: "question" },

  // QUESTIONS: LEVEL 3 (Deep/vulnerable)
  { text: "What part of yourself are you most afraid to show?", level: 3, category: "question" },
  { text: "What’s something you still carry shame about?", level: 3, category: "question" },
  { text: "What would complete emotional safety look like for you?", level: 3, category: "question" },
  { text: "When have you felt most unlovable?", level: 3, category: "question" },
  { text: "What do you most often avoid thinking about?", level: 3, category: "question" },
  { text: "What do you fear I might never understand about you?", level: 3, category: "question" },
  { text: "What does it take for you to trust someone completely?", level: 3, category: "question" },
  { text: "When do you feel most emotionally connected to others?", level: 3, category: "question" },
  { text: "What emotion do you struggle to express?", level: 3, category: "question" },
  { text: "Have you ever felt rejected or misunderstood by me, even if you didn’t tell me?", level: 3, category: "question" },
  { text: "What’s a fear you have about being emotionally close with me?", level: 3, category: "question" },

  // QUESTIONS: LEVEL 4 (Extreme, raw, or highly uncomfortable — strictly for the two people)
  { text: "What is the one thing about yourself you hope I never find out—and why?", level: 4, category: "question" },
  { text: "Tell me something you wish you could change about me, but never said aloud.", level: 4, category: "question" },
  { text: "What’s the most hurtful thing I could say to you, right now?", level: 4, category: "question" },
  { text: "Describe a secret fantasy or regret involving me that you’ve never shared.", level: 4, category: "question" },
  { text: "Share a time when you felt truly ashamed in our relationship, or about us.", level: 4, category: "question" },
  { text: "What is your biggest fear about our connection that you rarely speak of?", level: 4, category: "question" },
  { text: "Have you ever thought about ending things between us, even for a moment? Explain.", level: 4, category: "question" },
  { text: "What is your greatest insecurity when you’re with me?", level: 4, category: "question" },
  { text: "Is there something you’ve lied to me about, no matter how small?", level: 4, category: "question" },
  { text: "What’s something about your feelings for me that scares you most?", level: 4, category: "question" },
  { text: "Is there a part of yourself you hide around me, and why?", level: 4, category: "question" },
  { text: "If you had no fear of judgment or consequence, what would you want to say to me right now?", level: 4, category: "question" },
  { text: "What is the deepest wound you carry that you fear might never heal?", level: 4, category: "question" },

  // PHYSICAL: LEVEL 1 (casual, easy, low contact)
  { text: "High five your partner.", level: 1, category: "physical" },
  { text: "Sit back-to-back and relax together for 30 seconds.", level: 1, category: "physical" },
  { text: "Touch elbows and keep them connected until the end of your next prompt.", level: 1, category: "physical" },
  { text: "Fist bump and hold for 3 seconds.", level: 1, category: "physical" },
  { text: "Stand shoulder to shoulder and match your breathing for 10 seconds.", level: 1, category: "physical" },
  { text: "Tap your partner’s knee twice.", level: 1, category: "physical" },
  { text: "Mirror your partner’s hand gestures for 15 seconds.", level: 1, category: "physical" },
  { text: "Compare your hand sizes palm-to-palm.", level: 1, category: "physical" },
  { text: "Give your partner a quick, gentle shoulder squeeze.", level: 1, category: "physical" },
  { text: "Sit side by side so your arms are touching for 10 seconds.", level: 1, category: "physical" },

  // PHYSICAL: LEVEL 2 (longer or more meaningful contact)
  { text: "Hold hands with your partner for 20 seconds.", level: 2, category: "physical" },
  { text: "Touch pinkies and keep them connected until the end of your next prompt.", level: 2, category: "physical" },
  { text: "Sit facing each other and make eye contact for 15 seconds.", level: 2, category: "physical" },
  { text: "Wrap one arm around each other's shoulders for 15 seconds.", level: 2, category: "physical" },
  { text: "Press palms together and hold for 10 seconds.", level: 2, category: "physical" },
  { text: "Rest your head on your partner’s shoulder for 20 seconds.", level: 2, category: "physical" },
  { text: "Sit cross-legged facing each other, knees touching, for 15 seconds.", level: 2, category: "physical" },
  { text: "Place your hand gently on your partner’s cheek for 10 seconds.", level: 2, category: "physical" },
  { text: "Hug your partner for 10 seconds.", level: 2, category: "physical" },
  { text: "Stand toe to toe and breathe in sync for 15 seconds.", level: 2, category: "physical" },

  // PHYSICAL: LEVEL 3 (intimate, longer, close contact)
  { text: "Stand forehead to forehead and stay like that until the end of your next prompt.", level: 3, category: "physical" },
  { text: "Hold your partner’s face gently with both hands and maintain eye contact until the end of your next prompt.", level: 3, category: "physical" },
  { text: "Hold pinkies and don’t break contact until the end of your next prompt.", level: 3, category: "physical" },
  { text: "Sit back-to-back and try to stand up together.", level: 3, category: "physical" },
  { text: "Sit between your partner’s legs and lean back into them for 30 seconds.", level: 3, category: "physical" },
  { text: "Press your chests together and hold in silence for 30 seconds.", level: 3, category: "physical" },
  { text: "Wrap your arms around each other and sway gently for 30 seconds.", level: 3, category: "physical" },
  { text: "Place a hand on your partner’s heart and hold until the end of your next prompt.", level: 3, category: "physical" },
  { text: "Lay your head on your partner’s shoulder and close your eyes for 30 seconds.", level: 3, category: "physical" },
  { text: "Touch each other’s faces with both hands and close your eyes for 30 seconds.", level: 3, category: "physical" },

  // PHYSICAL: LEVEL 4 (extreme, very intimate or boundary-pushing)
  { text: "Sit in your partner’s lap, facing them, and hold eye contact until the end of your next prompt.", level: 4, category: "physical" },
  { text: "Let your partner rest their head on your chest, both arms around each other, until the end of your next prompt.", level: 4, category: "physical" },
  { text: "Place your hand under your partner’s shirt on their back and hold for 20 seconds.", level: 4, category: "physical" },
  { text: "Whisper something intimate into your partner’s ear, and hold hands until the end of your next prompt.", level: 4, category: "physical" },
  { text: "Lie down together, your head resting on your partner’s stomach, until the end of your next prompt.", level: 4, category: "physical" },
  { text: "Let your partner place their hand on your bare stomach or chest until the end of your next prompt.", level: 4, category: "physical" },
  { text: "Maintain full body contact (hugging, standing, or lying down) until the end of your next prompt.", level: 4, category: "physical" },
  { text: "Hold your partner’s hand with full attention for one full minute without looking away.", level: 4, category: "physical" },
  { text: "Gently trace the outline of your partner’s hand with your finger. Stop anytime if uncomfortable.", level: 4, category: "physical" },
  { text: "Hold a gentle embrace with your partner indefinitely for as long as feels comfortable.", level: 4, category: "physical" },

  // GAME: LEVEL 1 (playful, silly, low-stakes)
  { text: "Role-play meeting for the first time at a coffee shop—be silly or awkward.", level: 1, category: "game" },
  { text: "Pretend you’re on a 10-second speed date; try to impress each other!", level: 1, category: "game" },
  { text: "Take turns making the silliest face you can; partner must try not to laugh.", level: 1, category: "game" },
  { text: "Have a contest: who can balance on one foot the longest while making eye contact?", level: 1, category: "game" },
  { text: "Mirror each other's movements for 30 seconds—one leads, one follows.", level: 1, category: "game" },
  { text: "One person mimes an object; the other must guess and then mime something back.", level: 1, category: "game" },
  { text: "Take turns doing your best fake sneeze. Partner must rate it 1–10.", level: 1, category: "game" },
  { text: "Each say your favorite animal, then act it out together for 10 seconds.", level: 1, category: "game" },
  { text: "Count to 20 together out loud, alternating numbers as fast as you can.", level: 1, category: "game" },
  { text: "Have a 10-second thumb war, then switch hands and do it again.", level: 1, category: "game" },

  // GAME: LEVEL 2 (creative, improv, light emotional)
  { text: "Role-play being on your second date and discovering you share a surprising hobby.", level: 2, category: "game" },
  { text: "Take turns pretending you are giving the other person the best compliment you can imagine.", level: 2, category: "game" },
  { text: "Act out the moment one person asks the other to be exclusive—keep it sweet or silly.", level: 2, category: "game" },
  { text: "Improvise a scene wh'''ere you’re a couple arguing about what to order for dinner.", level: 2, category: "game" },
  { text: "Pretend to meet at a wedding and realize you’re seated together by accident.", level: 2, category: "game" },
  { text: "Imitate your partner’s walk or voice for 15 seconds.", level: 2, category: "game" },
  { text: "Pretend you’re a pair of famous movie characters (you choose which!) for one minute.", level: 2, category: "game" },
  { text: "One person narrates a ‘nature documentary’ about the other’s actions for 20 seconds.", level: 2, category: "game" },
  { text: "Tell a short fairy tale together, each adding one sentence at a time.", level: 2, category: "game" },
  { text: "Take turns speaking only in questions for 45 seconds.", level: 2, category: "game" },

  // GAME: LEVEL 3 (emotionally open, role-reversal, relationship improv)
  { text: "Role-play a marriage proposal—go over the top or make it awkward.", level: 3, category: "game" },
  { text: "Act out a married couple having a playful disagreement about chores.", level: 3, category: "game" },
  { text: "Improvise a lovers’ quarrel that quickly turns into laughter.", level: 3, category: "game" },
  { text: "Each share a true embarrassing story—then act out how you wish it had gone.", level: 3, category: "game" },
  { text: "Act out a scene as if you’ve just moved in together and must decide where things go.", level: 3, category: "game" },
  { text: "Act out an argument, but swap personalities (each plays the other).", level: 3, category: "game" },
  { text: "Pretend you’re old friends who haven’t seen each other in 10 years; improvise a reunion.", level: 3, category: "game" },
  { text: "For 30 seconds, communicate only with sound effects (no words).", level: 3, category: "game" },
  { text: "Role-play a flirty or dramatic scenario for one minute.", level: 3, category: "game" },
  { text: "Take turns being a robot that only does what the partner says, for 30 seconds.", level: 3, category: "game" },

  // GAME: LEVEL 4 (extreme, raw, highly vulnerable, or major acting)
  { text: "Improvise a dramatic breakup—channel all the soap opera energy you can.", level: 4, category: "game" },
  { text: "Role-play each other having a secret you don’t want to admit—then improvise a confession.", level: 4, category: "game" },
  { text: "Act out a confession of a huge secret—keep it in character.", level: 4, category: "game" },
  { text: "Play out a lovers’ reconciliation after a major argument—be as vulnerable as possible.", level: 4, category: "game" },
  { text: "Act out a moment where both of you realize you've grown apart, but try to reconnect.", level: 4, category: "game" },
  { text: "Improvise a scene where one person reveals a life-changing secret to their partner.", level: 4, category: "game" },
  { text: "Pretend you're a married couple at your 20th anniversary, sharing both your favorite and hardest memories together.", level: 4, category: "game" },
  { text: "Invent and act out the most embarrassing thing that could happen to you right now.", level: 4, category: "game" },
  { text: "Let your partner whisper something daring or vulnerable to you.", level: 4, category: "game" },
  { text: "Try mirroring each other’s breathing and subtle touch (hand, face, etc) for 30 seconds—stop if at all uncomfortable.", level: 4, category: "game" },
  { text: "Share something you’re curious about trying with the other—even if you’re not sure you’d ever do it. Pass if you want.", level: 4, category: "game" },
  { text: "Perform a silent emotional scene as two conflicted lovers, using only facial expressions.", level: 4, category: "game" },
  { text: "Roleplay a tense farewell between two close friends who don’t want to say goodbye.", level: 4, category: "game" },

  // BOUNDARIES: LEVEL 1
  { text: "When it comes to new things between us, do you prefer to talk about boundaries first, or figure them out as we go?", level: 1, category: "boundaries" },
  { text: "Is the energy you bring to scenes with me what you want, or just your usual habit?", level: 1, category: "boundaries" },

  // BOUNDARIES: LEVEL 2
  { text: "Are there emotional topics you’re fine exploring with me, but would avoid in real life?", level: 2, category: "boundaries" },
  { text: "Are there emotional topics you’re okay discussing in real life with me, but would rather not explore together?", level: 2, category: "boundaries" },
  { text: "Are there types of physical interaction you’re okay with, but not outside improv?", level: 2, category: "boundaries" },
  { text: "Are there types of physical interaction you’re okay with outside this, but wouldn’t in improv?", level: 2, category: "boundaries" },
  { text: "Is there a topic or boundary that you always want to be the one to initiate or decide between us?", level: 2, category: "boundaries" },
  { text: "Is there anything you’d be uncomfortable seeing in a group scene right now?", level: 2, category: "boundaries" },
  { text: "Is there any physical or emotional topic you wouldn’t want to do with me right now?", level: 2, category: "boundaries" },

  // BOUNDARIES: LEVEL 3
  { text: "Is there any physical or emotional topic that is completely off-limits for you, ever?", level: 3, category: "boundaries" },
  { text: "Have you ever not spoken up when you wanted to set a boundary with me?", level: 3, category: "boundaries" },
  { text: "Has something between us ever made you question what boundaries you want with me?", level: 3, category: "boundaries" },
  { text: "Is there a line you’re worried you or I might cross?", level: 3, category: "boundaries" },
];

const categories = ["question", "physical", "game", "boundaries"];
const levels = [1, 2, 3, 4];

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
    question: "text-blue-600",
    physical: "text-pink-600",
    game: "text-green-600",
    boundaries: "text-purple-600",
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
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f3f4f6" }}
    >
      <div style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem", position: "sticky", top: 0, zIndex: 10 }}>
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
            <div key={`header-${lvl}`} style={{ textTransform: "capitalize" }}>{`Level ${lvl}`}</div>
          ))}
          {categories.map((cat) => (
            <React.Fragment key={`cat-header-${cat}`}>
              <div style={{ fontWeight: "700", textTransform: "capitalize" }}>{cat}</div>
              {levels.map((lvl) => {
                if (!prompts.some((p) => p.category === cat && p.level === lvl)) return null;
                const key = `${cat}:${lvl}`;
                const active = activeCombos.has(key);
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
                      border: active ? "2px solid #2563eb" : "1px solid #d1d5db",
                      backgroundColor: active ? "#2563eb" : "white",
                      color: active ? "white" : "#4b5563",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      userSelect: "none",
                    }}
                    aria-pressed={active}
                    title={`Toggle ${cat} Level ${lvl}`}
                  >
                    {active ? "✓" : "✕"}
                  </button>
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
            <h1 style={{ fontSize: "2rem", fontWeight: "600", color: "#1f2937", maxWidth: "40rem" }}>
              {currentPrompt.text}
            </h1>
            <p
              style={{
                marginTop: "1rem",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.05em",
                color: categoryColors[currentPrompt.category] || "#6b7280",
              }}
            >
              {currentPrompt.category} · Level {currentPrompt.level}
            </p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#9ca3af", userSelect: "text" }}>
              (Click anywhere or press Enter/Space to see another prompt)
            </p>
          </>
        ) : (
          <p style={{ color: "#6b7280", marginTop: "1.5rem", userSelect: "text" }}>
            No prompts available for the selected filters.
          </p>
        )}
      </main>
    </div>
  );
}
