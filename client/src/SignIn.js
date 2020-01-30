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
    let passwordConfirm;
    let passwordConfirmLabel;
    let passwordValidationText;
    if (this.props.register) {
      emailInput = <input  onKeyPress={this.props.handleKeyPress} required id="email" className="register-email" type="text" onChange={this.props.onChange} name="email" />;
      emailLabel = <label htmlFor="email" className="register-email-label">Email</label>
      passwordConfirm = <input onKeyPress={this.props.handleKeyPress} id="password2" className="register-password" type="password" onChange={this.props.onChange} name="password2" />
      passwordConfirmLabel = <label htmlFor="password2" className="register-password-label">Confirm Password</label>
      passwordValidationText = <p>Must be 7 to 16 characters and include at least 1 letter, 1 number and 1 symbol</p>
    }
    return (
      <div className="sign-in-div">
        <form className="register-sign-in-form">
          <div className="register-sign-in-labels">
            <label htmlFor="name" required className="register-name-label">Username</label>
            {emailLabel}
            <label htmlFor="password" required className="register-password-label">Password</label>
            {passwordConfirmLabel}
          </div>
          <div className="register-sign-in-inputs">
            <input onKeyPress={this.props.handleKeyPress} id="name" className="register-name" type="text" onChange={this.props.onChange} name="name" />
            {emailInput}
            <input onKeyPress={this.props.handleKeyPress} id="password" className="register-password" type="password" onChange={this.props.onChange} name="password" />
            {passwordConfirm}
            {passwordValidationText}
          </div>
        </form>
      </div>

    );
  }
}

export default Register;
