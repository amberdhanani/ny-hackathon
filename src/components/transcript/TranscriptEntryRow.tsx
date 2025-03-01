import { TranscriptEntry } from "../../types/types";

const TranscriptEntryRow = ({
  entry,
  showLabel,
  isSelected,
  onClick,
}: {
  entry: TranscriptEntry;
  showLabel: boolean;
  isSelected: boolean;
  onClick: (entry: TranscriptEntry) => void;
}) => {
  const labelText = entry.userLabel === "teacher" ? "Teacher" : "Student";
  const flagIcons: Record<string, string> = {
    negative: "/assets/warning.svg",
    positive: "/assets/check-circle.svg",
  };

  return (
    <div
      onClick={() => onClick(entry)}
      className="transcript-sentence"
      style={{
        ...styles.sentence,
        ...(entry.userLabel === "teacher" ? styles.teacher : styles.student),
      }}
    >
      {showLabel && <span style={styles.label}>{labelText}:</span>}{" "}
      <span
        style={{
          ...(entry.flag === "negative"
            ? styles.negativeText
            : entry.flag === "positive"
            ? styles.positiveText
            : styles.text),
          ...(isSelected ? styles.selectedSentence : {}),
        }}
      >
        {entry.transcribed}
      </span>
      {entry.flag && flagIcons[entry.flag] && (
        <img
          src={flagIcons[entry.flag]}
          alt={entry.flag === "negative" ? "warning flag" : "growth mindset flag"}
          style={styles.flagIcon}
        />
      )}
    </div>
  );
};

export default TranscriptEntryRow;

const styles = {
  text: {
    color: "black",
  },
  negativeText: {
    backgroundColor: "#FFF4E5",
    borderBottom: "1px solid #9A3412",
  },
  positiveText: {
    backgroundColor: "rgba(240, 249, 255, 1)",
    borderBottom: "1px solid rgba(7, 89, 133, 1)",
  },
  sentence: {
    marginBottom: "4px",
    padding: "10px",
    cursor: "pointer",
    transition: "text-decoration 0.2s",
    lineHeight: "1.8",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  selectedSentence: {
    fontWeight: "bold",
  },
  teacher: {
    borderLeft: "3px solid #1e90ff",
    paddingLeft: "10px",
  },
  student: {
    borderLeft: "3px solid #ffa500",
    paddingLeft: "10px",
  },
  label: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  flagIcon: {
    transform: "translateY(5px)",
    marginLeft: 4,
    display: "inline-block",
  },
};
