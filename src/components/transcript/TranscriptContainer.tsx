import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedTranscriptAtom } from '../../recoil/atoms'
import { Grid2 } from '@mui/material'
import { TranscriptEntry } from '../../types/types'

const TranscriptContainer = () => {
  const [selectedTranscriptEntry, setSelectedTranscriptEntry] = useState <TranscriptEntry | null>(null)
  console.log("Rendering TranscriptContainer...");
  const [selectedTranscript, setSelectedTranscript] = useRecoilState(selectedTranscriptAtom);
  console.log("Selected Transcript:", selectedTranscript);
  const handleClick = (entry:TranscriptEntry) => {
    setSelectedTranscriptEntry(entry)
  }
  return (
    <div>
      <Grid2 container>
        <Grid2 size= {{xs: 12, sm: 6}}>
    <h3>Transcript:</h3>
    <div style={styles.container}>
      {selectedTranscript?.sentences.map((entry, index) => (
        <div
          key={index}
          onClick={() => handleClick(entry)}
          style={{
            ...styles.sentence,
            ...(entry.userLabel === 'teacher'
              ? styles.teacher
              : styles.student),
          }}
          className="transcript-sentence"
        >
          <span style={styles.label}>{entry.userLabel}:</span>{' '}
          <span style = {entry.flag==="negative"?styles.negativeText:entry.flag==="positive"? styles.positiveText:styles.text}>
          {entry.transcribed}
          </span>
        </div>
      ))}
      {/* Inline style for hover effect */}
      <style>{`
    .transcript-sentence:hover {
      text-decoration: underline;
    }
  `}</style>
    </div>
    </Grid2>
    <Grid2 size= {{xs: 12, sm: 6}}>
    <h3>Analysis:</h3>
    <div>
      {selectedTranscriptEntry && (
        <div>
          <div>
            {selectedTranscriptEntry.transcribed}
          </div>
          <div>
            {selectedTranscriptEntry.flagDetails?.tryInstead}
          </div>
          <div>
            {selectedTranscriptEntry.flagDetails?.why}
          </div>
      </div>
      )}
    </div>

    </Grid2>
    </Grid2>
  </div>
  )
}

export default TranscriptContainer

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    margin: '20px',
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
};