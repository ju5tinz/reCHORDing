import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FretboardDisplay from '../Fretboard/FretboardDisplay'
import { fetchUserChords, selectChordIds } from '../features/chords/chordsSlice'

const ChordsList = () => {
  const dispatch = useDispatch()
  const chordIds = useSelector(selectChordIds)

  useEffect(() => {
    dispatch(fetchUserChords())
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