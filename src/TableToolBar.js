import React, { Component } from 'react';
import RefreshButton from './Buttons/RefreshButton';
import CreateUserButton from './Buttons/CreateUserButton';

export default class TableToolBar extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='TableToolBar'>
        <RefreshButton onClick={this.props.refresh}></RefreshButton>
        <CreateUserButton></CreateUserButton>
      </div>
    );
  }

}
