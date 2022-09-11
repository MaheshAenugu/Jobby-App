import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdRoom} from 'react-icons/md'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SkillCard from '../SkillCard'

import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    this.setState({status: apiStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const JwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${JwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updateDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        title: data.job_details.title,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }

      const updateLifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const updateSkills = data.job_details.skills.map(skill => ({
        imageUrl: skill.image_url,
        name: skill.name,
      }))

      const updateSimilarJobs = data.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobDetails: updateDetails,
        lifeAtCompany: updateLifeAtCompany,
        skills: updateSkills,
        similarJobs: updateSimilarJobs,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  success = () => {
    const {jobDetails} = this.state

    return (
      <>
        <div className="companyContainer jobItemsContainer">
          <div className="logoContainer">
            <img
              className="jobItemLogo"
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
            />
            <div className="title-star">
              <h1 className="jobItemHeading">{jobDetails.title}</h1>
              <p className="star-container">
                <BsStarFill className="jobItemStar" />
                {jobDetails.rating}
              </p>
            </div>
          </div>
          <div className="jobDescription">
            <div className="singleLine work-location">
              <div className="jobLocationContainer ">
                <MdRoom className="jobItemLocation" />
                <p>{jobDetails.location}</p>
              </div>
              <div className="jobLocationContainer ">
                <BsFillBriefcaseFill className="jobItemLocation" />
                <p>{jobDetails.employmentType}</p>
              </div>
            </div>
            <p>{jobDetails.packagePerAnnum}</p>
          </div>
          <hr className="h-line" />
          <div className="descriptionContainer">
            <h1 className="jobItemHeading">Description</h1>
            <a
              className="browserLinkContainer"
              href={jobDetails.companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              <p>Visit</p>
              <BiLinkExternal />
            </a>
          </div>
          <p className="description">{jobDetails.jobDescription}</p>
          <SkillCard />
        </div>
        <SimilarJobCard />
      </>
    )
  }

  loading = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  failure = () => (
    <div className="noJobContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="logoutBtn retryBtn"
        onClick={this.getData}
      >
        Retry
      </button>
    </div>
  )

  getCompleteData = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.inProgress:
        return this.loading()
      case apiStatus.failure:
        return this.failure()
      case apiStatus.success:
        return this.success()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="emptyContainer">
        <Header />
        {this.getCompleteData()}
      </div>
    )
  }
}
export default JobItemDetails
