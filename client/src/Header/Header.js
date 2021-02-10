import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logoutUser } from '../features/user/userSlice'

import Login from '../Login/Login'

import Logo from '../Icons/Logo.svg'

const Header = () => {
  const username = useSelector(state => state.user.username)
  
  const loggedIn = username ? true : false

  return(
    <div className='header noprint'>
      <Link 
        to={'/'} 
        className='header-name'
        style={{ backgroundImage: `url(${Logo})`}}></Link>
      { !loggedIn
        ? <div className='header-right'>
            <Login />
            <Link to={'/register'}>Register</Link>
          </div>

        : <div className='header-right'>
            <div>{"Welcome, " + username}</div>
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