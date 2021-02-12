import React from 'react'
import { useSelector } from 'react-redux'

import FretboardDisplay from '../Fretboard/FretboardDisplay'
import { selectChordIds } from '../features/chords/chordsSlice'

const ChordsList = () => {
  const chordIds = useSelector(selectChordIds)

  //const chords = useSelector(selectAllChords)

  const content = chordIds.map(chordId => (
    <div className="chord-item-ctn">
      <FretboardDisplay
        width="100"
        height="200"
        numStrings="6"
        numFrets="6"
        chordId={chordId}
      />
    </div>
  ))

  return(
    <React.Fragment>
      <div className="chord-list">
        {content}
      </div>
    </React.Fragment>
  )
}

export default ChordsList