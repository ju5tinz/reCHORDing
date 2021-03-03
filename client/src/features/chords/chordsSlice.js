import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { generate_get_options_auth, generate_post_options_auth } from '../generateRequestOptions'
import handleResponse from '../helpers/handleResponse'
import { addCurrGroup } from '../chords/chordGroupsSlice'

const chordsAdapter = createEntityAdapter({
  selectId: (chord) => chord._id
})

export const addNewChord = createAsyncThunk(
  'chords/addNewChord',
  async (chord, thunkAPI) => {
    const groupId = thunkAPI.getState().chordGroups.currGroup._id
    const response = await fetch('/fretstore/add', 
      generate_post_options_auth({chord, groupId})
    )
    
    return await handleResponse(response).then(
      (data) => {
        return data;
      },
      (err) => {
        return thunkAPI.rejectWithValue()
      }
    )
  }
)

export const removeChord = createAsyncThunk(
  'chords/removeChord',
  async (chordId, thunkAPI) => {
    const response = await fetch(`/fretstore/remove?chordId=${chordId}`,
      generate_get_options_auth()
    )

    return await handleResponse(response).then(
      (data) => {
        return data.removedId;
      },
      (err) => {
        return thunkAPI.rejectWithValue()
      }
    )
  }
)

export const fetchUserChords = createAsyncThunk(
  'chords/fetchUserChords',
  async (input, thunkAPI) => {
    const currGroupRes = await fetch('/chordgroup/getCurr',
      generate_get_options_auth()
    )

    await handleResponse(currGroupRes).then(
      (group) => {
        thunkAPI.dispatch(addCurrGroup(group))
      },
      (err) => {
        return thunkAPI.rejectWithValue()
      }
    )

    const groupId = thunkAPI.getState().chordGroups.currGroup._id

    const chordRes = await fetch(`/fretstore/chords?groupId=${groupId}`, 
      generate_get_options_auth()
    )

    return await handleResponse(chordRes).then(
      (data) => {
        return data
      },
      (err) => {
        return thunkAPI.rejectWithValue()
      }
    )
  }
)

export const fetchRecentChords = createAsyncThunk(
  'chords/fetchRecentChords',
  async (input, thunkAPI) => {
    const response = await fetch('/fretstore/recent', 
      generate_get_options_auth()
    )

    return await handleResponse(response).then(
      (data) => {
        return data
      },
      (err) => {
        return thunkAPI.rejectWithValue()
      }
    )
  }
)

const chordsSlice = createSlice({
  name: 'chords',
  initialState: chordsAdapter.getInitialState(),
  reducers: {
    clearChords: state => {
      chordsAdapter.removeMany(state, state.ids)
    }
  },
  extraReducers: {
    [addNewChord.fulfilled]: (state, action) => {
      chordsAdapter.upsertOne(state, action.payload)
    },
    [removeChord.fulfilled]: (state, action) => {
      chordsAdapter.removeOne(state, action.payload)
    },
    [fetchRecentChords.fulfilled]: (state, action) => {
      chordsAdapter.upsertMany(state, action.payload)
    },
    [fetchUserChords.fulfilled]: (state, action) => {
      chordsAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { clearChords } = chordsSlice.actions

export const {
  selectAll: selectAllChords,
  selectById: selectChordById,
  selectIds: selectChordIds
} = chordsAdapter.getSelectors(state => state.chords)

export default chordsSlice.reducer