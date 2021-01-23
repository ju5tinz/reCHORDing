import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { registerUser } from '../features/user/userSlice'

class RegisterPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        username: "",
        password: "",
        retypepassword: "",
      },
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  isFilled() {
    const { user } = this.state

    return(
      !(user.username === "" ||
      user.password === "" ||
      user.retypepassword === "" ||
      user.password !== user.retypepassword)
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
      this.props.registerUser({
        user: {
          username: this.state.user.username, 
          password: this.state.user.password,
        },
        history: this.props.history,
      })
    }
  }


  render() {
    if(this.props.loggedIn) {
      this.props.history.push('/')
    }
    return(
      <div className="centered">
        <h1>Register</h1>
        <form className='register-form' onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            name="username"
            onChange={this.handleChange}
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="password"
            onChange={this.handleChange}
          />
          <input 
            type="password" 
            placeholder="Re-type Password" 
            name="retypepassword"
            onChange={this.handleChange}
          />
          <input
            type="submit"
            value="Submit"
            disabled={!this.isFilled()}
          />
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (user) => dispatch(registerUser(user))
  }
}

const mapStateToProps = (state) => {

  return {
    loggedIn: state.user.username ? true : false
  }
}

const RegisterPageWithRouter = withRouter(RegisterPage)
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPageWithRouter)