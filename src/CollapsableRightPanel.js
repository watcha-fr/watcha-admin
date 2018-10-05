import React, { Component } from 'react';
import RoomRightPanel from './RoomRightPanel';
import UserRightPanel from './UserRightPanel';
import CreateUserRightPanel from './CreateUserRightPanel';

export default class CollapsableRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  }


  onClose = () => {
    this.props.onClose();
  }


  getPanel = () => {
    let panel;
    switch (this.props.panelType) {
      case 'user':
        panel = <UserRightPanel data={this.props.data} onClose={this.onClose} />;
        break;
      case 'room':
        panel = <RoomRightPanel data={this.props.data} onClose={this.onClose} />;
        break;
      case 'createUser':
        panel = <CreateUserRightPanel data={this.props.data} onClose={this.onClose} />;
        break;
      default:
        panel=<UserRightPanel data={this.props.data} onClose={this.onClose} />;
    }
    return panel;
  }
  render() {
    const panel=this.getPanel();

    return (
      <div> { panel } </div>
    );
  }
}
