import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

export default class CreateUserButton extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Button onClick = {this.props.onClick} bsStyle={this.props.bsStyle}>Create User</Button>
    );
  }
}
