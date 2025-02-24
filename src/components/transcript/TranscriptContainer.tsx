import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { db } from '../../firebaseConfig'

const TranscriptContainer = () => {
  const testId= "1FZqIITJEtlvtKePeffv"
  useEffect(()=> {
    const fetchData = async () => {
      console.log("fetching data")
      const docRef= doc(db, "transcript", testId)
      const docSnap= await getDoc(docRef)
      if(docSnap.exists()) {
        console.log("Document data:", docSnap.data())
      }
    }
    fetchData()
  }, [])
  return (
    <div>TranscriptContainer</div>
  )
}

export default TranscriptContainer