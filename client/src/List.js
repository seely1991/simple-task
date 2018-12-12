import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ListItem from './ListItem.js';
import Textarea from 'react-textarea-autosize';

library.add(faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog);

class ThemeButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const colors = [
      {
        background: '#EB6738',
        border: '#E46524'
      },
      {
        background: '#8A83E0',
        border: '#625D86'
      },
      {
        background: '#DF89FA',
        border: ''
      },
      {
        background: '#F3C734',
        border: ''
      },
      {
        background: '#F09D46',
        border: '#E46524'
      },
      {
        background: '#959595',
        border: ''
      },
    ]
    const themeButtons = colors.map(x => {
      let button = <button className="theme-button-circle" onClick={() => this.props.changeTheme(this.props.list, x.background)} style={{backgroundColor: x.background}} />;
      if (this.props.list.color === x.background) {
        let borderColor = "rgba(0,0,0,.3)";
        if (x.border) {
          borderColor = x.border;
        }
        button = <button className="theme-button-circle theme-button-circle-selected" style={{borderColor: borderColor, backgroundColor: x.background}} onClick={() => this.props.changeTheme(this.props.list, x.background)} />
      }
      return(
      <div className="theme-button-div">
        {button}
      </div>
        )}) 
    return(
      <div className="theme-buttons">
      <h5 className="list-theme-header">List Theme</h5>
        {themeButtons}
      </div>
    )
  }
}

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editListDiv: false,
      moveItDiv: false,
      currentListItem: '',
      title: this.props.data.title
    };
    this.toggleEditListDiv=this.toggleEditListDiv.bind(this);
    this.toggleAddListItemDiv=this.toggleAddListItemDiv.bind(this);
    this.onChange=this.onChange.bind(this);
    this.hideAddListItemDiv=this.hideAddListItemDiv.bind(this);
    this.toggleMoveItDiv=this.toggleMoveItDiv.bind(this);
    this.showEditListDiv=this.showEditListDiv.bind(this);
  }
  toggleAddListItemDiv() {
    this.setState({
      addListItemDiv: !this.state.addListItemDiv,
      item: '',
      notes: ''
    });
  }
  hideAddListItemDiv() {
    this.setState({addListItemDiv: false})
  }
  toggleEditListDiv() {
    this.setState({editListDiv: !this.state.editListDiv, addListItemDiv: false})
  }
  showEditListDiv() {
    this.setState({editListDiv: true});
  }
  onChange(event) {
    this.setState({[event.target.name]: event.target.value})
    console.log({changed: this.state})
  }
  toggleMoveItDiv(item) {
    if (!this.state.moveItDiv) {
      this.setState({currentListItem: item})
    }
    this.setState({moveItDiv: !this.state.moveItDiv});
  }
  render() {
    let items;
    if (this.props.data.items) {
      items=this.props.data.items.map(x => (
        <ListItem item={x} 
        key={x.id}
        deleteListItem={() => this.props.deleteListItem(this.props.data, x)} 
        assignToList={this.props.assignToList} 
        list={this.props.data} 
        lists={this.props.lists}
        editListItem={this.props.editListItem}
        toggleMoveItDiv={this.toggleMoveItDiv}
        assignToList={this.props.assignToList}
       />));
    }
    let addListItemDiv;
    if (this.state.addListItemDiv) {
      addListItemDiv = (
        <div className="add-list-item-div">
          <div className="add-list-item-name">
            <button className="add-item-exit" onClick={this.toggleAddListItemDiv}><FontAwesomeIcon icon="times" /></button>
            <h4 className="new-item-header">New Item</h4>
            <button className="add-item-save" onClick={() => {this.props.addListItem(this.state.item, this.state.notes, this.props.data); this.toggleAddListItemDiv()}}>SAVE</button>
            <label className="add-item-label" for="item">Enter item name</label>
            <input className="add-item-name-input" type="text" name="item" onChange={this.onChange}/>
          </div>
          <div className="add-item-notes">
            <label className="add-item-label" for="notes">Notes</label>
            <Textarea className="add-item-notes-input" name="notes" onChange={this.onChange}/>
          </div>
        </div>
      )
    }
    let editListDiv;
    if (this.state.editListDiv) {
      editListDiv = (

        <div key={this.props.data.title} className="edit-list-div">
          <div className="edit-list-white">
            <button className="exit-edit" style={{color: this.props.data.color}} onClick={this.toggleEditListDiv}><FontAwesomeIcon icon="chevron-left" /></button>
            <h3 className="edit-list-header" style={{color: this.props.data.color}}>Edit List</h3>
            <input className="edit-list-input"  style={{color: this.props.data.color}} type="text" name="title" placeholder={this.state.title} onChange={this.onChange} />
            <button className="save-list-edit" style={{color: this.props.data.color}} onClick={() => {this.props.editList(this.props.data, this.state.title); this.toggleEditListDiv()}}>Save</button>
          </div>
          <div className="bottom-edit-list-div">
            <ThemeButtons list={this.props.data} changeTheme={this.props.changeTheme} />
            <button className="delete-list" onClick={() => {this.props.deleteList(this.props.data); this.toggleEditListDiv()}}>Delete List</button>
          </div>
        </div>
      )
    }

    let listContents;
    if (!this.state.editListDiv) {
      listContents = (
        <div className="list-contents" >
            <div className="list-item-div">
              <ReactCSSTransitionGroup
                transitionName="new-list-item"
                transitionEnterTimeout={700}
                transitionLeaveTimeout={700}>
                {items}
              </ReactCSSTransitionGroup>
            </div>
            <ReactCSSTransitionGroup
                transitionName="stretch-down"
                transitionEnterTimeout={700}
              transitionLeaveTimeout={700}>
              {addListItemDiv}
            </ReactCSSTransitionGroup>
            <div className="add-list-item-button-div">
              <button className="add-list-item" style={{visibility: listItemVisibility}} onClick={() => this.toggleAddListItemDiv()}><div className="plus-circle" /></button>
            </div>
          </div>
      )
    }

    let listItemVisibility = 'visible';
    if (this.state.editListDiv) {listItemVisibility = 'hidden'}
    return(
      <div className="list" style={{backgroundColor: this.props.data.color, color: this.props.data.color}}>
        <div className="list-title-div">
          <div className="list-title">{this.state.title}</div>
          <button className="edit-list" onClick={this.toggleEditListDiv}><FontAwesomeIcon icon="cog"/></button>
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
            {editListDiv}
          </ReactCSSTransitionGroup>
        </div>
        <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
          {listContents}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default List;