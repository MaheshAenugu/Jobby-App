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
  state = {profile: {}, profileStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.userProfile()
  }

  userProfile = async () => {
    this.setState({profileStatus: apiStatusConstants.inProgress})
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
      this.setState({
        profile: updateProfile,
        profileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileStatus: apiStatusConstants.failure})
    }
  }

  render() {
    const {profileImageUrl, name, shortBio} = this.state

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt={name} className="profile" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-para">{shortBio}</p>
      </div>
    )
  }
}
export default JobProfile
