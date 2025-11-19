import React from "react";
import "./MemoryCard.css";

// PUBLIC_INTERFACE
function MemoryCard({ card, onClick, isFlipped, isMatched, disabled }) {
  /**
   * Renders a single memory card with flip animation.
   * 
   * Props:
   * - card: { id, emoji }
   * - onClick: function called when the card is clicked
   * - isFlipped: boolean; whether to show the card emoji
   * - isMatched: boolean; whether the card is matched (remains revealed)
   * - disabled: boolean; disables click during animations
   */

  const handleClick = () => {
    if (!isFlipped && !isMatched && !disabled) {
      onClick();
    }
  };

  return (
    <button
      className={`memory-card${isFlipped || isMatched ? " flipped" : ""}${isMatched ? " matched" : ""}`}
      onClick={handleClick}
      disabled={isFlipped || isMatched || disabled}
      aria-label={isFlipped || isMatched ? `Card ${card.emoji}` : "Hidden card"}
      tabIndex={isMatched ? -1 : 0}
      type="button"
    >
      <span className="memory-card-inner">
        <span className="memory-card-front" />
        <span className="memory-card-back">{card.emoji}</span>
      </span>
    </button>
  );
}

export default MemoryCard;
