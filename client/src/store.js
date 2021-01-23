import { configureStore } from '@reduxjs/toolkit'

import chordsReducer from './features/chords/chordsSlice'
import userReducer from './features/user/userSlice'
import alertReducer from './features/alert/alertSlice'

export default configureStore({
  reducer: {
    chords: chordsReducer,
    user: userReducer,
    alert: alertReducer,
  }
})