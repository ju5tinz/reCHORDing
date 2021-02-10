import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logoutUser } from '../features/user/userSlice'

import Login from '../Login/Login'

const Header = () => {
  const username = useSelector(state => state.user.username)
  
  const loggedIn = username ? true : false

  return(
    <div className='header noprint'>
      <Link to={'/'} className='header-name'>ChordStore</Link>
      { !loggedIn
        ? <div className='header-right'>
            <Login />
            <Link to={'/register'}>Register</Link>
          </div>

        : <div className='header-right'>
            {"User: " + username}
            <LogoutButton />
          </div>
      }
    </div>
  )
}

const LogoutButton = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  return(
    <button onClick={() => dispatch(logoutUser({history}))}>
      Logout
    </button>
  )
}

export default Header