//must not be allowed to add list-item without information
//toggle buttons also toggle out of other divs


import React, { Component } from 'react';
import './App.css';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Register from './Register.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faChevronRight, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ListItem from './NewListItem.js';
import List from './List';
import SignIn from './SignIn.js';
import Home from './Home.js';
import ListApp from './ListApp.js';

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

class FullApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return(
      <div>
        <Header />
        <ListApp />
      </div>
    )
  }
}

class Header extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      menu: false,
      signIn: false,
      register: false
    };
    this.toggleMenu=this.toggleMenu.bind(this);
    this.toggleRegister=this.toggleRegister.bind(this);
    this.toggleSignIn=this.toggleSignIn.bind(this);
  }
  toggleMenu() {
    this.setState({menu: !this.state.menu});
  }
  toggleSignIn() {
    this.setState({signIn: !this.state.signIn, menu: false})
  }
  toggleRegister() {
    this.setState({register: !this.state.register, menu: false});
  }
  render() {
    let menu;
    if (this.state.signedIn && this.state.menu) {
      let myLists;
      if (this.state.userLists) {
        myLists = this.state.userLists.map(x => <button>{x.title}</button>)
      }
      menu = (
        <div className="menu">
          <button onClick={this.toggleSignIn}>Sign Out</button>
          <button>Save</button>
          <button>My Lists</button>
          {myLists}
        </div>
      )
    }
    let register;
    if (this.state.register) {
      register = <Register toggleRegister={this.toggleRegister} />
    }
    let signIn;
    if (this.state.signIn) {
      signIn = <SignIn toggleRegister={this.toggleRegister} toggleSignIn={this.toggleSignIn} />
    }
    if (!this.state.signedIn && this.state.menu) {
      menu = (
        <div className="menu">
          <button onClick={this.toggleSignIn}>Sign In</button>
          <button disabled>Save</button>
          <button disabled>My Lists</button>
        </div>
      )
    }
    return(
      <header>
        <button className="menu-button" onClick={this.toggleMenu} style={{backgroundColor: this.state.menu?'rgba(255,255,255,.3)':'black'}}><div className="menu-bars"></div></button>
        {menu}
        {signIn}
        {register}
      </header>
    )
  }
}



class App extends Component {
  constructor(props) {
    super(props);
    }
    render() {
      return(
        <Router>
          <div>
            <Route path="/" exact={true} component={Home} />
            <Route path="/project/:token/:id" component={ListApp} />
          </div>
        </Router>
      )
    }
}

export default App;
