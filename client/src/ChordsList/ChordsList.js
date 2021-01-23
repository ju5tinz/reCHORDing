import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FretboardDisplay from '../Fretboard/FretboardDisplay'
import { fetchChords, fetchUserChords, selectChordIds } from '../features/chords/chordsSlice'

const ChordsList = () => {
  const dispatch = useDispatch()
  const chordIds = useSelector(selectChordIds)
  
  const username = useSelector(state => state.user.username)
  const loggedIn = username ? true : false

  useEffect(() => {
    if(loggedIn)
      dispatch(fetchUserChords())
    else
      dispatch(fetchChords())
  }, [dispatch])

  //const chords = useSelector(selectAllChords)

  const content = chordIds.map(chordId => (
    <FretboardDisplay
      width="100"
      height="200"
      numStrings="6"
      numFrets="6"
      chordId={chordId}
    />
  ))

  return(
    <React.Fragment>
      <h2>Chord List:</h2>
      <div className="chord-list">
        {content}
      </div>
    </React.Fragment>
  )
}

export default ChordsList