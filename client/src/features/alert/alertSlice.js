import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  type: null,
  message: null,
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    success(state, action) {
      state.type = 'SUCCESS'
      state.message = action.payload
    },
    error(state, action) {
      state.type = 'ERROR'
      state.message = action.payload
    },
    clear(state) {
      state.type = null
      state.message = null
    }
  }
})

export const { success, error, clear } = alertSlice.actions

export default alertSlice.reducer