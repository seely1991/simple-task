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
import ListItem from './ListItem.js';
import List from './List';
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
  render() {
    let title = <h1 className="home-title">Simple<br/>Task</h1>;
    let homeButtonFn = this.toggleSignIn;
    let inputs;
    let loginButton = <button className="login-button" onClick={this.toggleSignIn} type="button"><div>Login</div></button>;
    let goToRegister;
    let blackDivAnm = "stretch-right";
    let description = (
      <p className="home-description">
        A simple list making, item creating, 
        progress tool that will help you <br/>
        organize a project from beginning to end
      </p>
    );
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
      console.log('buidling profile')
      title = null;
      blackDivAnm = "stretch-right-less";
      loginButton = null;
      let projects = this.state.userData.projects.map(x => (
        <a className="project-link" href={'/project/' + x.name}>
          <p className="project-name">{x.name}</p>
          <p className="project-date">{x.updated}</p>
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
            <p className="project-name">Name</p><p className="project-date">last Updated</p>
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

class ListApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultListNumber: 0,
      lists: [],
      editListDiv: false,
      color: ''
    };
    this.getRandomKey=this.getRandomKey.bind(this);
    this.onChange=this.onChange.bind(this);
    this.addList=this.addList.bind(this);
    this.addListItem=this.addListItem.bind(this);
    this.deleteList=this.deleteList.bind(this);
    this.deleteListItem=this.deleteListItem.bind(this);
    this.editList=this.editList.bind(this);
    this.assignToList=this.assignToList.bind(this);
    this.editListItem=this.editListItem.bind(this);
    this.changeTheme=this.changeTheme.bind(this);
    //this.addListItem=this.addListItem.bind(this);
  }
  getRandomKey(suffix) {
    const divKeys = [];
    this.state.lists.map((x) => divKeys.push(x.key));
    console.log({divKeys: divKeys});
    let key = suffix + Math.floor(Math.random() * 1000000).toString();
    if (!divKeys.includes(key)) {
      divKeys.push(key);
      console.log({returnedKeyFirstTry: key})
      return key;
    }else{
      while (divKeys.includes(key)) {
        key = suffix + (Math.floor(Math.random() * 1000000)).toString();
        if (!divKeys.includes(key)) {
          divKeys.push(key);
          console.log({returnedKeyAfterNewTry: key})
          return key;
        }
      }
    }
  }
  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }
  addList() {
    this.setState({defaultListNumber: this.state.defaultListNumber + 1});
    const listArr = this.state.lists;
    listArr.push({
      title: "list " + (this.state.defaultListNumber + 1), 
      items: [],
      color: this.state.color,
      key: this.getRandomKey('li')
    });
    this.setState({lists: listArr, color: getRandomColor()});
  }
  addListItem(item, notes, list) {
    if (!item && !notes) return
    const index = this.state.lists.findIndex(x => JSON.stringify(x) === JSON.stringify(list));
    console.log(index);
    console.log(list);
    let items = this.state.lists[index].items;
    items.push({
      item: item,
      notes: notes,
      index: items.length
    })
  }
  deleteList(list) {
    const listArr = this.state.lists;
    const index = listArr.indexOf(list);
    listArr.splice(index, 1);
    this.setState({lists: listArr});
  }
  deleteListItem(list, item) {
    console.log('did something')
    const listArr = this.state.lists;
    const listIndex = listArr.indexOf(list);
    const thisList = listArr[listIndex];
    const listItems = thisList.items;
    const itemIndex = listItems.indexOf(item);
    listItems.splice(itemIndex, 1);
    thisList.items = listItems;
    listArr.splice(listIndex, 1, thisList);
    this.setState({lists: listArr})
  }
  editList(list, title) {
    if (!title) {return}
    const listArr = this.state.lists;
    const index = listArr.indexOf(list);
    list.title = title;
    listArr.splice(index, 1, list);
    this.setState({lists: listArr});
  }
  assignToList(currentList, newList, item) {
    console.log(item);
    this.addListItem(item.item, item.notes, newList);
    this.deleteListItem(currentList, item);
  }
  editListItem(list, item, name, notes) {
    const listArr = this.state.lists;
    const listIndex = listArr.indexOf(list);
    const itemIndex = list.items.indexOf(item);
    item.item = name;
    item.notes = notes;
    list.items[itemIndex] = item;
    listArr[listIndex] = list;
    this.setState({listArr});
  }
  changeTheme(list, color) {
    const listArr = this.state.lists;
    const listIndex = listArr.findIndex(x => JSON.stringify(x) === JSON.stringify(list));
    list.color = color;
    listArr.splice(listIndex, 1, list);
    this.setState({lists: listArr});
  }
  componentWillMount() {
    this.setState({color: getRandomColor()})
  }
  render() {
    console.log(this.state)
    let lists = this.state.lists.map((x, y) => {
      return(
          <List lists={this.state.lists} 
          data={x}
          key={x.key} 
          addListItem={this.addListItem} 
          deleteList={this.deleteList} 
          deleteListItem={this.deleteListItem} 
          toggleEditListDiv={this.toggleEditListDiv} 
          editList={this.editList} 
          editListItem={this.editListItem} 
          assignToList={this.assignToList}
          changeTheme={this.changeTheme}
          />
      )
    })
    return(
      <main>
        <ReactCSSTransitionGroup
            transitionName="new-list"
            transitionEnterTimeout={900}
            transitionLeaveTimeout={700}>
          {lists}
        </ReactCSSTransitionGroup>
        <button key="add-list-button" style={{left: this.state.lists.length*400 + "px", color: this.state.color}} id="add-list" onClick={this.addList}><FontAwesomeIcon icon="plus-circle" /><p>Create New List</p></button>
      </main>
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
            <Route path="/projects" component={ListApp} />
          </div>
        </Router>
      )
    }
}

export default App;
