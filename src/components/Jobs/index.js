import {Component} from 'react'

import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Header from '../Header'

import JobProfile from '../JobProfile'

import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Jobs extends Component {
  state = {
    technologies: [],
    type: [],
    salary: '',
    search: '',
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatus.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {salaryRange, employmentType, searchInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatus.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatus.failure,
      })
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeyDown = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="profile-type-salary">
          <JobProfile />
          <hr className="h-line" />
          <h1 className="selectHeading">Type of Employment</h1>

          <ul className="u-list">
            {employmentTypesList.map(each => (
              <li className="checkBox list" key={each.employmentTypeId}>
                <input
                  className="check"
                  value={each.employmentTypeId}
                  id={each.employmentTypeId}
                  type="checkbox"
                  onChange={this.updateType}
                />
                <label
                  htmlFor={each.employmentTypeId}
                  className="subSelectItem"
                >
                  {each.label}
                </label>
              </li>
            ))}
          </ul>
          <hr className="h-line" />
          <h1 className="selectHeading">Salary Range</h1>
          <ul className="u-list">
            {salaryRangesList.map(salary => (
              <li className="checkBox list" key={salary.salaryRangeId}>
                <input
                  className="check"
                  name="salary"
                  id={salary.salaryRangeId}
                  type="radio"
                  value={salary.salaryRangeId}
                  onChange={this.updateSalary}
                />
                <label htmlFor={salary.salaryRangeId} className="subSelectItem">
                  {salary.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="inputContainer">
            <input
              type="search"
              className="input"
              placeholder="search"
              onChange={this.searchInput}
              onKeyDown={this.onEnterKey}
            />
            <button
              className="searchBtn"
              type="button"
              onClick={this.searchData}
              testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>

          <JobCard />
        </div>
      </div>
    )
  }
}
export default Jobs
