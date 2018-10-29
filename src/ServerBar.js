import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';


export default class ServerBar extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className = 'ProgressBarContainer'>
        <div>{ this.props.label }</div>
        <ProgressBar now={this.props.percent} label={`${this.props.percent}%`} />
      </div>

    );
  }
}
