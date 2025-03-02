import React, { useState } from "react";

type Props = {
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

const AnalysisNavigation = ({ onNext, onPrevious, hasNext, hasPrevious }: Props) => {
  const [ripple, setRipple] = useState<{ left?: boolean; right?: boolean }>({});

  const handleRipple = (side: "left" | "right") => {
    setRipple({ [side]: true });
    setTimeout(() => {
      setRipple({}); // REMOVE Ripple after animation ends
    }, 300);
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "8px" }}>
      {/* Previous Button */}
      <button
        style={{
          ...buttonStyle,
          background: hasPrevious ? "white" : "#d3d3d3",
          cursor: hasPrevious ? "pointer" : "not-allowed",
        }}
        onClick={() => {
          if (hasPrevious) {
            handleRipple("left");
            onPrevious();
          }
        }}
        onMouseEnter={(e) => {
          if (hasPrevious) e.currentTarget.style.background = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          if (hasPrevious) e.currentTarget.style.background = "white";
        }}
        disabled={!hasPrevious}
      >
        <img src="/assets/arrow-left.svg" alt="Left Arrow" style={{ width: "16px" }} />
        {ripple.left && <span className="ripple-effect"></span>}
      </button>

      {/* Next Button */}
      <button
        style={{
          ...buttonStyle,
          background: hasNext ? "white" : "#d3d3d3",
          cursor: hasNext ? "pointer" : "not-allowed",
        }}
        onClick={() => {
          if (hasNext) {
            handleRipple("right");
            onNext();
          }
        }}
        onMouseEnter={(e) => {
          if (hasNext) e.currentTarget.style.background = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          if (hasNext) e.currentTarget.style.background = "white";
        }}
        disabled={!hasNext}
      >
        <img src="/assets/arrow-right.svg" alt="Right Arrow" style={{ width: "16px" }} />
        {ripple.right && <span className="ripple-effect"></span>}
      </button>

      {/* Ripple Effect Styles */}
      <style>
        {`
          .ripple-effect {
            position: absolute;
            width: 80%;
            height: 80%;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            animation: ripple 0.3s ease-out forwards;
          }

          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 0.6;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnalysisNavigation;

const buttonStyle = {
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid black",
  borderRadius: "8px",
  boxShadow: "2px 2px 0px rgba(0,0,0,0.7)",
  transition: "background 0.15s ease-in-out",
  position: "relative" as const,
};
