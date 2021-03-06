import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faChevronRight, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SignIn from './SignIn.js';
import Profile from './Profile.js';

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
      profile: false,
      //errorNumber is for id's for the error message divs
      errorNumber: 0
    };
    this.onChange=this.onChange.bind(this);
    this.toggleSignIn=this.toggleSignIn.bind(this);
    this.toggleRegister=this.toggleRegister.bind(this);
    this.registerSubmit=this.registerSubmit.bind(this);
    this.loginSubmit=this.loginSubmit.bind(this);
    this.handleKeyPress=this.handleKeyPress.bind(this);
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
      password2: this.state.password2,
      profileColor: getRandomColor()
    }

    if (!body.name) {
      this.setState({message: "username required", errorNumber: this.state.errorNumber + 1});
      return
    }
    if (!body.email) {
      this.setState({message: "email required", errorNumber: this.state.errorNumber + 1});
      return
    }
    if (!body.password) {
      this.setState({message: "password required", errorNumber: this.state.errorNumber + 1});
      return
    }
    if (body.password !== body.password2) {
      this.setState({message: "passwords do not match", errorNumber: this.state.errorNumber + 1});
      return
    }
    if (!RegExp(/^.{7,16}$/).test(body.password)) {
      this.setState({message: "password must be between 7 and 16 characters", errorNumber: this.state.errorNumber + 1});
      return
    }
    if (!RegExp(/(?=.*\d)(?=.*\w)(?=.*\W)/).test(body.password)) {
      this.setState({message: "password must contain at least one letter, one number and one symbol", errorNumber: this.state.errorNumber + 1});
      return
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
    .then(res => res.json())
    .then(res => {
      if (res.message) {
        this.setState({message: res.message, errorNumber: this.state.errorNumber + 1})
        return
      }
      console.log(res);
      window.localStorage.setItem('token', res.token)
      this.setState({token: res.token, userData: res.userData, message: ''})
      console.log({state: this.state})
    })
  }
  loginSubmit() {
    console.log({
      stateName: this.state.name,
      statePass: this.state.password
    })
    if (!this.state.name) {
      this.setState({message: "please enter a username", errorNumber: this.state.errorNumber +1});
      return
    }
    if (!this.state.password) {
      this.setState({message: "please enter a password", errorNumber: this.state.errorNumber +1});
      return
    }
    fetch('/signIn?name=' + this.state.name + '&password=' + this.state.password)
    .then(res => res.json())
    .then(res => {
      if (res.message) {
        this.setState({message: res.message, errorNumber: this.state.errorNumber + 1})
        console.log(this.state)
        return
      }
      window.localStorage.setItem('token', res.token)
      this.setState({token: res.token, userData: res.userData, message: ''})
      console.log(this.state)
    })
  }
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      if (this.state.signIn) {
        this.loginSubmit()
      }else if (this.state.register) {
        this.registerSubmit(event);
      }
    }
  }
  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      console.log({
        token: token,
        message: "trying to login a token"
      })
      fetch('/me', {
        headers: {
          "x-access-token": token
        }
      })
      .then(res => res.json() )
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
  render() {
    let title;
    let homeButtonFn = this.toggleSignIn;
    let inputs;
    let loginButton = <button className="login-button" onClick={this.toggleSignIn} type="button"><div>Login</div></button>;
    let goToRegister;
    let blackDivAnm = "stretch-right";
    let description;
    let profile;
    let localToken = window.localStorage.getItem('token');
    let message;
    if (!localToken) {
      description = (
        <p className="home-description">
          A simple list making, item creating, 
          progress tool that will help you <br/>
          organize a project from beginning to end
        </p>
      );
      title = <h1 className="home-title">Simple<br/>Task</h1>;
    }
    if (this.state.signIn || this.state.register) {
      description = null;
      blackDivAnm = "stretch-left";
    }
    if (this.state.signIn && !this.state.userData) {
      inputs = <SignIn handleKeyPress={this.handleKeyPress} toggleRegister={this.toggleRegister} onChange={this.onChange} toggleSignIn={this.toggleSignIn}/>;
      loginButton = <button className="login-button sign-in-button" onClick={this.loginSubmit} type="button"><FontAwesomeIcon icon="chevron-right" /></button>;
      goToRegister = <button className="go-to-register" type="button" onClick={this.toggleRegister}>register an account</button>
    }else if (this.state.register && !this.state.userData) {
      inputs = <SignIn handleKeyPress={this.handleKeyPress} register={true} onChange={this.onChange} toggleRegister={this.toggleRegister} />;
      loginButton = <button className="login-button sign-in-button" onClick={this.registerSubmit} type="button"><FontAwesomeIcon icon="chevron-right" /></button>;
    }
    if (this.state.userData) {
      console.log({state: this.state})
      console.log('buidling profile')
      blackDivAnm = "stretch-right-less";
      loginButton = null;
      profile = <Profile userData={this.state.userData} token={this.state.token} />
      console.log({profile: profile, loginButton: loginButton})
    }
    if (this.state.register || this.state.signIn && this.state.message) {
      console.log({number: this.state.errorNumber});
      message = <div className="error-message" key={this.state.errorNumber}>{this.state.message}</div>
    }
    return(
      <div className="home-white-div">
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {title}
        </ReactCSSTransitionGroup>
        {message}
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
