import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { error } from '../alert/alertSlice'
import { generate_post_options } from '../generateRequestOptions'
import { clear } from '../chords/chordsSlice'

import Cookie from 'js-cookie'

import handleResponse from '../helpers/handleResponse'

export const registerUser = createAsyncThunk(
  'user/register',
  async (input, thunkAPI) => {
    const {user, history} = input
    const response = await fetch('/user/register', 
      generate_post_options(user)
    )

    return await handleResponse(response).then(
      (data) => {
        //localStorage.setItem("user", JSON.stringify({ token: data.user.token }))
        thunkAPI.dispatch(clear())
        Cookie.set('username', user.username)
        history.push('/')
        return user.username
      }, 
      (err) => {
        thunkAPI.dispatch(error(err))
        return thunkAPI.rejectWithValue()
      }
    )
  }
)

export const loginUser = createAsyncThunk(
  'user/login',
  async (input, thunkAPI) => {
    const {user, history} = input

    const response = await fetch('/user/login', 
      generate_post_options(user)
    )

    return await handleResponse(response).then(
      (data) => {
        //localStorage.setItem("user", JSON.stringify({ token: data.user.token }))
        thunkAPI.dispatch(clear())
        Cookie.set('username', user.username, {expires: 1})
        history.push('/')
        return user.username
      },
      (err) => {
        thunkAPI.dispatch(error(err))
        return thunkAPI.rejectWithValue()
      }
    )
  }
)

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (input, thunkAPI) => {
    const {history} = input

    const response = await fetch('/user/logout',
      generate_post_options()
    )

    return await handleResponse(response).then(
      (data) => {
        thunkAPI.dispatch(clear())
        Cookie.remove('username')
        history.push('/')
        return 
      },
      (err) => {
        thunkAPI.dispatch(error(err))
        return thunkAPI.rejectWithValue()
      }
    )
  }
)


const initialState = {
  username: Cookie.get('username') ? Cookie.get('username') : "",
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: {
    [registerUser.fulfilled]: (state, action) => {
      state.username = action.payload
    },
    [registerUser.rejected]: (state, action) => {
      state.username = ""
    },
    [loginUser.fulfilled]: (state, action) => {
      state.username = action.payload
    },
    [loginUser.rejected]: (state, action) => {
      state.username = ""
    },
    [logoutUser.fulfilled]: (state, action) => {
      state.username = ""
    },
    [logoutUser.rejected]: (state, action) => {

    }
  }
})

export default userSlice.reducer