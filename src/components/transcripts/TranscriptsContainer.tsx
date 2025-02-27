import { collection, getDocs } from 'firebase/firestore'
import React, { use, useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'
import { TranscriptRecord } from '../../types/types'
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedTranscriptAtom } from '../../recoil/atoms'
import { useNavigate } from 'react-router-dom'

const TranscriptsContainer = () => {
    const setSelectedTranscript = useSetRecoilState(selectedTranscriptAtom)
    const [transcripts, setTranscripts] = useState<TranscriptRecord[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTranscripts = async () => {
            const colRef = collection(db, 'transcripts')
            const snapshot = await getDocs(colRef)
            const tempTranscripts = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }) as TranscriptRecord)
            setTranscripts(tempTranscripts)
        }
        fetchTranscripts()
    }, [])

    const handleViewClick = (transcript: TranscriptRecord) => {
        console.log(transcript)
        setSelectedTranscript(transcript)
        navigate('/transcript')
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <TableContainer component={Paper} style={{ maxWidth: 800 }}>
                <Table>
                    {/* Table Header */}
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"><strong>Date</strong></TableCell>
                            <TableCell align="left"><strong>Title</strong></TableCell>
                            <TableCell align="left"><strong>Recommendations</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {transcripts.map(transcript => (
                            <TableRow key={transcript.id}>
                                <TableCell align="left">{'N/A'}</TableCell>
                                <TableCell align="left">{transcript.title}</TableCell>
                                <TableCell align="left">{'No recommendations'}</TableCell>
                                <TableCell align="right">
                                    {/* Action Icons */}
                                    <IconButton onClick={() => handleViewClick(transcript)} title="View">
                                        <img src="/view-eyeball.svg" alt="View" width="24" height="24" />
                                    </IconButton>
                                    <IconButton title="Download">
                                        <img src="/download-icon.svg" alt="Download" width="24" height="24" />
                                    </IconButton>
                                    <IconButton title="Delete">
                                        <img src="/trash.svg" alt="Delete" width="24" height="24" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TranscriptsContainer