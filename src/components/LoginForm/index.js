import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginFrom extends Component {
  state = {username: '', password: '', errorShow: false, errorMsg: ''}

  onSubmit = JwtToken => {
    Cookies.set('jwt_token', JwtToken, {expires: 30, path: '/'})
    const {history} = this.props
    history.replace('/')
  }

  failureMsg = errorMsg => {
    this.setState({errorShow: true, errorMsg})
  }

  registrationUser = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmit(data.jwt_token)
    } else {
      this.failureMsg(data.error_msg)
    }
  }

  userRegistrationName = event => {
    this.setState({username: event.target.value})
  }

  userPassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {errorMsg, username, password, errorShow} = this.state
    const JwtToken = Cookies.get('jwt_token')

    if (JwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="log-in-container">
        <form className="card" onSubmit={this.registrationUser}>
          <div className="loginIconContainer">
            <img
              className="Login-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
              alt="website logo"
            />
          </div>
          <label htmlFor="username" className="labelText">
            USERNAME
          </label>
          <br />
          <div className="inputContainer">
            <input
              value={username}
              className="inputStyle"
              type="text"
              id="username"
              placeholder="Username"
              onChange={this.userRegistrationName}
            />
          </div>
          <br />
          <label htmlFor="password" className="labelText">
            PASSWORD
          </label>
          <br />
          <div className="inputContainer">
            <input
              value={password}
              className="inputStyle"
              type="password"
              id="password"
              placeholder="Password"
              onChange={this.userPassword}
            />
          </div>
          <br />
          {errorShow && <p className="error-msg">*{errorMsg}</p>}
          <button type="submit" className="loginBtn">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default LoginFrom
