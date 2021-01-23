import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { loginUser } from '../features/user/userSlice'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        username: "",
        password: "",
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  isFilled() {
    const { user } = this.state

    return(
      user.username !== "" &&
      user.password !== ""
    )
  }

  handleChange(event) {
    const { name, value } = event.target
    const { user } = this.state

    this.setState({
      user: {
        ...user,
        [name]: value
      }
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    if(this.isFilled()) {
      this.props.loginUser({ 
        user: {
          username: this.state.user.username, 
          password: this.state.user.password 
        },
        history: this.props.history,
      })
    }
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Username" name="username" onChange={this.handleChange}/>
        <input type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
        <input type="submit" value="Submit" disabled={!this.isFilled()}/>
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user) => dispatch(loginUser(user))
  }
}

const LoginWithRouter = withRouter(Login)
export default connect(null, mapDispatchToProps)(LoginWithRouter)