import React, { Component } from 'react';
import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faLock, faTimes);

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit=this.handleSubmit.bind(this);
    this.onChange=this.onChange.bind(this);
    this.getClientInfo=this.getClientInfo.bind(this);
  }
  onChange(event) {
    this.setState({[event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    const body = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
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
      this.setState({token: res.token})
      console.log({state: this.state})
    })
  }
  getClientInfo() {
    let token = window.localStorage.getItem('token');
    if (!token) {
      token = this.state.token
    }
    fetch('/me', {
      headers: {
        "x-access-token": this.state.token
      }
    })
    .then(res => res.text())
    .then(res => console.log(res))
  }
  render() {
    return (
      <div className="sign-in-div">
        <div className="sign-in-gray-out" onClick={this.props.toggleSignIn}></div>
        <form className="register-sign-in-form" onSubmit={this.handleSubmit}>
          <div className="exit-register-sign-in" onClick={this.props.toggleSignIn}><FontAwesomeIcon icon="times" /></div>
          <p className="register-dialogue">Sign In</p>
          <input className="register-name" type="text" onChange={this.onChange} name="name" placeholder="username" />
          <div className="input-icon"><FontAwesomeIcon icon="user"/></div>
          <input className="register-password" type="password" onChange={this.onChange} name="password" placeholder="password" />
          <div className="input-icon"><FontAwesomeIcon icon="lock"/></div>
          <input className="register-submit" type="submit" value="Sign In" onSubmit={this.handleSubmit} />
          <button className="go-to-register" type="button" onClick={() => {this.props.toggleSignIn(); this.props.toggleRegister()}}>register an account</button>
        </form>
      </div>

    );
  }
}

export default Register;
