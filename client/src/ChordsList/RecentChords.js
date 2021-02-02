import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FretboardDisplay from '../Fretboard/FretboardDisplay'
import { fetchRecentChords, selectChordIds } from '../features/chords/chordsSlice'

const RecentChords = () => {
  const dispatch = useDispatch()
  const chordIds = useSelector(selectChordIds)

  useEffect(() => {
    dispatch(fetchRecentChords())
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
      <h2>Recently Added Chords:</h2>
      <div className="recent-chords">
        {content}
      </div>
    </React.Fragment>
  )
}

export default RecentChords