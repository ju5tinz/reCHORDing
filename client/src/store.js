import { configureStore } from '@reduxjs/toolkit'

import chordsReducer from './features/chords/chordsSlice'
import chordGroupsReducer from './features/chords/chordGroupsSlice'
import userReducer from './features/user/userSlice'
import alertReducer from './features/alert/alertSlice'

export default configureStore({
  reducer: {
    chords: chordsReducer,
    chordGroups: chordGroupsReducer,
    user: userReducer,
    alert: alertReducer,
  }
})