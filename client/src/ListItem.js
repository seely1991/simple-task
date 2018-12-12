import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Textarea from 'react-textarea-autosize';

library.add(faPlusCircle, faTimesCircle, faEdit, faChevronLeft, faCog, faTrash, faPencilAlt);


class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editListItemDiv: false,
      moveItDiv: false,
      name: this.props.item.item,
      note: this.props.item.note
    };
    this.toggleEditListItemDiv=this.toggleEditListItemDiv.bind(this);
    this.onChange=this.onChange.bind(this);
    this.toggleMoveItDiv=this.toggleMoveItDiv.bind(this);
    this.toggleShowNotes=this.toggleShowNotes.bind(this);
  }
  toggleEditListItemDiv() {
    this.setState({editListItemDiv: !this.state.editListItemDiv});
  }
  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }
  toggleMoveItDiv(){
    this.setState({moveItDiv: !this.state.moveItDiv})
  }
  toggleShowNotes() {
    console.log("showing notes")
    this.setState({showNotes: !this.state.showNotes})
  }
  render() {
    console.log({
      props: this.props
    })
    let editListItemDiv;
    if (this.state.editListItemDiv) {
      editListItemDiv = (
        <div className="add-list-item-div edit-list-item-div">
          <div className="add-list-item-name">
            <button className="add-item-exit" onClick={this.toggleEditListItemDiv}><FontAwesomeIcon icon="times" /></button>
            <h4 className="new-item-header">Edit Item</h4>
            <button className="add-item-save" onClick={() => {this.props.editListItem(this.props.list, this.state.name, this.state.note, this.props.item.id); this.toggleEditListItemDiv()}}>SAVE</button>
            <label className="add-item-label" for="item">Enter item name</label>
            <input className="add-item-name-input" type="text" defaultValue={this.props.item.item} name="name" onChange={this.onChange}/>
          </div>
          <div className="add-item-notes">
            <label className="add-item-label" for="notes">Notes</label>
            <Textarea className="add-item-notes-input" defaultValue={this.props.item.note} name="note" onChange={this.onChange}/>
            <button className="item-delete" onClick={() => {this.toggleEditListItemDiv(); setTimeout(this.props.deleteListItem, 50)}}>Delete</button>
          </div>
        </div>
      )
    }
    let visible = 'visible';
    if (this.state.editListItemDiv) {
      visible = 'hidden'
    }
    let notes;
    if (this.props.item.note && this.state.showNotes) {
      notes = (
        <div className="item-note">
          <Textarea className="item-note-text-area" defaultValue={this.props.item.note} />
        </div>
      )
    }

    let moveItDiv;
    if (this.state.moveItDiv) {
      console.log({
        listProps: this.props,
      })
      let filteredLists = this.props.lists.filter(x => x !== this.props.list)
      let listNames = filteredLists.map(x => <button className="list-names" onClick={() => {this.toggleMoveItDiv(); this.props.assignToList(this.props.list, x, this.props.item);}}>{x.title}</button>)
      moveItDiv = (
        <div className="move-it-div">
          <button className="exit-move-it-div" onClick={this.toggleMoveItDiv}><FontAwesomeIcon icon="times" /></button>
          <button className="move-it-to" onClick={this.toggleMoveItDiv}>move it to:</button>
          {listNames}
        </div>
      )
    }

    return(
      <div className="list-item-move-it-div-container">
        <div className="list-item">
          <div className="item-div">
            <div className="item-name" onClick={this.toggleShowNotes} >{this.props.item.item}</div>
            <div className="item-edit-buttons" >
              <button className="item-edit" onClick={this.toggleEditListItemDiv}><FontAwesomeIcon icon="pencil-alt" /></button>
              <button className="move-it-button" disabled={this.props.lists.length < 2} onClick={this.toggleMoveItDiv}>move it</button>
            </div>
            <ReactCSSTransitionGroup
              transitionName="stretch-down"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}>
              {notes}
            </ReactCSSTransitionGroup>
          </div>
          <ReactCSSTransitionGroup
              transitionName="stretch-down"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}>
            {editListItemDiv}
          </ReactCSSTransitionGroup>
        </div>

        <ReactCSSTransitionGroup
            transitionName="stretch-down"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
          {moveItDiv}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default ListItem;