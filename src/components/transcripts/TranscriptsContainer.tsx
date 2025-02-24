import { collection, getDocs } from 'firebase/firestore'
import React, { use, useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'
import { TranscriptRecord } from '../../types/types'
import { Button } from '@mui/material'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedTranscriptAtom } from '../../recoil/atoms'
import { useNavigate } from 'react-router-dom'

const TranscriptsContainer = () => {
    const setSelectedTranscript = useSetRecoilState(selectedTranscriptAtom)
    const selectedTranscript = useRecoilValue(selectedTranscriptAtom)
    const [transcripts, setTranscripts] = useState<TranscriptRecord[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchTranscripts = async () => {
            const colRef = collection(db, 'transcripts')
            const snapshot = await getDocs(colRef) //actual call to the database
            const tempTranscripts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as TranscriptRecord) //if you just want your data, you can use doc.data() but that doesn't have the id of the document
            //... is a spread operator, it takes all the properties of the object and puts them in the new object
            setTranscripts(tempTranscripts)
        }
        fetchTranscripts()
    }, []) 
const handleClick = (transcript: TranscriptRecord) => {
    console.log(transcript)
    //setSelectedTranscript(transcript)
    navigate('/transcript') 
}

    return (
        <div>
            {transcripts.map(transcript => (
                <div key={transcript.id}>
                    <h2>{transcript.title}</h2>
                    <Button onClick= {()=>handleClick(transcript)} variant="contained" color="primary">View</Button>
                </div>
            ))}
        </div>
    )
}

export default TranscriptsContainer