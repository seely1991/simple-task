//must not be allowed to add list-item without information
//toggle buttons also toggle out of other divs


/*to save you need: 
  {
    title:
    lists:

  }
*/

import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faChevronRight, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ListItem from './ListItem.js';
import List from './List';

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

class ListApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultListNumber: 0,
      title: this.props.match.params.title,
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
    this.updateProject=this.updateProject.bind(this);
    this.saveToServer=this.saveToServer.bind(this);
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
  updateProject() {
    let body = {
      title: this.state.title,
      lists: this.state.lists,
      updated: this.state.updated,
      listId: this.props.match.params.id
    };
    fetch('/update', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.props.match.params.token
      },
      body: JSON.stringify(body)
    })
    .then(res => res.text())
    .then(res => console.log(res))
  }
  saveToServer() {
    clearTimeout(this.saving);
    this.saving = setTimeout(this.updateProject, 2000);
  }
  onChange(event) {
    this.saveToServer();
    this.setState({[event.target.name]: event.target.value});
    console.log({state: this.state})
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
    this.saveToServer();
  }
  addListItem(list, value) {
    if (!value) {let value=""}
    console.log({value: value})
    const listArr = this.state.lists;
    const index = listArr.findIndex(x => JSON.stringify(x) === JSON.stringify(list));
    listArr[index].items.push({
      value: value,
      id: this.getRandomKey("item")
    })
    this.setState({lists: listArr});
    this.saveToServer();
  }
  deleteList(list) {
    const listArr = this.state.lists;
    const index = listArr.indexOf(list);
    listArr.splice(index, 1);
    this.setState({lists: listArr});
    this.saveToServer();
  }
  deleteListItem(list, item) {
    console.log('did something')
    const listArr = this.state.lists;
    const listIndex = listArr.indexOf(list);
    const thisList = listArr[listIndex];
    const listItems = thisList.items;
    const itemIndex = listItems.findIndex(x => x.id === item.id);
    listItems.splice(itemIndex, 1);
    thisList.items = listItems;
    listArr.splice(listIndex, 1, thisList);
    this.setState({lists: listArr});
    this.saveToServer();
  }
  editList(list, title) {
    if (!title) {return}
    const listArr = this.state.lists;
    const index = listArr.indexOf(list);
    list.title = title;
    listArr.splice(index, 1, list);
    this.setState({lists: listArr});
    this.saveToServer();
  }
  assignToList(currentList, newList, item) {
    console.log(item);
    this.addListItem(newList, item.value);
    this.deleteListItem(currentList, item);
    this.saveToServer();
  }
  editListItem(list, value, id) {
    const listArr = this.state.lists;
    const listIndex = listArr.indexOf(list);
    const itemIndex = list.items.findIndex(x => x.id === id);
    list.items[itemIndex].value = value;
    listArr[listIndex] = list;
    this.setState({lists: listArr});
    console.log({editedList: this.state});
    this.saveToServer();
  }
  asdeditListItem(list, value, id) {
    const listArr = this.state.lists;
    const listIndex = listArr.indexOf(list);
    const itemIndex = list.items.indexOf(id);
  }
  changeTheme(list, color) {
    const listArr = this.state.lists;
    const listIndex = listArr.findIndex(x => JSON.stringify(x) === JSON.stringify(list));
    list.color = color;
    listArr.splice(listIndex, 1, list);
    this.setState({lists: listArr});
    this.saveToServer();
  }
  saveList() {

  }
  componentWillMount() {
    this.setState({color: getRandomColor()})
  }
  componentDidMount() {
    console.log(this.props.match.params)
    if (this.props.match.params.token) {
      fetch('/me', {
        headers: {
          "x-access-token": this.props.match.params.token
        }
      })
      .then(res => res.text())
      .then(res => {
        if (this.props.match.params.id) {
          res = JSON.parse(res);
          const project = res.projects.filter(x => x._id === this.props.match.params.id)[0];
          console.log({project: project})
          this.setState({
            userData: res,
            lists: project.lists,
            title: project.title,
            updated: project.updated
          });
          console.log({state: this.state})
        }
      })
    }
  }
  render() {
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
        <input type="text" className="project-title" name="title" onChange={this.onChange} defaultValue={this.state.title} />
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

export default ListApp;
