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
    let emailInput;
    let emailLabel;
    if (this.props.register) {
      emailInput = <input id="email" className="register-email" type="text" onChange={this.props.onChange} name="email" />;
      emailLabel = <label for="email" className="register-email-label">Email</label>
    }
    return (
      <div className="sign-in-div">
        <form className="register-sign-in-form" onSubmit={this.handleSubmit}>
          <div className="register-sign-in-labels">
            <label for="name" className="register-name-label">Username</label>
            {emailLabel}
            <label for="password" className="register-password-label">Password</label>
          </div>
          <div className="register-sign-in-inputs">
            <input id="name" className="register-name" type="text" onChange={this.props.onChange} name="name" />
            {emailInput}
            <input id="password" className="register-password" type="password" onChange={this.props.onChange} name="password" />
          </div>
        </form>
      </div>

    );
  }
}

export default Register;
