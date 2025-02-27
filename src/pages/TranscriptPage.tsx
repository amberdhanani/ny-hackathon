import React from 'react'
import NavBar from '../NavBar'
import TranscriptContainer from '../components/transcript/TranscriptContainer'

const TranscriptPage = () => {
  return (
    <div style={{width:"100%", height:"100vh", backgroundColor: "#EBEBF5"}}><NavBar title="Transcript" />
    <TranscriptContainer />
        </div>
  )
}

export default TranscriptPage