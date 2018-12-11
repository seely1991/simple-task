import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faChevronRight, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//make a delete list button

class Profile extends Component {
  constructor(props) {
    super(props);
    this.newProject=this.newProject.bind(this);
    this.state = {
      userData: this.props.userData
    };
  }
  logout() {
    window.localStorage.removeItem('token');
    window.location = "/";
  }
  newProject() {
    let token = this.props.token;
    let body = {

    }
    fetch('/create-new', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      window.location = '/project/' + encodeURIComponent(token) + '/' + encodeURIComponent(res.listId);
    })
    
  }
  componentDidMount() {
    fetch('/me', {
      headers: {
        'x-access-token': this.props.token
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.projects) {
        console.log({didMount: "making state userData", userData: res})
        this.setState({userData: res})
      }
    })
  }
  render() {
    let projects = this.state.userData.projects.map(x => (
        <a className="project-link" href={'/project/' + encodeURIComponent(this.props.token) + '/' + encodeURIComponent(x._id)}>
          <p className="project-name">{x.title}</p>
          <p className="project-date">{(new Date(x.updated)).toLocaleDateString().replace(/\//g,'.')}</p>
        </a>
      ));
    if (this)
    return (
      <div>
        <div className="user-letter" style={{backgroundColor: this.state.userData.profileColor}}>{this.state.userData.name[0].toUpperCase()}</div>
        <div className="user-email-and-logout">
          <div className="user-email">{this.state.userData.email}</div>
          <button className="logout" onClick={this.logout}>Logout</button>
        </div>
        <p className="your-projects">Your projects</p>
        <div className="project-list">
          <p className="project-name-col">Name</p><p className="project-date-col">last Updated</p>
          {projects}
          <button className="new-project" onClick={this.newProject}><div className="plus-circle" /><p>New Project</p></button>
        </div>
      </div>
    )
  }
}

export default Profile;