import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'
import { useRecoilState } from 'recoil'
import { selectedTranscriptAtom } from '../../recoil/atoms'
import { Grid } from '@mui/material'
import { TranscriptEntry } from '../../types/types'

const TranscriptContainer = () => {
  const [selectedTranscriptEntry, setSelectedTranscriptEntry] = useState<TranscriptEntry | null>(null)
  console.log("Rendering TranscriptContainer...");
  const [selectedTranscript, setSelectedTranscript] = useRecoilState(selectedTranscriptAtom);
  console.log("Selected Transcript:", selectedTranscript);

  const handleClick = (entry: TranscriptEntry) => {
    setSelectedTranscriptEntry(entry)
  }

  return (
    <div style={styles.pageContainer}>
      <Grid container spacing={3}>
        {/* Transcript Section */}
        <Grid item xs={12} sm={6}>
          <h3 style={styles.header}>Transcript:</h3>
          <div style={styles.transcriptContainer}>
            {selectedTranscript?.sentences.map((entry, index) => (
              <div
                key={index}
                onClick={() => handleClick(entry)}
                style={{
                  ...styles.sentence,
                  ...(entry.userLabel === 'teacher' ? styles.teacher : styles.student),
                }}
                className="transcript-sentence"
              >
                <span style={styles.label}>{entry.userLabel}:</span>{' '}
                <span style={entry.flag === "negative" ? styles.negativeText : entry.flag === "positive" ? styles.positiveText : styles.text}>
                  {entry.transcribed}
                </span>
              </div>
            ))}
            <style>{`
              .transcript-sentence:hover {
                text-decoration: underline;
              }
            `}</style>
          </div>
        </Grid>

        {/* Analysis Section */}
        <Grid item xs={12} sm={6}>
          <h3 style={styles.header}>Analysis:</h3>
          <div>
            {selectedTranscriptEntry && (
              <div style={styles.analysisContainer}>
                {/* Your Language Section */}
                <div style={styles.section}>
                  <h4 style={styles.sectionHeader}>Your Language</h4>
                  <p style={styles.sectionText}>{selectedTranscriptEntry.transcribed}</p>
                </div>

                {/* Try Instead Section */}
                <div style={styles.section}>
                  <h4 style={styles.sectionHeader}>Try Instead</h4>
                  <p style={styles.sectionText}>{selectedTranscriptEntry.flagDetails?.tryInstead}</p>
                </div>

                {/* Why This Can Be Improved Section */}
                <div style={styles.section}>
                  <h4 style={styles.sectionHeader}>Why This Can Be Improved</h4>
                  <p style={styles.sectionText}>{selectedTranscriptEntry.flagDetails?.why}</p>
                </div>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default TranscriptContainer

// Load Google Font Nunito in index.html or global CSS
// <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&display=swap" rel="stylesheet">

const styles = {
  pageContainer: {
    fontFamily: "'Nunito', sans-serif",
    padding: '20px',
  },
  transcriptContainer: {
    display: 'flex',
    width: '627px',
    height: '440px',
    padding: '24px',
    flexDirection: 'column' as const, // ✅ Explicitly typed
    justifyContent: 'center' as const, // ✅ Explicitly typed
    alignItems: 'center' as const, // ✅ Explicitly typed
    gap: '10px',
    flexShrink: 0,
    borderRadius: '8px',
    border: '2px solid #CBCEE1',
    background: '#FFF',
    boxShadow: '0px 4px 10px rgba(185, 185, 185, 0.15)',
    overflowY: 'auto' as "auto", // ✅ Fix: Explicitly typed
  },
  sentence: {
    marginBottom: '10px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'text-decoration 0.2s',
  },
  teacher: {
    backgroundColor: '#f0f8ff',
    borderLeft: '3px solid #1e90ff',
    paddingLeft: '10px',
  },
  student: {
    backgroundColor: '#fff8dc',
    borderLeft: '3px solid #ffa500',
    paddingLeft: '10px',
  },
  label: {
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
  },
  negativeText: {
    color: 'red',
  },
  positiveText: {
    color: 'green',
  },
  analysisContainer: {
    fontFamily: "'Nunito', sans-serif",
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#CBCEE1', // Light purple
    borderRadius: '8px', // Rounded corners
    boxShadow: '0px 4px 6px #1E1F3B', // Dark shadow for popout effect
  },
  section: {
    marginBottom: '20px', // Adds spacing between sections
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '5px',
    textTransform: 'uppercase' as const, // ✅ Fix: Explicitly define textTransform type
  },
  sectionText: {
    fontSize: '14px',
    color: '#333',
  },
  header: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '700',
    fontSize: '18px',
  },
};
