import React, { useState, useEffect } from "react";
import MemoryCard from "./MemoryCard";
import "./App.css";
import "./MemoryCard.css";

// Emoji pairs for the 4x4 grid memory match game
const CARD_EMOJIS = [
  "🍎", "🚀", "🌟", "🎧", "🐶", "🌈", "⚽", "🎲"
];

// PUBLIC_INTERFACE
function shuffleDeck(emojiPairs) {
  // Returns a shuffled array of 16 card objects (8 pairs)
  const doubled = [...emojiPairs, ...emojiPairs];
  const deck = doubled
    .map((emoji, idx) => ({ id: idx + "-" + Math.random().toString(36).slice(2), emoji }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

// PUBLIC_INTERFACE
function App() {
  // State hooks
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]); // [idx1, idx2]
  const [matched, setMatched] = useState([]); // array of idx
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Effect: New game on mount
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line
  }, []);

  // Effect: check for win state
  useEffect(() => {
    if (matched.length === 16 && deck.length === 16) {
      setWon(true);
    }
  }, [matched, deck]);

  // Handler for card click
  const handleFlip = (idx) => {
    if (flipped.length === 2 || matched.includes(idx) || flipped.includes(idx) || animating) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setAnimating(true);
      setMoves(m => m + 1);

      const [i, j] = newFlipped;
      if (deck[i].emoji === deck[j].emoji) {
        // Delay before showing as matched to allow flip animation
        setTimeout(() => {
          setMatched(prev => [...prev, i, j]);
          setFlipped([]);
          setAnimating(false);
        }, 600);
      } else {
        // Flip back after a short pause
        setTimeout(() => {
          setFlipped([]);
          setAnimating(false);
        }, 950);
      }
    }
  };

  // PUBLIC_INTERFACE
  function handleReset() {
    setDeck(shuffleDeck(CARD_EMOJIS));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
    setAnimating(false);
  }

  // Styling and theme variables
  // Custom CSS vars for primary (#3b82f6) and success (#06b6d4)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-accent', '#3b82f6');
    root.style.setProperty('--success-accent', '#06b6d4');
    root.style.setProperty('--secondary-accent', '#64748b');
    root.style.setProperty('--main-text', '#111827');
    root.style.setProperty('--win-accent', '#06b6d4');
    root.style.setProperty('--button-accent', '#3b82f6');
  }, []);

  // Derived
  const gridCards =
    deck.length === 16
      ? deck.map((card, idx) => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={() => handleFlip(idx)}
            isFlipped={flipped.includes(idx) || matched.includes(idx)}
            isMatched={matched.includes(idx)}
            disabled={animating || won}
          />
        ))
      : null;

  return (
    <div className="App game-app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main className="game-main">
        <h1 className="game-title" style={{ color: "var(--primary-accent)", marginBottom: 0 }}>Memory Match Game</h1>
        <div className="game-moves" style={{ color: "var(--main-text)", margin: "12px 0 20px", fontSize: 20 }}>
          Moves: <b style={{ color: "var(--primary-accent)" }}>{moves}</b>
        </div>

        <div
          className="game-board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            justifyContent: "center",
            maxWidth: 380,
            margin: "0 auto 16px",
            padding: "8px",
            background: "#fafdfe",
            borderRadius: 18,
            boxShadow: "0 4px 48px 0 #e0eeff55",
            position: "relative"
          }}
        >
          {gridCards}
        </div>

        <div className="game-controls" style={{ margin: "0.5em auto 0", textAlign: "center" }}>
          <button
            className="game-reset-btn"
            style={{
              background: "linear-gradient(90deg, var(--primary-accent), var(--success-accent))",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 34px",
              fontWeight: 600,
              fontSize: 16,
              marginTop: "6px",
              cursor: "pointer",
              boxShadow: "0 2px 7px #06b6d454",
              transition: "opacity .18s"
            }}
            onClick={handleReset}
            tabIndex={0}
            type="button"
          >
            {won ? "Play Again" : "Reset"}
          </button>
        </div>

        {won && (
          <div className="game-win" style={{
            marginTop: "2.5em",
            background: "linear-gradient(90deg, #fff, #dffcff 90%)",
            border: "2.5px solid var(--win-accent)",
            borderRadius: 16,
            display: "inline-block",
            padding: "20px 24px",
            color: "var(--success-accent)",
            fontWeight: 700,
            fontSize: 1.25 + "rem",
            boxShadow: "0 0 10px 1px #b5fff525"
          }}>
            <span role="img" aria-label="trophy" style={{ fontSize: 32, marginRight: 10 }}>🏆</span>
            You win! Total moves: <span style={{ color: "var(--main-text)" }}>{moves}</span>
          </div>
        )}
      </main>
      <footer style={{ fontSize: 13, color: "var(--secondary-accent)", margin: "30px auto 8px", letterSpacing: ".01em" }}>
        &copy; {new Date().getFullYear()} Memory Game | KAVIA
      </footer>
    </div>
  );
}

export default App;
