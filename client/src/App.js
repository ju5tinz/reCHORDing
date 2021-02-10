import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

import { clearAlert } from './features/alert/alertSlice'
import { fetchRecentChords, fetchUserChords } from './features/chords/chordsSlice'

import FretboardFig from './Fretboard/Fretboard'
import ChordsList from './ChordsList/ChordsList'
import RecentChords from './ChordsList/RecentChords'
import Header from './Header/Header'
import RegisterPage from './RegisterPage/RegisterPage'

export function App() {
  const history = useHistory()
  const dispatch = useDispatch()
  const alert = useSelector(state => state.alert)
  const username = useSelector(state => state.user.username)
  let isLoggedIn = username ? true : false

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(clearAlert())
    })
  },[history, dispatch])

  useEffect(() => {
    isLoggedIn ? dispatch(fetchUserChords()) : dispatch(fetchRecentChords())
  },[dispatch, isLoggedIn])

  return(
    <div className="App">
      <Header/>
      {alert.type ? <Message compact>{alert.message}</Message> : null}
      <Switch>
        <Route path='/register'>
          <RegisterPage />
        </Route>
        <Route path='/'>
          {isLoggedIn ?
            <div className="user-content">
              <div className="left split noprint">
                <FretboardFig 
                  width="200"
                  height="400"
                  numStrings="6"
                  numFrets="6"
                />
              </div>
              
              <div className="right split">
                <ChordsList />
              </div>
            </div>
            : <div className="recent-chords-content">
                <RecentChords />
            </div>
          }
        </Route>
      </Switch>
    </div>
  );
}
