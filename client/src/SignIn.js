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
    this.onChange=this.onChange.bind(this);
  }
  onChange(event) {
    this.setState({[event.target.name]: event.target.value });
  }
  render() {
    let emailInput;
    let emailLabel;
    if (this.props.register) {
      emailInput = <input  onKeyPress={this.props.handleKeyPress} reduired id="email" className="register-email" type="text" onChange={this.props.onChange} name="email" />;
      emailLabel = <label for="email" className="register-email-label">Email</label>
    }
    return (
      <div className="sign-in-div">
        <form className="register-sign-in-form">
          <div className="register-sign-in-labels">
            <label for="name" required className="register-name-label">Username</label>
            {emailLabel}
            <label for="password" required className="register-password-label">Password</label>
          </div>
          <div className="register-sign-in-inputs">
            <input onKeyPress={this.props.handleKeyPress} id="name" className="register-name" type="text" onChange={this.props.onChange} name="name" />
            {emailInput}
            <input onKeyPress={this.props.handleKeyPress} id="password" className="register-password" type="password" onChange={this.props.onChange} name="password" />
          </div>
        </form>
      </div>

    );
  }
}

export default Register;
