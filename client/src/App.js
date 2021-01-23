import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { clear } from './features/alert/alertSlice'

import { Message } from 'semantic-ui-react'

import FretboardFig from './Fretboard/Fretboard'
import ChordsList from './ChordsList/ChordsList'
import Header from './Header/Header'
import RegisterPage from './RegisterPage/RegisterPage'

export function App() {
  const history = useHistory()
  const dispatch = useDispatch()
  const alert = useSelector(state => state.alert)

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(clear())
    })
  },[history, dispatch])

  return(
    <div className="App">
      <Header/>
      {alert.type ? <Message compact>{alert.message}</Message> : null}
      <Switch>
        <Route path='/register'>
          <RegisterPage />
        </Route>
        <Route path='/'>
          <div className="content">
            <div className="left split">
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
        </Route>
      </Switch>
    </div>
  );
}
