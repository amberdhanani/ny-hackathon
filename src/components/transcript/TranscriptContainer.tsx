import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { db } from '../../firebaseConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedTranscriptAtom } from '../../recoil/atoms'

const TranscriptContainer = () => {
  console.log("Rendering TranscriptContainer...");
  //const [selectedTranscript, setSelectedTranscript] = useRecoilState(selectedTranscriptAtom);
  //console.log("Selected Transcript:", selectedTranscript);
  return (
    <div>TranscriptContainer</div>
  )
}

export default TranscriptContainer