import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { generate_get_options_auth, generate_post_options_auth } from '../generateRequestOptions'
import handleResponse from '../helpers/handleResponse'

const chordsAdapter = createEntityAdapter({
  selectId: (chord) => chord._id
})

export const addNewChord = createAsyncThunk(
  'chords/addNewChord',
  async (chord, thunkAPI) => {
    const response = await fetch('/fretstore/create', 
      generate_post_options_auth(chord)
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

export const fetchUserChords = createAsyncThunk(
  'chords/fetchChords',
  async (input, thunkAPI) => {
    const response = await fetch('/fretstore/list', 
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

export const fetchChords = createAsyncThunk(
  'chords/fetchChords',
  async (input, thunkAPI) => {
    const response = await fetch('/fretstore/list', 
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
  },
  extraReducers: {
    [addNewChord.fulfilled]: (state, action) => {
      chordsAdapter.upsertOne(state, action.payload)
    },
    [fetchChords.fulfilled]: (state, action) => {
      chordsAdapter.upsertMany(state, action.payload)
    }
  }
})

export default chordsSlice.reducer

export const {
  selectAll: selectAllChords,
  selectById: selectChordById,
  selectIds: selectChordIds
} = chordsAdapter.getSelectors(state => state.chords)