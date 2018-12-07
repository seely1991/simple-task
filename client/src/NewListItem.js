import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Textarea from 'react-textarea-autosize';

library.add(faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog, faTrash);


class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editListItemDiv: false,
      moveItDiv: false
    };
    this.onChange=this.onChange.bind(this);
    this.toggleMoveItDiv=this.toggleMoveItDiv.bind(this);
  }
  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }
  toggleMoveItDiv(){
    this.setState({moveItDiv: !this.state.moveItDiv})
  }
  render() {
    let editListItemDiv;
    if (this.state.editListItemDiv) {
      editListItemDiv = (
        <div className="edit-list-item-div">
          <input className="edit-item-name-input" type="text" name="newName" placeholder="item" onChange={this.onChange} />
          <input className="edit-item-notes-input" type="text" name="newNotes" placeholder="notes" onChange={this.onChange} />
          <button className="item-delete" onClick={() => {this.toggleEditListItemDiv(); this.props.deleteListItem()}}>Delete</button>
          <button className="save-item-edit" type="button" onClick={() => {this.props.editListItem(this.props.list, this.props.item, this.state.newName, this.state.newNotes); this.toggleEditListItemDiv()}}>Save</button>
        </div>
      )
    }
    let visible = 'visible';
    if (this.state.editListItemDiv) {
      visible = 'hidden'
    }
    let notes;
    if (this.props.item.notes) {
      notes = <div style={{visibility: visible}}className="item-note">{this.props.item.notes}</div>
    }

    let moveItDiv;
    if (this.state.moveItDiv) {
      console.log({
        listProps: this.props,
      })
      let filteredLists = this.props.lists.filter(x => x !== this.props.list)
      let listNames = filteredLists.map(x => <button className="list-names" onClick={() => {this.props.assignToList(this.props.list, x, this.props.item); this.toggleMoveItDiv()}}>{x.title}</button>)
      moveItDiv = (
        <div className="move-it-div">
          <button className="exit-move-it-div" onClick={this.toggleMoveItDiv}>move it</button>
          {listNames}
        </div>
      )
    }

    return(
      <div className="list-item-move-it-div-container">
        <div className="item-div">
          <Textarea className="item-note" defaultValue={this.props.item.value} onChange={(event) => this.props.editListItem(this.props.list, event.target.value, this.props.item.id)}/>
          <div className="item-edit-buttons" style={{visibility: visible}}>
            <button className="move-it-button" disabled={this.props.lists.length < 2} onClick={this.toggleMoveItDiv}>move it</button>
            <button className="item-delete" onClick={this.props.deleteListItem}><FontAwesomeIcon icon="trash" /></button>
          </div>
        </div>
        <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
          {moveItDiv}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default ListItem;