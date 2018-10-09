import React, { Component } from 'react';
import RefreshButton from './Buttons/RefreshButton';
import CreateUserButton from './Buttons/CreateUserButton';

export default class TableToolBar extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  createUser = () =>{
    const panel = {'type': 'createUser'};
    this.props.setRightPanel(panel);
  }


  render() {
    let userButton;
    if (this.props.tab === 'user') {
      userButton = <CreateUserButton onClick={this.createUser} />;
    }
    return (
      <div className='TableToolBar'>
        <RefreshButton onClick={this.props.refresh} />
        { userButton }
      </div>
    );
  }
}
