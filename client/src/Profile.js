import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faChevronRight, faCog, faBars, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

library.add(faMinusCircle)
//make a delete list button

class Profile extends Component {
  constructor(props) {
    super(props);
    this.newProject=this.newProject.bind(this);
    this.state = {
      userData: this.props.userData
    };
    this.newProject=this.newProject.bind(this);
    this.deleteProject=this.deleteProject.bind(this);
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
  deleteProject(projectId) {
    console.log({id: projectId})
    const confirmed = window.confirm("You are about to delete this project permanently. \nDo you wish to continue?");
    if (confirmed) {
      fetch('/delete-project', {
        method: 'PUT',
        headers: {
          'x-access-token': this.props.token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: projectId})
      })
      .then(res => res.json())
      .then(res => this.setState({userData: res.userData}))
      if (projectId === this.props.projectId) {window.location = "/"};
    }
  }
  render() {
    let projects = this.state.userData.projects.map(x => (
        <div className="project-link">
          <a className="project-name" href={'/project/' + encodeURIComponent(this.props.token) + '/' + encodeURIComponent(x._id)}>{x.title}</a>
          <a className="project-date" href={'/project/' + encodeURIComponent(this.props.token) + '/' + encodeURIComponent(x._id)}>{(new Date(x.updated)).toLocaleDateString().replace(/\//g,'.')}</a>
          <button className="delete-project" onClick={() => this.deleteProject(x._id)}><FontAwesomeIcon icon="trash" /></button>
        </div>
      ));
    return (
      <div>
        <div className="user-letter" style={{backgroundColor: this.state.userData.profileColor}}>{this.state.userData.name[0].toUpperCase()}</div>
        <div className="user-email-and-logout">
          <div className="user-email">{this.state.userData.email}</div>
          <button className="logout" onClick={this.logout}>Logout</button>
        </div>
        <p className="your-projects">Your projects</p>
        <div className="project-list">
          <div className="project-link">
            <p className="project-name-col">Name</p><p className="project-date-col">last Updated</p>
          </div>
          {projects}
          <button className="new-project" onClick={this.newProject}><div className="plus-circle" /><p>New Project</p></button>
        </div>
      </div>
    )
  }
}

export default Profile;