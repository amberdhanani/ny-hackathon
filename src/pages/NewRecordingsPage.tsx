import React from 'react'
import NavBar from '../NavBar'
import NewRecordingContainer from '../components/newRecordings/NewRecordingContainer'

const NewRecordingsPage = () => {
  return (
    <div><NavBar title="New Recordings" />
      <NewRecordingContainer />
    </div>
  )
}

export default NewRecordingsPage