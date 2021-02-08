import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currGroup: {
    name: "",
    _id: ""
  }
}

const chordGroupsSlice = createSlice({
  name: 'chordGroups',
  initialState,
  reducers: {
    addCurrGroup: (state, action) => {
      state.currGroup = action.payload
    },
    clearCurrGroup: (state, action) => {
      state.currGroup.name = ""
      state.currGroup._id = ""
    }
  }
})

export const { addCurrGroup, clearCurrGroup } = chordGroupsSlice.actions

export default chordGroupsSlice.reducer