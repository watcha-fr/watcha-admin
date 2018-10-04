import React, { Component } from 'react';
import {Glyphicon, Button} from 'react-bootstrap';

export default class RefreshButton extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  onClick = () =>{
    this.props.onClick();
  }

  render() {
    return (
      <Button onClick={this.onClick} bsSize="small" >
        <Glyphicon glyph="refresh" />
      </Button>
    );
  }
}
