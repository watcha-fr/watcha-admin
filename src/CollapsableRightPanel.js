import React, { Component } from 'react';
import RoomRightPanel from './RoomRightPanel.js';
import UserRightPanel from './UserRightPanel.js';

export default class CollapsableRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  }


  onClose = () => {
    this.props.close();
  }


  componentWillReceiveProps(nextProps) {
    this.setState({emailValue: ''});
  }

  getPanel = () => {
    let panel;
    switch (this.props.tableName) {
      case 'user':
        panel = <UserRightPanel data={this.props.data} close={this.onClose} />;
        break;
      case 'room':
        panel = <RoomRightPanel data={this.props.data} close={this.onClose} />;
        break;
      default:
        panel=<UserRightPanel data={this.props.data} close={this.onClose} />;
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
