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
    let filtersOption;
    if (this.props.tab === 'user') {
      filtersOption = <div className='filtersOption'>
        <CreateUserButton onClick={this.createUser} />
        <RefreshButton onClick={this.props.refresh} />
        <div className='checkboxfilter'>
          <label>Hide members</label>
          <input type="checkbox" name="hideMembers" onChange = {this.props.handleFilter} />
        </div>
        <div className='checkboxfilter'>
          <label>Hide partners</label>
          <input type="checkbox" name="hidePartners" onChange = {this.props.handleFilter} />
        </div>
        <div className='textFilter'>
          <input type="text" name="textFilter" onChange = {this.props.handleFilter} />
        </div>
      </div>;
    }
    if (this.props.tab === 'room') {
      filtersOption =
      <div className='filtersOption'>
        <RefreshButton onClick={this.props.refresh} />
        <div className='checkboxfilter'>
          <label>Hide one to one</label>
          <input type="checkbox" name="hideOneToOne" onChange = {this.props.handleFilter} />
        </div>
        <div className='checkboxfilter'>
          <label>Hide inactive</label>
          <input type="checkbox" name='hideInactive' onChange = {this.props.handleFilter} />
        </div>
        <div className='textFilter'>
          <input type="text" name="textFilter" onChange = {this.props.handleFilter} />
        </div>
      </div>;
    }
    return (
      <div className='TableToolBar'>
        { filtersOption }
      </div>
    );
  }
}
