import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

export default class CreateUserButton extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  onClick = () =>{

  }
  render() {
    return (
      <Button onClick = {this.onClick} >Create User</Button>
    );
  }
}
