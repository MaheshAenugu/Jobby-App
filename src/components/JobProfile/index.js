import {Component} from 'react'

import Cookies from 'js-cookie'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobProfile extends Component {
  state = {profile: {}, status: apiStatusConstants.initial}

  componentDidMount = () => {
    this.userProfile()
  }

  userProfile = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const profile = await response.json()

    if (response.ok === true) {
      const updateProfile = {
        name: profile.profile_details.name,
        profileImageUrl: profile.profile_details.profile_image_url,
        shortBio: profile.profile_details.short_bio,
      }
      this.setState(
        {profile: updateProfile, status: apiStatusConstants.success},
        this.languages,
      )
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  profileSuccess = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return (
      <>
        <div>
          <img width={50} src={profileImageUrl} alt="profile" />
          <h1 className="userName">{name}</h1>
        </div>
        <p className="shortBio">{shortBio}</p>
        {}
      </>
    )
  }

  profileFailure = () => (
    <div className="failureProfile">
      <button
        type="button"
        className="logoutBtn retryBtn"
        onClick={this.getProfile}
      >
        Retry
      </button>
    </div>
  )

  getProfileData = () => {
    const {status} = this.state
    switch (status) {
      case apiStatusConstants.failure:
        return this.profileFailure()
      case apiStatusConstants.success:
        return this.profileSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="profile-container">{this.getProfileData()}</div>
      </>
    )
  }
}
export default JobProfile
