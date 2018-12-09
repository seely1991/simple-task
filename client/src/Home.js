//figure out what to do with the token

import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faChevronRight, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SignIn from './SignIn.js';

library.add(faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faChevronRight, faCog, faBars);

let randomColors = ['#EB6738', '#F0A3BA', '#949494', '#F2D197', '#DF89FD', '#8A83E1'];

function getRandomColor() {
  if (randomColors.length === 0) {
    randomColors = ['#EB6738', '#F0A3BA', '#949494', '#F2D197', '#DF89FD', '#8A83E1'];
  }
  const index = Math.floor(Math.random()*randomColors.length);
  const color = randomColors.splice(index, 1)[0];
  return color;
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
      register: false,
      profile: false
    };
    this.onChange=this.onChange.bind(this);
    this.toggleSignIn=this.toggleSignIn.bind(this);
    this.toggleRegister=this.toggleRegister.bind(this);
    this.registerSubmit=this.registerSubmit.bind(this);
    this.loginSubmit=this.loginSubmit.bind(this);
    this.logout=this.logout.bind(this);
    this.newProject=this.newProject.bind(this);
  }
  onChange(event) {
    console.log({changed: this.state})
    this.setState({[event.target.name]: event.target.value});
  }
  toggleSignIn() {
    this.setState({signIn: !this.state.signIn, register: false});
  }
  toggleRegister() {
    this.setState({signIn: false, register: !this.state.register, blackDivAnimationClass: "stretch-left"})
  }
  registerSubmit(event) {
    const body = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      profileColor: getRandomColor()
    }

    let formBody = [];
    for (var property in body) {
      console.log({[property]: body[property]})
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + '=' + encodedValue)
    };
    
    formBody = formBody.join('&');
    console.log(formBody)

    event.preventDefault();
    fetch('/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formBody
    })
    .then(res => res.text())
    .then(res => {
      console.log(res);
      res = JSON.parse(res);
      window.localStorage.setItem('token', res.token)
      this.setState({token: res.token, userData: res.userData})
      console.log({state: this.state})
    })
  }
  loginSubmit() {
    console.log({
      stateName: this.state.name,
      statePass: this.state.password
    })
    fetch('/signIn?name=' + this.state.name + '&password=' + this.state.password)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      window.localStorage.setItem('token', res.token)
      this.setState({token: res.token, userData: res.userData})
      console.log(this.state)
    })
  }
  newProject() {
    let token = this.state.token;
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
    const token = window.localStorage.getItem('token');
    if (token) {
      fetch('/me', {
        headers: {
          "x-access-token": token
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.projects) {
          this.setState({
            token: token,
            userData: res,
            profile: true
          })
        }
      })
    }
  }
  logout() {
    window.localStorage.removeItem('token');
    window.location = "/";
  }
  render() {
    let title = <h1 className="home-title">Simple<br/>Task</h1>;
    let homeButtonFn = this.toggleSignIn;
    let inputs;
    let loginButton = <button className="login-button" onClick={this.toggleSignIn} type="button"><div>Login</div></button>;
    let goToRegister;
    let blackDivAnm = "stretch-right";
    let description;
    if (!window.localStorage.getItem('token')) {
      description = (
        <p className="home-description">
          A simple list making, item creating, 
          progress tool that will help you <br/>
          organize a project from beginning to end
        </p>
      )
    }
    if (this.state.signIn || this.state.register) {
      description = null;
      blackDivAnm = "stretch-left";
    }
    let profile;
    if (this.state.signIn && !this.state.userData) {
      inputs = <SignIn toggleRegister={this.toggleRegister} onChange={this.onChange} toggleSignIn={this.toggleSignIn}/>;
      loginButton = <button className="login-button" onClick={this.loginSubmit} type="button"><FontAwesomeIcon icon="chevron-right" /></button>;
      goToRegister = <button className="go-to-register" type="button" onClick={this.toggleRegister}>register an account</button>
    }else if (this.state.register && !this.state.userData) {
      inputs = <SignIn register={true} onChange={this.onChange} toggleRegister={this.toggleRegister} />;
      loginButton = <button className="login-button" onClick={this.registerSubmit} type="button"><FontAwesomeIcon icon="chevron-right" /></button>;
    }
    if (this.state.userData) {
      console.log({state: this.state})
      console.log('buidling profile')
      title = null;
      blackDivAnm = "stretch-right-less";
      loginButton = null;
      let projects = this.state.userData.projects.map(x => (
        <a className="project-link" href={'/project/' + encodeURIComponent(this.state.token) + '/' + encodeURIComponent(x._id)}>
          <p className="project-name">{x.title}</p>
          <p className="project-date">{(new Date(x.updated)).toLocaleDateString().replace(/\//g,'.')}</p>
        </a>
      ));

      profile = (
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
            <button className="new-project" onClick={this.newProject}><FontAwesomeIcon icon="plus-circle" /><p>New Project</p></button>
          </div>
        </div>
      )
      console.log({profile: profile, loginButton: loginButton})
    }
    return(
      <div className="home-white-div">
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {title}
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {inputs}
        </ReactCSSTransitionGroup>
        {loginButton}
        {goToRegister}
        <div className={"home-black-div " + blackDivAnm}>
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            {profile}
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup
            transitionAppear={true}
            transitionAppearTimeout={600}
            transitionName="fade"
            transitionEnterTimeout={600}
            transitionLeaveTimeout={600}>
            {description}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}

export default Home;
