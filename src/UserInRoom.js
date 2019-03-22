import React, { Component } from 'react';

class UserInRoom extends Component {
  onUserClicked= () => {
    this.props.onUserClicked(this.props.userName);
  }
  render() {
    return (
      <span onClick={this.onUserClicked}>
        { this.props.simplifiedName }
      </span>
    );
  }
}

export default UserInRoom;
