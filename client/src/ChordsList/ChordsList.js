import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FretboardDisplay from '../Fretboard/FretboardDisplay'
import { selectChordIds, removeChord } from '../features/chords/chordsSlice'

const ChordsList = () => {
  const chordIds = useSelector(selectChordIds)

  const dispatch = useDispatch()

  const content = chordIds.map(chordId => (
    <div className="chord-item-ctn" key={chordId}>
      <FretboardDisplay
        width="100"
        height="200"
        numStrings="6"
        numFrets="6"
        chordId={chordId}
      />
      <button type='button' onClick={() => {dispatch(removeChord(chordId))}}>Remove</button>
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