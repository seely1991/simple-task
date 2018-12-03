//must not be allowed to add list-item without information
//toggle buttons also toggle out of other divs


import React, { Component } from 'react';
import './App.css';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Register from './Register.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ListItem from './ListItem.js';
import List from './List';
import SignIn from './SignIn.js';

library.add(faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog, faBars);

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
    this.state = {};
  }
  render() {
    return(
      <p>Here is Home</p>
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
    this.setState({signIn: !this.state.signIn})
  }
  toggleRegister() {
    this.setState({register: !this.state.register});
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
            <Header />
            <Route path="/register" component={Register} />
            <Route exact={true} path="/" component={Home} />
            <Route path="/myLists" component={ListApp} />
            <Route path="/sign-in" component={SignIn} />
          </div>
        </Router>
      )
    }
}

export default App;
